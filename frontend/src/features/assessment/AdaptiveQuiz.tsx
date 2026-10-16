import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, apiRequest } from '../../services/api_client'
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
  reasoning_complete: boolean | null
  feedback: string
}

function errorCopy(error: Error) {
  if (error instanceof ApiError && error.status === 0) {
    return {
      title: 'The Alchemy API is unreachable',
      message: 'Check your connection and try again. Your answer will stay on this page.',
    }
  }

  if (/provider rejected the configured credentials|HTTP 401|HTTP 403/i.test(error.message)) {
    return {
      title: 'AI provider credentials need attention',
      message: 'The configured AI provider rejected its key. A workspace administrator needs to update the provider credentials in Vercel. You can still answer the practice question below.',
    }
  }

  if (/configured .* provider|AI provider/i.test(error.message)) {
    return {
      title: 'The AI service could not complete this request',
      message: 'AI-generated questions are temporarily unavailable. You can continue with the practice question below.',
    }
  }

  return { title: 'We could not complete that request', message: error.message }
}

function asError(reason: unknown, fallback: string): Error {
  return reason instanceof Error ? reason : new Error(fallback)
}

export default function AdaptiveQuiz() {
  const [question, setQuestion] = useState<PracticeQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [work, setWork] = useState('')
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [errorAction, setErrorAction] = useState<'load' | 'generate' | 'grade' | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [requestedConcept, setRequestedConcept] = useState('')
  const [sampleRetry, setSampleRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    setErrorAction(null)
    apiRequest<PracticeQuestion>('/quizzes/sample')
      .then((data) => { if (active) setQuestion(data) })
      .catch((reason: unknown) => {
        if (!active) return
        setError(asError(reason, 'Unable to load a practice question'))
        setErrorAction('load')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [sampleRetry])

  const generateQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const concept = requestedConcept.trim()
    if (!concept) return
    setGenerating(true)
    setError(null)
    setErrorAction(null)
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
      setError(asError(reason, 'Unable to generate a question'))
      setErrorAction('generate')
    } finally {
      setGenerating(false)
    }
  }

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!question) return
    setSubmitting(true)
    setError(null)
    setErrorAction(null)
    try {
      const grade = await apiRequest<QuizResult>('/quizzes/grade', {
        method: 'POST',
        body: JSON.stringify({ question_id: question.id, answer: answer.trim(), work: work.trim() }),
      })
      setResult(grade)
    } catch (reason) {
      setError(asError(reason, 'Unable to grade your answer'))
      setErrorAction('grade')
    } finally {
      setSubmitting(false)
    }
  }

  const visibleError = error ? errorCopy(error) : null

  return (
    <div className="adaptive-quiz">
      <header className="quiz-page-header">
        <div>
          <h1>Practice &amp; Quizzes</h1>
          <p>Build confidence with focused questions and clear feedback.</p>
        </div>
        <Link className="quiz-diagnosis-link" to="/diagnosis">
          <span aria-hidden="true" className="material-symbols-outlined">troubleshoot</span>
          Review learning gaps
        </Link>
      </header>

      <form className="quiz-generate-form" onSubmit={(event) => void generateQuestion(event)}>
        <label htmlFor="quiz-concept">Create an AI practice question</label>
        <input
          autoComplete="off"
          id="quiz-concept"
          maxLength={200}
          onChange={(event) => setRequestedConcept(event.target.value)}
          placeholder="Enter a topic, e.g. multivariable chain rule"
          value={requestedConcept}
        />
        <button disabled={generating || !requestedConcept.trim()} type="submit">
          <span aria-hidden="true" className="material-symbols-outlined">auto_awesome</span>
          {generating ? 'Creating question…' : 'Generate question'}
        </button>
      </form>

      {visibleError && <div className="quiz-api-error" role="alert">
        <span aria-hidden="true" className="material-symbols-outlined">error</span>
        <div className="quiz-api-error-copy">
          <strong>{visibleError.title}</strong>
          <p>{visibleError.message}</p>
        </div>
        {errorAction === 'load' && !question && <button className="quiz-retry-button" onClick={() => setSampleRetry((count) => count + 1)} type="button">Try again</button>}
      </div>}

      {loading && <div aria-live="polite" className="quiz-loading" role="status">
        <span aria-hidden="true" className="material-symbols-outlined">progress_activity</span>
        Loading a practice question…
      </div>}

      {!loading && !question && !error && <section className="quiz-empty-state">
        <strong>No practice question is available yet</strong>
        <span>Try again in a moment, or create a question from a topic above.</span>
        <button className="quiz-retry-button" onClick={() => setSampleRetry((count) => count + 1)} type="button">Load a question</button>
      </section>}

      {question && <section aria-labelledby="quiz-question-title" className="quiz-question-card">
        <div className="quiz-question-meta">
          <span className="quiz-concept-pill">{question.concept}</span>
        </div>
        <div className="quiz-live-prompt">
          <p id="quiz-question-title">{question.prompt}</p>
        </div>

        <form className="quiz-live-form" onSubmit={(event) => void submitAnswer(event)}>
          <label htmlFor="quiz-live-work">Your working <span>Optional</span></label>
          <textarea
            id="quiz-live-work"
            onChange={(event) => setWork(event.target.value)}
            placeholder="Show the steps you used to reach your answer."
            value={work}
          />
          <label htmlFor="quiz-live-answer">Final answer</label>
          <div className="quiz-live-answer">
            <input
              autoComplete="off"
              id="quiz-live-answer"
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type your answer"
              required
              value={answer}
            />
            <button disabled={submitting} type="submit">
              {submitting ? 'Checking…' : 'Check answer'}
              {!submitting && <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </div>
        </form>

        {result && <section aria-live="polite" className={`quiz-live-result ${result.correct ? 'is-correct' : 'is-incomplete'}`}>
          <div className="quiz-result-heading">
            <strong>{result.correct ? 'Correct' : 'Review your answer'}</strong>
            <b>{result.score}%</b>
          </div>
          <p>{result.feedback}</p>
          <small>Final answer: {result.value_correct ? 'correct' : 'incorrect'}{result.reasoning_complete !== null ? ` · Working: ${result.reasoning_complete ? 'complete' : 'needs another step'}` : ''}</small>
        </section>}
      </section>}
    </div>
  )
}
