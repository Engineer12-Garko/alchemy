import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, saveAccessToken } from '../../services/api_client'
import './auth-page.css'

interface AuthResponse {
  access_token: string
  user: { display_name: string; email: string }
}

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await apiRequest<AuthResponse>(
        mode === 'login' ? '/auth/login' : '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(
            mode === 'login'
              ? { email, password }
              : { email, password, display_name: displayName },
          ),
        },
      )
      saveAccessToken(response.access_token)
      navigate('/', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not authenticate')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span>A</span><div><strong>Alchemy</strong><small>Academic Studio</small></div></div>
        <p className="auth-eyebrow">YOUR PERSONAL LEARNING WORKSPACE</p>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-intro">{mode === 'login' ? 'Sign in to continue to your courses, learning history, study plans and progress.' : 'Create an Alchemy account to save your courses, learning history, study plans and progress.'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && <label>Your name<input autoComplete="name" onChange={(event) => setDisplayName(event.target.value)} required value={displayName} /></label>}
          <label>Email address<input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label>Password<input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button disabled={busy} type="submit">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <p className="auth-switch">
          {mode === 'login' ? 'New to Alchemy?' : 'Already have an account?'}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} type="button">
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
        <p className="auth-server-note">Your account is stored by the Alchemy API. Passwords must be at least 8 characters.</p>
      </section>
    </main>
  )
}
