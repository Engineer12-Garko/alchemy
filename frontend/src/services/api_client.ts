const localApi = 'http://127.0.0.1:8000/api'
const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
export const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED !== 'false'

export const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || (isLocalHost ? localApi : '/api')

const TOKEN_KEY = 'synapse.accessToken'

export interface ApiErrorShape {
  detail?: string
  message?: string
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
    const detail = typeof body === 'object' && body !== null && 'detail' in body
      ? (body as ApiErrorShape).detail
      : typeof body === 'string' ? body : undefined
    throw new ApiError(detail || `Request failed with HTTP ${response.status}`, response.status)
  }
  return body as T
}
