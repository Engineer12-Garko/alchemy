const localApi = 'http://127.0.0.1:8000/api'
const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
export const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED !== 'false'

export const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || (isLocalHost ? localApi : '/api')

const TOKEN_KEY = 'synapse.accessToken'

export interface ApiErrorShape {
  detail?: unknown
  message?: string
}

function formatApiError(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const messages = value.map((entry) => {
      if (typeof entry === 'string') return entry
      if (typeof entry !== 'object' || entry === null) return undefined
      const item = entry as { loc?: unknown; msg?: unknown; message?: unknown }
      const message = typeof item.msg === 'string'
        ? item.msg
        : typeof item.message === 'string' ? item.message : undefined
      if (!message) return undefined
      const location = Array.isArray(item.loc)
        ? item.loc.filter((part) => typeof part === 'string' && !['body', 'query', 'path'].includes(part)).join(' → ')
        : ''
      return location ? `${location}: ${message}` : message
    }).filter((message): message is string => Boolean(message))
    return messages.length ? messages.join('; ') : undefined
  }
  if (typeof value === 'object' && value !== null) {
    const item = value as ApiErrorShape
    if (typeof item.message === 'string') return item.message
    try {
      return JSON.stringify(value)
    } catch {
      return undefined
    }
  }
  return undefined
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getAccessToken(): string | null {
  if (!AUTH_ENABLED) return null
  return window.sessionStorage.getItem(TOKEN_KEY)
}

export function saveAccessToken(token: string): void {
  window.sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken(): void {
  window.sessionStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  const isPublicAuthRequest = /^\/auth\/(login|register)$/.test(path)
  const token = isPublicAuthRequest ? null : getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'network error'
    throw new ApiError(`Could not reach the Alchemy API at ${API_BASE_URL}: ${reason}`, 0)
  }

  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('content-type') || ''
  const body: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text()
  if (!response.ok) {
    if (response.status === 401 && !isPublicAuthRequest && token) {
      clearAccessToken()
      window.location.assign('/auth')
    }
    const errorBody = typeof body === 'object' && body !== null && 'detail' in body
      ? (body as ApiErrorShape).detail
      : typeof body === 'object' && body !== null && 'message' in body
        ? (body as ApiErrorShape).message
        : body
    const detail = formatApiError(errorBody)
    throw new ApiError(detail || `Request failed with HTTP ${response.status}`, response.status)
  }
  return body as T
}
