import { useState } from 'react'
import DiagnosticReview from './features/assessment/DiagnosticReview'
import CourseMaterials from './features/materials/CourseMaterials'
import TutorWorkspace from './features/tutor_chat/TutorWorkspace'

function App() {
  const [screen, setScreen] = useState<'assessment' | 'materials' | 'tutor'>('assessment')

  if (screen === 'tutor') {
    return (
      <TutorWorkspace
        onNavigateToAssessment={() => setScreen('assessment')}
        onNavigateToMaterials={() => setScreen('materials')}
      />
    )
  }

  return screen === 'materials' ? (
    <CourseMaterials
      onNavigateToAssessment={() => setScreen('assessment')}
      onNavigateToTutor={() => setScreen('tutor')}
    />
  ) : (
    <DiagnosticReview
      onNavigateToMaterials={() => setScreen('materials')}
      onNavigateToTutor={() => setScreen('tutor')}
    />
  )
}

export default App
