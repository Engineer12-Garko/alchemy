import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdaptiveQuiz from './features/assessment/AdaptiveQuiz'
import DiagnosisAndGaps from './features/assessment/DiagnosisAndGaps'
import AuthPage from './features/auth/AuthPage'
import CourseMaterials from './features/materials/CourseMaterials'
import StudyPlannerPage from './features/planner/StudyPlannerPage'
import ProgressPageView from './features/progress/ProgressPageView'
import SettingsPageView from './features/settings/SettingsPageView'
import TutorWorkspace from './features/tutor_chat/TutorWorkspace'
import OverviewPage from './features/overview/OverviewPage'
import AppLayout from './layouts/AppLayout'
import { RequireAuthentication } from './route-components'
import { AUTH_ENABLED } from './services/api_client'

export const router = createBrowserRouter([
  { path: '/auth', element: AUTH_ENABLED ? <AuthPage /> : <Navigate replace to="/" /> },
  {
    element: <RequireAuthentication />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: 'ai-tutor', element: <TutorWorkspace /> },
          { path: 'resources', element: <CourseMaterials /> },
          { path: 'diagnosis', element: <DiagnosisAndGaps /> },
          { path: 'quiz', element: <AdaptiveQuiz /> },
          { path: 'study-planner', element: <StudyPlannerPage /> },
          { path: 'progress', element: <ProgressPageView /> },
          { path: 'settings', element: <SettingsPageView /> },
          { path: '*', element: <Navigate replace to="/" /> },
        ],
      },
    ],
  },
])
