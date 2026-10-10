import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/api_client'
import './DiagnosisAndGaps.css'

interface DiagnosisData {
  attempts: number
  mastery: number | null
  concepts: { concept: string; mastery: number | null; attempts: number; errors: number; status: string }[]
}

interface ModuleStep { id: string; title: string; locked: boolean }
interface ActiveModule { method: string; rationale: string; sessionId: string; steps: ModuleStep[] }

export default function DiagnosisAndGaps() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null)
  const [diagnosisError, setDiagnosisError] = useState('')
  const [moduleError, setModuleError] = useState('')
  const [moduleBusy, setModuleBusy] = useState(false)
  const [concept, setConcept] = useState('')
  const [confidence, setConfidence] = useState(0.5)
  const [recentError, setRecentError] = useState('')
  const [module, setModule] = useState<ActiveModule | null>(null)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [stepAttempt, setStepAttempt] = useState('')
  const [hasAttempt, setHasAttempt] = useState(false)
  const [moduleSolution, setModuleSolution] = useState('')

  const refreshDiagnosis = async () => {
    setDiagnosis(await apiRequest<DiagnosisData>('/diagnosis'))
  }

  useEffect(() => {
    let active = true
    apiRequest<DiagnosisData>('/diagnosis')
      .then((data) => { if (active) setDiagnosis(data) })
      .catch((reason: unknown) => { if (active) setDiagnosisError(reason instanceof Error ? reason.message : 'Unable to load diagnosis data') })
    return () => { active = false }
  }, [])

  const startMethodModule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!concept.trim()) return
    setModuleBusy(true)
    setModuleError('')
    setModuleSolution('')
    setHasAttempt(false)
    try {
      const selected = await apiRequest<{ method: string; rationale: string }>('/method-router/select', {
        method: 'POST',
        body: JSON.stringify({ concept: concept.trim(), confidence, recent_error: recentError.trim() || null }),
      })
      const session = await apiRequest<{ session_id: string; steps: ModuleStep[] }>(`/method-modules/${selected.method}/sessions`, { method: 'POST' })
      setModule({ method: selected.method, rationale: selected.rationale, sessionId: session.session_id, steps: session.steps })
      setCompletedSteps([])
      setStepAttempt('')
    } catch (reason) {
      setModuleError(reason instanceof Error ? reason.message : 'Unable to start the recommended study method')
    } finally {
      setModuleBusy(false)
    }
  }

  const submitMethodStep = async (step: ModuleStep) => {
    if (!module || !stepAttempt.trim()) return
    setModuleBusy(true)
    setModuleError('')
    try {
      const result = await apiRequest<{ completed_steps: string[]; solution_unlocked: boolean }>(`/method-modules/sessions/${module.sessionId}/steps/${step.id}`, {
        method: 'POST',
        body: JSON.stringify({ response: stepAttempt.trim() }),
      })
      setCompletedSteps(result.completed_steps)
      setHasAttempt(result.solution_unlocked)
      setStepAttempt('')
      try {
        await refreshDiagnosis()
      } catch (reason) {
        setDiagnosisError(reason instanceof Error ? `Attempt saved, but diagnosis refresh failed: ${reason.message}` : 'Attempt saved, but diagnosis refresh failed')
      }
    } catch (reason) {
      setModuleError(reason instanceof Error ? reason.message : 'Unable to save this study step')
    } finally {
      setModuleBusy(false)
    }
  }

  const revealSolution = async () => {
    if (!module) return
    setModuleBusy(true)
    setModuleError('')
    try {
      const result = await apiRequest<{ solution: string }>(`/method-modules/sessions/${module.sessionId}/solution`)
      setModuleSolution(result.solution)
    } catch (reason) {
      setModuleError(reason instanceof Error ? reason.message : 'Unable to load the worked solution')
    } finally {
      setModuleBusy(false)
    }
  }

  const currentStep = module?.steps.find((step) => !completedSteps.includes(step.id))

  return (
    <main className="diagnosis-gaps">
      <header className="diagnosis-page-heading"><span>LEARNER MODEL</span><h1>Diagnosis &amp; Learning Gaps</h1><p>Review patterns from your saved attempts and launch an adaptive method module.</p></header>
      <section aria-label="Saved learner diagnosis" className="diagnosis-live-summary">
        <div className="diagnosis-summary-heading"><div><strong>Diagnostic summary</strong><p>Calculated from your account's graded learning events.</p></div><Link to="/quiz">Take a practice quiz</Link></div>
        {diagnosisError && <p role="alert">{diagnosisError}</p>}
        {!diagnosis && !diagnosisError && <p>Loading diagnostic results…</p>}
        {diagnosis && <>
          <div className="diagnosis-metrics"><span><strong>{diagnosis.attempts}</strong> recorded events</span><span><strong>{diagnosis.concepts.length}</strong> assessed concepts</span><span><strong>{diagnosis.mastery === null ? '—' : `${diagnosis.mastery}%`}</strong> average mastery</span></div>
          {diagnosis.concepts.length === 0 ? <p className="diagnosis-empty">No concept-level evidence yet. Complete a quiz to create your first diagnostic record.</p> : diagnosis.concepts.map((item) => <article className="diagnosis-concept" key={item.concept}><div><strong>{item.concept}</strong><small>{item.attempts} event(s) · {item.errors} incorrect</small></div><b>{item.mastery === null ? 'Not scored' : `${item.mastery}%`}</b><span>{item.status.replaceAll('_', ' ')}</span></article>)}
        </>}
      </section>

      <section aria-label="Adaptive study method" className="diagnosis-live-module">
        <h2>Choose an adaptive study method</h2>
        <p>The method router considers your topic, confidence, and recent difficulty. Study steps require an attempt before the worked solution is revealed.</p>
        <form className="diagnosis-method-form" onSubmit={(event) => void startMethodModule(event)}>
          <label>Concept or topic<input onChange={(event) => setConcept(event.target.value)} placeholder="e.g. multivariable chain rule" required value={concept} /></label>
          <label>Confidence <span>{Math.round(confidence * 100)}%</span><input max="1" min="0" onChange={(event) => setConfidence(Number(event.target.value))} step="0.05" type="range" value={confidence} /></label>
          <label>Recent difficulty (optional)<input onChange={(event) => setRecentError(event.target.value)} placeholder="e.g. missed a dependency branch" value={recentError} /></label>
          <button disabled={moduleBusy || !concept.trim()} type="submit">{moduleBusy ? 'Selecting method…' : 'Select method and start'}</button>
        </form>
        {module && <article className="diagnosis-module-session"><h3>{module.method.replaceAll('_', ' ')}</h3><p>{module.rationale}</p><ol>{module.steps.map((step) => <li className={completedSteps.includes(step.id) ? 'is-complete' : ''} key={step.id}>{step.title}{completedSteps.includes(step.id) ? ' · Attempt submitted' : ''}</li>)}</ol>
          {currentStep && <div className="diagnosis-step-entry"><label htmlFor="study-step-attempt">Your attempt for: {currentStep.title}</label><textarea id="study-step-attempt" onChange={(event) => setStepAttempt(event.target.value)} value={stepAttempt} /><button disabled={moduleBusy || !stepAttempt.trim()} onClick={() => void submitMethodStep(currentStep)} type="button">{moduleBusy ? 'Saving…' : 'Submit attempt'}</button></div>}
          {hasAttempt && <button disabled={moduleBusy} onClick={() => void revealSolution()} type="button">{moduleBusy ? 'Loading…' : 'Reveal worked solution'}</button>}
          {moduleSolution && <div className="diagnosis-solution"><h3>Worked solution</h3><p>{moduleSolution}</p></div>}
        </article>}
        {moduleError && <p className="diagnosis-module-error" role="alert">{moduleError}</p>}
      </section>
      <nav aria-label="Learning workflow shortcuts" className="diagnosis-shortcuts"><Link to="/resources">Upload course materials</Link><Link to="/study-planner">Open study planner</Link><Link to="/progress">View progress and reviews</Link></nav>
    </main>
  )
}
