import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/api_client'
import './AdaptiveQuiz.css'

interface PracticeQuestion {
  id: string
  concept: string
  prompt: string
}

interface QuizResult {
  score: number
  correct: boolean
  value_correct: boolean
  reasoning_complete: boolean
  feedback: string
}

export default function AdaptiveQuiz() {
  const [question, setQuestion] = useState<PracticeQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [work, setWork] = useState('')
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [requestedConcept, setRequestedConcept] = useState('')

  useEffect(() => {
    let active = true
    apiRequest<PracticeQuestion>('/quizzes/sample')
      .then((data) => { if (active) setQuestion(data) })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Unable to load a practice question') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const generateQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const concept = requestedConcept.trim()
    if (!concept) return
    setGenerating(true)
    setError('')
    setResult(null)
    try {
      const generated = await apiRequest<PracticeQuestion>(
        `/ai/generate-question?concept=${encodeURIComponent(concept)}`,
        { method: 'POST' },
      )
      setQuestion(generated)
      setAnswer('')
      setWork('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to generate a question')
    } finally {
      setGenerating(false)
    }
  }

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!question) return
    setSubmitting(true)
    setError('')
    try {
      const grade = await apiRequest<QuizResult>('/quizzes/grade', {
        method: 'POST',
        body: JSON.stringify({ question_id: question.id, answer, work }),
      })
      setResult(grade)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to grade your answer')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="adaptive-quiz">
      <header className="quiz-live-header">
        <div><p className="text-sm text-on-surface-variant uppercase tracking-wider">Targeted Adaptive Session</p><p className="font-headline-lg font-bold text-on-surface">Practice &amp; Quizzes</p></div>
        <Link className="quiz-diagnosis-link" to="/diagnosis">Diagnosis &amp; Gaps</Link>
      </header>
      <form className="quiz-generate-form" onSubmit={(event) => void generateQuestion(event)}>
        <label htmlFor="quiz-concept">Generate a question for a concept</label>
        <input id="quiz-concept" onChange={(event) => setRequestedConcept(event.target.value)} placeholder="e.g. multivariable chain rule" value={requestedConcept} />
        <button disabled={generating || !requestedConcept.trim()} type="submit">{generating ? 'Generating…' : 'Generate practice question'}</button>
      </form>
      {loading && <p role="status">Loading a question from the practice bank…</p>}
      {error && <p className="quiz-api-error" role="alert">{error}</p>}
      {question && <main>
        <div className="quiz-concept-pill">{question.concept}</div>
        <section className="quiz-live-prompt"><h2>Trace every dependency branch</h2><p className="text-body-lg text-on-surface leading-relaxed">{question.prompt}</p></section>
        <form className="quiz-live-form" onSubmit={(event) => void submitAnswer(event)}>
          <label htmlFor="quiz-live-work">Show your working</label>
          <textarea id="quiz-live-work" onChange={(event) => setWork(event.target.value)} placeholder="Write every chain-rule branch before evaluating…" value={work} />
          <label htmlFor="quiz-live-answer">Final answer</label>
          <div className="quiz-live-answer"><input id="quiz-live-answer" onChange={(event) => setAnswer(event.target.value)} required value={answer} /><button className="btn-primary" disabled={submitting} type="submit">{submitting ? 'Grading…' : 'Submit answer'}</button></div>
        </form>
        {result && <section aria-live="polite" className={`quiz-live-result ${result.correct ? 'is-correct' : 'is-incomplete'}`}><div><strong>{result.correct ? 'Correct' : 'Review your reasoning'}</strong><b>{result.score}%</b></div><p>{result.feedback}</p><small>Final value: {result.value_correct ? 'correct' : 'incorrect'} · Branch reasoning: {result.reasoning_complete ? 'complete' : 'incomplete'}</small></section>}
      </main>}
    </div>
  )
}
