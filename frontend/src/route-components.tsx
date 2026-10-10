import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import CourseMaterials from './features/materials/CourseMaterials'
import TutorWorkspace from './features/tutor_chat/TutorWorkspace'
import { getAccessToken } from './services/api_client'

export function RequireAuthentication() {
  return getAccessToken() ? <Outlet /> : <Navigate replace to="/auth" />
}

export function TutorRoute() {
  const navigate = useNavigate()
  return (
    <TutorWorkspace
      onNavigateToAssessment={() => navigate('/quiz')}
      onNavigateToMaterials={() => navigate('/resources')}
    />
  )
}

export function MaterialsRoute() {
  const navigate = useNavigate()
  return (
    <CourseMaterials
      onNavigateToAssessment={() => navigate('/quiz')}
      onNavigateToTutor={() => navigate('/ai-tutor')}
    />
  )
}
