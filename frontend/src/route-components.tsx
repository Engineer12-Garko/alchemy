import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_ENABLED, getAccessToken } from './services/api_client'

export function RequireAuthentication() {
  if (!AUTH_ENABLED) return <Outlet />
  return getAccessToken() ? <Outlet /> : <Navigate replace to="/auth" />
}
