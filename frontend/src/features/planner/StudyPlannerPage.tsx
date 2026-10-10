import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest } from '../../services/api_client'
import './workspace-pages.css'

interface PlannerTask {
  id: number
  title: string
  description: string
  due_at: string
  duration_minutes: number
  completed: boolean
}

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>([])
  const [title, setTitle] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [duration, setDuration] = useState(30)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = async () => setTasks(await apiRequest<PlannerTask[]>('/planner/tasks'))
  useEffect(() => {
    let active = true
    apiRequest<PlannerTask[]>('/planner/tasks')
      .then((data) => { if (active) setTasks(data) })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Unable to load planner tasks') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const createTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      await apiRequest('/planner/tasks', { method: 'POST', body: JSON.stringify({ title, due_at: new Date(dueAt).toISOString(), duration_minutes: duration }) })
      setTitle('')
      setDueAt('')
      await refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create planner task')
    }
  }

  const toggle = async (task: PlannerTask, completed: boolean) => {
    setError('')
    try {
      await apiRequest(`/planner/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ completed }) })
      await refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update planner task')
    }
  }

  const remove = async (task: PlannerTask) => {
    setError('')
    try {
      await apiRequest(`/planner/tasks/${task.id}`, { method: 'DELETE' })
      await refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to delete planner task')
    }
  }

  return <main className="workspace-page"><header><span>PLANNING</span><h1>Study Planner</h1><p>Plan focused sessions, set due dates, and track completed work.</p></header>
    <div className="workspace-page-columns"><section className="workspace-panel"><h2>Add a task</h2><form onSubmit={(event) => void createTask(event)}><label>Task title<input onChange={(event) => setTitle(event.target.value)} required value={title} /></label><label>Due date and time<input onChange={(event) => setDueAt(event.target.value)} required type="datetime-local" value={dueAt} /></label><label>Estimated minutes<input max={1440} min={5} onChange={(event) => setDuration(Number(event.target.value))} required type="number" value={duration} /></label><button type="submit">Add study task</button></form></section>
      <section className="workspace-panel"><h2>Your planned sessions</h2>{loading && <p>Loading saved tasks…</p>}{!loading && tasks.length === 0 && <p className="workspace-empty">No tasks yet. Add a study session to build your plan.</p>}{tasks.map((task) => <article className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}><label><input checked={task.completed} onChange={(event) => void toggle(task, event.target.checked)} type="checkbox" /><span><strong>{task.title}</strong><small>{new Date(task.due_at).toLocaleString()} · {task.duration_minutes} minutes</small>{task.description && <small>{task.description}</small>}</span></label><button onClick={() => void remove(task)} type="button">Delete</button></article>)}</section></div>
    {error && <p className="workspace-error" role="alert">{error}</p>}
  </main>
}
