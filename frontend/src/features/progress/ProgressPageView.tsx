import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api_client'
import '../planner/workspace-pages.css'

interface ConceptMastery { concept: string; score: number; attempts: number }
interface ProgressState { attempts: number; mastery: ConceptMastery[]; reviews_due: number }
interface ScheduledReview { id: number; concept: string; due_at: string; interval_days: number; repetitions: number; last_score: number | null }

export default function ProgressPageView() {
  const [data, setData] = useState<ProgressState | null>(null)
  const [reviews, setReviews] = useState<ScheduledReview[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    Promise.all([apiRequest<ProgressState>('/progress'), apiRequest<ScheduledReview[]>('/scheduler/reviews')])
      .then(([result, scheduled]) => { if (active) { setData(result); setReviews(scheduled) } })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Unable to load progress') })
    return () => { active = false }
  }, [])

  const gradeReview = async (concept: string, quality: number) => {
    setError('')
    try {
      await apiRequest('/scheduler/reviews', { method: 'POST', body: JSON.stringify({ concept, quality }) })
      const [updatedProgress, scheduled] = await Promise.all([apiRequest<ProgressState>('/progress'), apiRequest<ScheduledReview[]>('/scheduler/reviews')])
      setData(updatedProgress)
      setReviews(scheduled)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to schedule the next review')
    }
  }

  return <main className="workspace-page"><header><span>LEARNER MODEL</span><h1>Progress &amp; Insights</h1><p>Mastery and review indicators calculated from your saved learning history.</p></header>
    {error && <p className="workspace-error" role="alert">{error}</p>}
    {!data && !error && <p>Loading your saved progress…</p>}
    {data && <><section className="workspace-metrics"><article><small>Learning events</small><strong>{data.attempts}</strong></article><article><small>Concepts assessed</small><strong>{data.mastery.length}</strong></article><article><small>Reviews due</small><strong>{data.reviews_due}</strong></article></section>
      <section className="workspace-panel"><h2>Concept mastery</h2>{data.mastery.length === 0 && <p className="workspace-empty">No graded activity yet. Complete a quiz or spaced review to build your progress record.</p>}{data.mastery.map((item) => <article className="mastery-row" key={item.concept}><div><strong>{item.concept}</strong><small>{item.attempts} graded events</small></div><b>{item.score}%</b><i><span style={{ width: `${item.score}%` }} /></i></article>)}</section>
      <section className="workspace-panel"><h2>Spaced reviews</h2>{reviews.length === 0 && <p className="workspace-empty">Quiz results create scheduled review cards automatically.</p>}{reviews.map((review) => <article className="mastery-row" key={review.id}><div><strong>{review.concept}</strong><small>{review.repetitions} prior review(s) · {review.interval_days}-day interval · due {new Date(review.due_at).toLocaleDateString()}</small></div><div className="review-quality">{[0, 1, 2, 3, 4, 5].map((quality) => <button key={quality} onClick={() => void gradeReview(review.concept, quality)} type="button">{quality}</button>)}</div></article>)}</section>
    </>}
  </main>
}
