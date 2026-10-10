import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdaptiveQuiz from './features/assessment/AdaptiveQuiz'
import DiagnosisAndGaps from './features/assessment/DiagnosisAndGaps'
import AuthPage from './features/auth/AuthPage'
import StudyPlannerPage from './features/planner/StudyPlannerPage'
import ProgressPageView from './features/progress/ProgressPageView'
import SettingsPageView from './features/settings/SettingsPageView'
import AppLayout from './layouts/AppLayout'
import { MaterialsRoute, RequireAuthentication, TutorRoute } from './route-components'

export const router = createBrowserRouter([
  { path: '/auth', element: <AuthPage /> },
  {
    element: <RequireAuthentication />,
    children: [
      { path: '/ai-tutor', element: <TutorRoute /> },
      { path: '/resources', element: <MaterialsRoute /> },
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <ProgressPageView /> },
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
