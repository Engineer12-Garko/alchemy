import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest } from '../../services/api_client'
import '../planner/workspace-pages.css'

interface Account { display_name?: string; full_name?: string; email: string; preferences?: Record<string, unknown> }

export default function SettingsPageView() {
  const [account, setAccount] = useState<Account | null>(null)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('8')
  const [modality, setModality] = useState('visual')
  const [reminders, setReminders] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    apiRequest<Account>('/auth/me')
      .then((data) => {
        if (!active) return
        setAccount(data)
        setName(data.display_name ?? data.full_name ?? '')
        setGoal(String(data.preferences?.weekly_goal_hours ?? 8))
        setModality(String(data.preferences?.preferred_modality ?? 'visual'))
        setReminders(data.preferences?.reminders_enabled !== false)
      })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Unable to load account preferences') })
    return () => { active = false }
  }, [])

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      await apiRequest('/auth/preferences', { method: 'PATCH', body: JSON.stringify({ display_name: name.trim(), weekly_goal_hours: Number(goal), preferred_modality: modality, reminders_enabled: reminders }) })
      setSaved(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save preferences')
    } finally {
      setBusy(false)
    }
  }

  return <main className="workspace-page"><header><span>ACCOUNT</span><h1>Settings</h1><p>Update profile information and learning preferences.</p></header>
    {error && <p className="workspace-error" role="alert">{error}</p>}
    {!account && !error && <p>Loading account settings…</p>}
    {account && <form className="workspace-panel settings-form" onSubmit={(event) => void save(event)}><h2>Profile &amp; learning preferences</h2><label>Email address<input disabled value={account.email} /></label><label>Display name<input onChange={(event) => setName(event.target.value)} required value={name} /></label><label>Weekly study goal (hours)<input max="168" min="1" onChange={(event) => setGoal(event.target.value)} required type="number" value={goal} /></label><label>Preferred learning method<select onChange={(event) => setModality(event.target.value)} value={modality}><option value="visual">Visual</option><option value="worked-example">Worked examples</option><option value="audio">Audio</option><option value="retrieval-practice">Retrieval practice</option></select></label><label className="settings-reminders"><input checked={reminders} onChange={(event) => setReminders(event.target.checked)} type="checkbox" />Study reminders enabled</label><button disabled={busy} type="submit">{busy ? 'Saving…' : 'Save preferences'}</button>{saved && <p className="workspace-success" role="status">Preferences saved to your account.</p>}</form>}
  </main>
}
