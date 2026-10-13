import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/api_client'
import './overview-page.css'

interface ProgressState { attempts: number; mastery: { concept: string; score: number; attempts: number }[]; reviews_due: number }
interface PlannerTask { id: number; title: string; due_at: string; duration_minutes: number; completed: boolean }
interface ScheduledReview { id: number; concept: string; due_at: string }
interface Course { id: number; code: string; name: string }
interface Material { id: number; filename: string }
interface Account { display_name?: string; full_name?: string }
interface OverviewData {
  account: Account
  progress: ProgressState
  tasks: PlannerTask[]
  reviews: ScheduledReview[]
  courses: Course[]
  materials: Material[]
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      apiRequest<Account>('/auth/me'),
      apiRequest<ProgressState>('/progress'),
      apiRequest<PlannerTask[]>('/planner/tasks'),
      apiRequest<ScheduledReview[]>('/scheduler/reviews'),
      apiRequest<Course[]>('/courses'),
      apiRequest<Material[]>('/materials'),
    ]).then(([account, progress, tasks, reviews, courses, materials]) => {
      if (active) setData({ account, progress, tasks, reviews, courses, materials })
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Unable to load your overview')
    })
    return () => { active = false }
  }, [])

  const dueReviews = data?.reviews.filter((review) => new Date(review.due_at).getTime() <= Date.now()) ?? []
  const upcomingTasks = data?.tasks.filter((task) => !task.completed).slice(0, 4) ?? []
  const strongestConcepts = [...(data?.progress.mastery ?? [])].sort((a, b) => b.score - a.score).slice(0, 3)

  return <main className="overview-page">
    <header className="overview-heading">
      <div><span>YOUR LEARNING WORKSPACE</span><h1>{data ? `Welcome, ${data.account.display_name ?? data.account.full_name ?? 'there'}` : 'Overview'}</h1><p>Pick up where you left off and see what needs your attention.</p></div>
      <Link className="overview-primary-link" to="/quiz">Start practicing</Link>
    </header>

    {error && <p className="overview-error" role="alert">{error}</p>}
    {!data && !error && <p aria-live="polite" className="overview-loading">Loading your learning workspace…</p>}
    {data && <>
      <section aria-label="Learning summary" className="overview-metrics">
        <article><span>Courses</span><strong>{data.courses.length}</strong><Link to="/resources">View learning resources</Link></article>
        <article><span>Graded attempts</span><strong>{data.progress.attempts}</strong><Link to="/progress">See your progress</Link></article>
        <article><span>Reviews due</span><strong>{data.progress.reviews_due}</strong><Link to="/progress">Review concepts</Link></article>
        <article><span>Uploaded sources</span><strong>{data.materials.length}</strong><Link to="/resources">Open materials</Link></article>
      </section>

      <div className="overview-columns">
        <section className="overview-card">
          <div className="overview-card-heading"><div><span>UP NEXT</span><h2>Planned study sessions</h2></div><Link to="/study-planner">Open planner</Link></div>
          {upcomingTasks.length ? <ul className="overview-task-list">{upcomingTasks.map((task) => <li key={task.id}><span><strong>{task.title}</strong><small>{task.duration_minutes} minutes</small></span><time dateTime={task.due_at}>{formatDate(task.due_at)}</time></li>)}</ul> : <p className="overview-empty">No upcoming sessions. Add a task to make a study plan.</p>}
        </section>

        <section className="overview-card">
          <div className="overview-card-heading"><div><span>SPACED PRACTICE</span><h2>Reviews due now</h2></div><Link to="/progress">Review schedule</Link></div>
          {dueReviews.length ? <ul className="overview-review-list">{dueReviews.slice(0, 5).map((review) => <li key={review.id}><span>{review.concept}</span><time dateTime={review.due_at}>{formatDate(review.due_at)}</time></li>)}</ul> : <p className="overview-empty">You’re up to date. New review cards appear after graded practice.</p>}
        </section>

        <section className="overview-card overview-mastery-card">
          <div className="overview-card-heading"><div><span>RECENT LEARNING</span><h2>Concept mastery</h2></div><Link to="/progress">View all</Link></div>
          {strongestConcepts.length ? <ul className="overview-mastery-list">{strongestConcepts.map((concept) => <li key={concept.concept}><div><strong>{concept.concept}</strong><span>{concept.score}% · {concept.attempts} graded attempts</span></div><progress aria-label={`${concept.concept} mastery`} max="100" value={concept.score}>{concept.score}%</progress></li>)}</ul> : <p className="overview-empty">Complete a quiz to start tracking mastery by concept.</p>}
        </section>

        <section className="overview-card overview-quick-actions">
          <div className="overview-card-heading"><div><span>QUICK ACTIONS</span><h2>Choose your next step</h2></div></div>
          <Link to="/ai-tutor">Ask your AI tutor</Link><Link to="/diagnosis">Find learning gaps</Link><Link to="/resources">Open course materials</Link>
        </section>
      </div>
    </>}
  </main>
}
