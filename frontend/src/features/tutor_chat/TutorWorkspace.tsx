import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, apiRequest } from '../../services/api_client'
import './tutor-workspace.css'
import '../../features/assessment/diagnostic-review.css'

type TutorMessage = { role: 'student' | 'tutor'; text: string }
type TutorHistoryMessage = { role: string; content: string; created_at: string }
type TutorConversationSummary = { id: string; preview: string; updatedAt: string }
interface TutorSource { id: number; filename: string; byte_size: number }
interface TutorProgress { attempts: number; reviews_due: number; mastery: { concept: string; score: number }[] }
interface TutorAccount { display_name?: string; full_name?: string }

const tutorActions = [
  { icon: 'auto_stories', label: 'Explain more simply' },
  { icon: 'calculate', label: 'Show a worked example' },
  { icon: 'lightbulb', label: 'Give me a hint' },
  { icon: 'alt_route', label: 'Try another method' },
  { icon: 'quiz', label: 'Test my understanding' },
]

const symbols = ['∇', '∂', '∫', '∑', '·', '⟨ , ⟩', '||v||', '\\frac{df}{dx}']

function Icon({ children, className = '' }: { children: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{children}</span>
}

function TutorWorkspace() {
  const navigateTo = useNavigate()
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [draft, setDraft] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sources, setSources] = useState<TutorSource[]>([])
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const [progress, setProgress] = useState<TutorProgress | null>(null)
  const [account, setAccount] = useState<TutorAccount | null>(null)
  const [chatError, setChatError] = useState('')
  const [sending, setSending] = useState(false)
  const [recording, setRecording] = useState(false)
  const [processingMedia, setProcessingMedia] = useState(false)
  const [showSessionLog, setShowSessionLog] = useState(false)
  const [conversationSummaries, setConversationSummaries] = useState<TutorConversationSummary[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const [providerStatus, setProviderStatus] = useState<'unchecked' | 'available' | 'unavailable'>('unchecked')
  const [showSymbolToolbar, setShowSymbolToolbar] = useState(false)
  const [notice, setNotice] = useState('')
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    Promise.all([
      apiRequest<TutorSource[]>('/materials'),
      apiRequest<TutorProgress>('/progress'),
      apiRequest<TutorAccount>('/auth/me'),
    ]).then(([uploaded, summary, user]) => {
      if (!active) return
      setSources(uploaded)
      setSelectedMaterialId(uploaded[0]?.id ?? null)
      setProgress(summary)
      setAccount(user)
    }).catch((reason: unknown) => {
      if (active) setChatError(reason instanceof Error ? reason.message : 'Unable to load tutor context')
    })
    const restoreConversation = async () => {
      try {
        const conversations = await apiRequest<string[]>('/tutor/conversations')
        if (!active || conversations.length === 0) return
        const latest = conversations[0]
        const history = await apiRequest<TutorHistoryMessage[]>(`/tutor/conversations/${encodeURIComponent(latest)}`)
        if (!active) return
        setConversationId(latest)
        setMessages(history.map((item) => ({ role: item.role === 'user' ? 'student' : 'tutor', text: item.content })))
      } catch (reason) {
        if (active) setChatError(reason instanceof Error ? reason.message : 'Unable to restore tutor history')
      }
    }
    void restoreConversation()
    return () => { active = false }
  }, [])

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const sendMessage = async (event?: FormEvent<HTMLFormElement>, messageOverride?: string) => {
    event?.preventDefault()
    const text = (messageOverride ?? draft).trim()
    if (!text) {
      showNotice('Write a reply before sending')
      composerRef.current?.focus()
      return
    }
    setSending(true)
    setChatError('')
    setMessages((current) => [...current, { role: 'student', text }])
    if (!messageOverride) setDraft('')
    try {
      const result = await apiRequest<{ conversation_id: string; reply: string }>('/tutor/chat', {
        method: 'POST',
        body: JSON.stringify({ conversation_id: conversationId, message: text, material_id: selectedMaterialId }),
      })
      setConversationId(result.conversation_id)
      setProviderStatus('available')
      setMessages((current) => [...current, { role: 'tutor', text: result.reply }])
    } catch (reason) {
      if (reason instanceof ApiError && (reason.status === 0 || reason.status === 502 || reason.status === 503)) {
        setProviderStatus('unavailable')
      }
      const message = reason instanceof Error ? reason.message : 'The tutor could not answer'
      setChatError(message)
      setMessages((current) => current.filter((item, index) => !(index === current.length - 1 && item.role === 'student' && item.text === text)))
      if (!messageOverride) setDraft(text)
    } finally {
      setSending(false)
    }
  }

  const insertSymbol = (symbol: string) => {
    const textarea = composerRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const updated = `${draft.slice(0, start)}${symbol}${draft.slice(end)}`
    setDraft(updated)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + symbol.length, start + symbol.length)
    })
  }

  const toggleVoiceRecording = async () => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setChatError('Audio recording is not supported by this browser.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data) }
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop())
        setRecording(false)
        setChatError('Audio recording failed.')
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        setRecording(false)
        const audio = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        if (!audio.size) return
        setProcessingMedia(true)
        setChatError('')
        try {
          const form = new FormData()
          form.append('file', audio, 'voice-note.webm')
          const result = await apiRequest<{ transcription: string }>('/multimodal/transcribe', { method: 'POST', body: form })
          setDraft((current) => `${current}${current ? ' ' : ''}${result.transcription}`)
          composerRef.current?.focus()
        } catch (reason) {
          setChatError(reason instanceof Error ? reason.message : 'Audio transcription failed')
        } finally {
          setProcessingMedia(false)
        }
      }
      recorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setChatError('')
    } catch (reason) {
      setChatError(reason instanceof Error ? reason.message : 'Microphone permission was denied')
    }
  }

  const transcribeImage = async (file: File) => {
    setProcessingMedia(true)
    setChatError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const result = await apiRequest<{ transcription: string }>('/multimodal/ocr', { method: 'POST', body: form })
      setDraft((current) => `${current}${current ? '\n' : ''}${result.transcription}`)
      composerRef.current?.focus()
    } catch (reason) {
      setChatError(reason instanceof Error ? reason.message : 'Image transcription failed')
    } finally {
      setProcessingMedia(false)
    }
  }

  const chooseTutorAction = (prompt: string) => {
    void sendMessage(undefined, prompt)
  }

  const openConversationHistory = async () => {
    setShowSessionLog(true)
    setLoadingHistory(true)
    setHistoryError('')
    try {
      const ids = await apiRequest<string[]>('/tutor/conversations')
      const summaries = await Promise.all(ids.map(async (id) => {
        const history = await apiRequest<TutorHistoryMessage[]>(`/tutor/conversations/${encodeURIComponent(id)}`)
        const firstQuestion = history.find((item) => item.role === 'user')?.content ?? 'Empty conversation'
        const lastMessage = history.at(-1)
        return {
          id,
          preview: firstQuestion.replace(/\s+/g, ' ').slice(0, 100),
          updatedAt: lastMessage?.created_at ?? '',
        }
      }))
      setConversationSummaries(summaries)
    } catch (reason) {
      setHistoryError(reason instanceof Error ? reason.message : 'Unable to load saved conversations')
    } finally {
      setLoadingHistory(false)
    }
  }

  const selectConversation = async (id: string) => {
    setLoadingHistory(true)
    setHistoryError('')
    try {
      const history = await apiRequest<TutorHistoryMessage[]>(`/tutor/conversations/${encodeURIComponent(id)}`)
      setConversationId(id)
      setMessages(history.map((item) => ({ role: item.role === 'user' ? 'student' : 'tutor', text: item.content })))
      setShowSessionLog(false)
    } catch (reason) {
      setHistoryError(reason instanceof Error ? reason.message : 'Unable to open this conversation')
    } finally {
      setLoadingHistory(false)
    }
  }

  return (
    <div className="tutor-workspace">
        <header className="topbar">
          <span className="topbar-search-status"><Icon>neurology</Icon>Ask questions, select a source, and get a saved response</span>
          <div className="topbar__actions">
            <button aria-label="Study planner and due tasks" className="icon-button notification-button" onClick={() => navigateTo('/study-planner')} type="button"><Icon>notifications</Icon><i /></button>
            <button aria-label="User profile settings" className="topbar__avatar" onClick={() => navigateTo('/settings')} type="button"><Icon>person</Icon></button>
          </div>
        </header>

        <main className="main-content tutor-main">
          <header className="tutor-course-header panel">
            <div className="tutor-course-header__identity">
              <span className="tutor-course-header__icon"><Icon>neurology</Icon></span>
              <div>
                <div className="tutor-course-header__eyebrow"><strong>AI TUTOR WORKSPACE</strong><i /><span>{sources.length} source(s) available</span></div>
                <h1>Study with your AI tutor</h1>
              </div>
            </div>
            <div className="tutor-course-header__actions">
              <span aria-live="polite" className={`socratic-mode is-${providerStatus}`}><i /> <strong>{providerStatus === 'available' ? 'AI provider available' : providerStatus === 'unavailable' ? 'AI provider unavailable' : 'AI provider not checked'}</strong></span>
              <button onClick={() => void openConversationHistory()} type="button"><Icon>history</Icon>Conversation history</button>
            </div>
          </header>

          <div className="tutor-grid">
            <aside className="tutor-context">
              <section className="tutor-card live-study-card">
                <div className="tutor-card__label"><span><Icon>menu_book</Icon>Answer source</span></div>
                <label className="tutor-source-select">Ground responses in a saved document
                  <select onChange={(event) => setSelectedMaterialId(event.target.value ? Number(event.target.value) : null)} value={selectedMaterialId ?? ''}>
                    <option value="">No source selected</option>
                    {sources.map((source) => <option key={source.id} value={source.id}>{source.filename}</option>)}
                  </select>
                </label>
                <small>{selectedMaterialId ? 'Selected source text is passed to the tutor with each question.' : 'No document context is currently attached.'}</small>
              </section>

              <section className="tutor-card source-card">
                <div className="source-card__title"><span><small>Uploaded source library</small><strong>{sources.length} file(s)</strong></span><button aria-label="Open uploaded materials" onClick={() => navigateTo('/resources')} type="button"><Icon>open_in_new</Icon></button></div>
                {sources.length === 0 ? <p>No documents uploaded. Add a PDF or text file in Learning Resources.</p> : sources.map((source) => <button className="tutor-source-row" key={source.id} onClick={() => setSelectedMaterialId(source.id)} type="button"><Icon>description</Icon><span>{source.filename}<small>{(source.byte_size / 1024).toFixed(1)} KB</small></span></button>)}
              </section>

              <section className="tutor-card syllabus-card">
                <h2>Your learning activity</h2>
                <p>{progress ? `${progress.attempts} graded attempt(s) · ${progress.reviews_due} review(s) due` : 'Loading saved progress…'}</p>
                {progress?.mastery.slice(0, 4).map((item) => <div className="tutor-mastery-row" key={item.concept}><span>{item.concept}</span><strong>{item.score}%</strong></div>)}
                <button onClick={() => navigateTo('/progress')} type="button"><span><Icon>insights</Icon>View progress and scheduled reviews</span><small>Open</small></button>
              </section>
            </aside>

            <section aria-label="Socratic tutor conversation" className="tutor-dialogue">
              <div aria-live="polite" className="conversation-card tutor-card">
                <div className="session-timeline"><i /><span>{messages.length ? `${messages.length} saved conversation message(s)` : 'Start a conversation with your tutor'}</span><i /></div>
                {messages.length === 0 && <p className="tutor-empty-state">Your saved tutor conversation will appear here. Ask a question below to begin.</p>}
                {messages.map((message, index) => (
                  <article className={`chat-message${message.role === 'student' ? ' chat-message--student' : ' chat-message--tutor'}`} key={`${message.role}-${index}`}>
                    <div className="chat-message__byline">{message.role === 'student' ? <><span>{account?.display_name ?? account?.full_name ?? 'You'}</span><b><Icon>person</Icon></b></> : <><b className="tutor-avatar">A</b><strong>Alchemy Tutor</strong><span>AI response</span></>}</div>
                    <div className={message.role === 'student' ? 'student-bubble' : 'tutor-response'}><p>{message.text}</p></div>
                  </article>
                ))}
                {chatError && <p className="tutor-api-error" role="alert">{chatError}</p>}
                {sending && <p aria-live="polite" className="tutor-api-error">Tutor is preparing a response…</p>}

                <div className="tutor-actions">
                  <strong>Tutor Actions:</strong>
                  {tutorActions.map((action) => <button disabled={sending} key={action.label} onClick={() => chooseTutorAction(action.label)} type="button"><Icon>{action.icon}</Icon>{action.label}</button>)}
                </div>
              </div>

              <form className="composer-card tutor-card" onSubmit={sendMessage}>
                <div className="composer-context">
                  <div><span className="context-chip"><Icon>attach_file</Icon>{selectedMaterialId ? sources.find((source) => source.id === selectedMaterialId)?.filename : 'No document source selected'}</span><span className="context-chip"><Icon>draw</Icon>Personal scratchpad available</span></div>
                  <span className="composer-sync"><i />{processingMedia ? 'Transcribing media…' : 'Media upload ready'}</span>
                </div>
                {showSymbolToolbar && <div className="symbol-toolbar"><strong>Symbols:</strong>{symbols.map((symbol) => <button aria-label={`Insert ${symbol}`} key={symbol} onClick={() => insertSymbol(symbol)} type="button">{symbol === '\\frac{df}{dx}' ? 'frac' : symbol}</button>)}</div>}
                <textarea
                  aria-label="Reply to Alchemy tutor"
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                      event.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask the Alchemy tutor, insert equations, or paste your work..."
                  ref={composerRef}
                  rows={3}
                  value={draft}
                />
                <div className="composer-actions">
                  <div>
                    <button aria-label="Toggle math symbols" aria-pressed={showSymbolToolbar} onClick={() => setShowSymbolToolbar((visible) => !visible)} title="Toggle math symbols" type="button"><Icon>keyboard</Icon></button>
                    <button aria-label="Upload image or handwriting" onClick={() => mediaInputRef.current?.click()} title="Upload image or handwriting" type="button"><Icon>add_photo_alternate</Icon></button>
                    <button aria-label={recording ? 'Stop voice recording' : 'Start voice recording'} disabled={processingMedia} onClick={() => void toggleVoiceRecording()} title={recording ? 'Stop Voice Dictation' : 'Voice Dictation'} type="button"><Icon>{recording ? 'stop' : processingMedia ? 'hourglass_top' : 'mic'}</Icon></button>
                  </div>
                  <span className="send-hint">⌘ + Enter to Send</span>
                  <button className="send-reply" disabled={sending || processingMedia} type="submit">{sending ? 'Waiting for tutor…' : 'Send Socratic Reply'}<Icon>arrow_upward</Icon></button>
                  <input accept="image/*" aria-label="Upload handwritten work or image" className="visually-hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void transcribeImage(file); event.target.value = '' }} ref={mediaInputRef} type="file" />
                </div>
              </form>
            </section>

            <aside className="tutor-insights">
              <section className="tutor-card scratchpad-card">
                <div className="insight-title"><span><Icon>functions</Icon>Working notes</span><small>Local to this page</small></div>
                <textarea aria-label="Personal math scratchpad" onChange={(event) => window.sessionStorage.setItem('synapse.tutorScratchpad', event.target.value)} placeholder="Write equations or notes while studying…" rows={7} defaultValue={window.sessionStorage.getItem('synapse.tutorScratchpad') ?? ''} />
              </section>

              <section className="tutor-card dependency-card">
                <div className="insight-title"><span><Icon>troubleshoot</Icon>Saved mastery</span><small>From graded work</small></div>
                {!progress?.mastery.length && <p>Complete a graded quiz to see concept mastery here.</p>}
                {progress?.mastery.slice(0, 5).map((item) => <div className="dependency-item" key={item.concept}><div><strong>{item.concept}</strong><b>{item.score}%</b></div><span className="dependency-progress"><i style={{ width: `${item.score}%` }} /></span></div>)}
              </section>

              <section className="tutor-card microstep-card">
                <div className="insight-title"><span><Icon>bolt</Icon>Next steps</span></div>
                <p>{progress?.reviews_due ?? 0} spaced review(s) currently due.</p>
                <button className="start-micro-drill" onClick={() => navigateTo('/quiz')} type="button">Practice a question<Icon>quiz</Icon></button>
                <button className="start-micro-drill" onClick={() => navigateTo('/progress')} type="button">Review progress<Icon>insights</Icon></button>
              </section>
            </aside>
          </div>
        </main>
      {notice && <div aria-live="polite" className="toast">{notice}</div>}
      {showSessionLog && (
        <div className="modal-backdrop" onClick={() => setShowSessionLog(false)} role="presentation">
          <section aria-labelledby="session-log-title" aria-modal="true" className="tool-dialog session-log-dialog" onClick={(event) => event.stopPropagation()} role="dialog">
            <div className="tool-dialog__heading"><div><span className="eyebrow">{account?.display_name ?? account?.full_name ?? 'Account'}</span><h2 id="session-log-title">Saved tutor conversation</h2></div><button aria-label="Close conversation history" className="icon-button" onClick={() => setShowSessionLog(false)} type="button"><Icon>close</Icon></button></div>
            {historyError && <p className="tutor-api-error" role="alert">{historyError}</p>}
            {loadingHistory && <p aria-live="polite">Loading saved conversations…</p>}
            {!loadingHistory && conversationSummaries.length === 0 && <p>No saved conversations yet. Start a chat to build your history.</p>}
            {!loadingHistory && conversationSummaries.map((conversation) => <button className={`session-log-entry${conversation.id === conversationId ? ' is-current' : ''}`} disabled={loadingHistory} key={conversation.id} onClick={() => void selectConversation(conversation.id)} type="button"><strong>{conversation.preview}</strong><span>{conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleString() : 'Date unavailable'}{conversation.id === conversationId ? ' · Current' : ''}</span></button>)}
          </section>
        </div>
      )}
    </div>
  )
}

export default TutorWorkspace
