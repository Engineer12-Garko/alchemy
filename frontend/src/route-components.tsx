import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from './services/api_client'

export function RequireAuthentication() {
  return getAccessToken() ? <Outlet /> : <Navigate replace to="/auth" />
}
