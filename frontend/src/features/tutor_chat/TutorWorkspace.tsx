import { useRef, useState, type FormEvent } from 'react'
import './tutor-workspace.css'
import '../../features/assessment/diagnostic-review.css'

type TutorMessage = { role: 'student' | 'tutor'; text: string }

const navigation = [
  { icon: 'space_dashboard', label: 'Overview' },
  { icon: 'neurology', label: 'AI Tutor Workspace' },
  { icon: 'troubleshoot', label: 'Diagnosis & Gaps' },
  { icon: 'quiz', label: 'Practice & Quizzes' },
  { icon: 'calendar_month', label: 'Study Planner' },
  { icon: 'folder_copy', label: 'Learning Resources' },
  { icon: 'insights', label: 'Progress & Insights' },
  { icon: 'settings', label: 'Settings' },
]

const tutorActions = [
  { icon: 'auto_stories', label: 'Explain more simply', response: 'Think of the gradient as the direction of steepest uphill change. A directional derivative asks how much of that uphill change points along your chosen direction.' },
  { icon: 'calculate', label: 'Show worked example', response: 'For v = ⟨2, 1⟩, first find ||v|| = √(2² + 1²) = √5. Then û = ⟨2/√5, 1/√5⟩ and ∇f(1, 2) · û = (4 − 8)/√5 = −4/√5.' },
  { icon: 'lightbulb', label: 'Give me a hint', response: 'Start by calculating the magnitude of your direction vector. Is ⟨2, 1⟩ already a unit vector?' },
  { icon: 'alt_route', label: 'Try another method', response: 'Geometrically, project the gradient onto the unit direction: Dᵤf = ||∇f|| cos θ. The vector must still be normalized before using the dot-product form.' },
  { icon: 'quiz', label: 'Test my understanding', response: 'Quick check: what is the magnitude of ⟨2, 1⟩? Choose an answer below, then we can continue the calculation.' },
]

const symbols = ['∇', '∂', '∫', '∑', '·', '⟨ , ⟩', '||v||', '\\frac{df}{dx}']

function Icon({ children, className = '' }: { children: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{children}</span>
}

function VectorPlot() {
  return (
    <svg aria-label="Contour plot with gradient and direction vectors" className="tutor-vector-plot" role="img" viewBox="0 0 240 80">
      <defs>
        <marker id="tutor-arrow" markerHeight="6" markerWidth="6" orient="auto" refX="6" refY="5" viewBox="0 0 10 10">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#006a61" />
        </marker>
      </defs>
      <ellipse cx="120" cy="40" rx="90" ry="30" />
      <ellipse cx="120" cy="40" rx="60" ry="20" />
      <ellipse cx="120" cy="40" rx="30" ry="10" />
      <line className="tutor-vector-plot__gradient" markerEnd="url(#tutor-arrow)" x1="120" x2="150" y1="40" y2="15" />
      <circle cx="120" cy="40" r="3.5" />
      <line className="tutor-vector-plot__direction" x1="120" x2="160" y1="40" y2="55" />
      <text className="tutor-vector-plot__gradient-label" x="155" y="15">∇f</text>
      <text className="tutor-vector-plot__direction-label" x="165" y="60">û</text>
      <text className="tutor-vector-plot__point" x="110" y="55">P(1,2)</text>
    </svg>
  )
}

function TutorWorkspace({
  onNavigateToAssessment,
  onNavigateToMaterials,
}: {
  onNavigateToAssessment: () => void
  onNavigateToMaterials: () => void
}) {
  const [activeNav, setActiveNav] = useState('AI Tutor Workspace')
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [draft, setDraft] = useState('')
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null)
  const [showSessionLog, setShowSessionLog] = useState(false)
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [showMicroDrill, setShowMicroDrill] = useState(false)
  const [drillAnswer, setDrillAnswer] = useState<number | null>(null)
  const [lensActive, setLensActive] = useState(true)
  const [notice, setNotice] = useState('')
  const composerRef = useRef<HTMLTextAreaElement>(null)

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const navigate = (label: string) => {
    if (label === 'Practice & Quizzes') {
      onNavigateToAssessment()
      return
    }
    if (label === 'Learning Resources') {
      onNavigateToMaterials()
      return
    }
    setActiveNav(label)
    if (label !== 'AI Tutor Workspace') showNotice(`${label} selected`)
  }

  const sendMessage = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const text = draft.trim()
    if (!text) {
      showNotice('Write a reply before sending')
      composerRef.current?.focus()
      return
    }
    setMessages((current) => [
      ...current,
      { role: 'student', text },
      { role: 'tutor', text: 'Let’s use the lecture’s unit-vector rule to check that step. First, compute the length of your direction vector, then divide each component by that length before taking the dot product.' },
    ])
    setDraft('')
    setSelectedCheckpoint(null)
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

  const chooseTutorAction = (response: string) => {
    setMessages((current) => [...current, { role: 'tutor', text: response }])
    if (response.startsWith('Quick check:')) setSelectedCheckpoint(null)
  }

  const checkpointAnswers = [
    { label: '√5', detail: '√(2² + 1²)' },
    { label: '3', detail: '2 + 1' },
    { label: '5', detail: '2² + 1²' },
    { label: '1', detail: 'Assumption' },
  ]

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <div className="sidebar__main">
          <a className="brand" href="#home" onClick={(event) => event.preventDefault()}>
            <span className="brand__mark">S</span>
            <span className="brand__name"><strong>Synapse</strong><small>Academic Studio</small></span>
            <span className="brand__version">AI 2.5</span>
          </a>
          <button className="course-select" onClick={() => showNotice('MATH 201 · Multivariable Calculus')} type="button">
            <Icon>menu_book</Icon><span className="course-select__text"><small>Enrolled Course</small><strong>MATH 201: Multivar Calc</strong></span><Icon className="course-select__arrow">unfold_more</Icon>
          </button>
          <nav aria-label="Main navigation" className="side-nav">
            {navigation.map((item) => (
              <button aria-current={activeNav === item.label ? 'page' : undefined} className={`side-nav__item${activeNav === item.label ? ' is-active' : ''}`} key={item.label} onClick={() => navigate(item.label)} type="button">
                <Icon>{item.icon}</Icon><span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar__footer">
          <div className="sync-card">
            <div className="sync-card__label"><Icon>cloud_done</Icon> Academic Sync <span>74%</span></div>
            <div className="meter"><span style={{ width: '74%' }} /></div>
            <div className="sync-card__cache">Content Cache <span>14.8 / 20 GB</span></div>
          </div>
          <button className="profile-card" onClick={() => showNotice('Signed in as Elena Vance')} type="button">
            <span className="profile-card__avatar"><Icon>person</Icon></span><span className="profile-card__copy"><strong>Elena Vance</strong><small>Junior · CS &amp; Math</small></span><Icon>more_vert</Icon>
          </button>
        </div>
      </aside>

      <div className="workspace tutor-workspace">
        <header className="topbar">
          <label className="search-box"><Icon>search</Icon><input aria-label="Search course materials" onKeyDown={(event) => {
            if (event.key === 'Enter') showNotice(`Searching course materials for “${event.currentTarget.value}”`)
          }} placeholder="Search course materials, concepts, formulas..." /></label>
          <button className="topbar__course" onClick={() => showNotice('MATH 201 · Section 04')} type="button"><span /> MATH 201 · Section 04</button>
          <div className="topbar__actions">
            <button aria-pressed={lensActive} className="live-toggle" onClick={() => setLensActive((active) => !active)} type="button"><Icon>visibility</Icon><span>Live Study Lens</span><span className={`switch${lensActive ? ' is-on' : ''}`}><i /></span></button>
            <button aria-label="Notifications" className="icon-button notification-button" onClick={() => showNotice('You are all caught up')} type="button"><Icon>notifications</Icon><i /></button>
            <button aria-label="User profile" className="topbar__avatar" onClick={() => showNotice('Elena Vance · Junior · CS & Math')} type="button"><Icon>person</Icon></button>
          </div>
        </header>

        <main className="main-content tutor-main">
          <header className="tutor-course-header panel">
            <div className="tutor-course-header__identity">
              <span className="tutor-course-header__icon"><Icon>function</Icon></span>
              <div>
                <div className="tutor-course-header__eyebrow"><strong>MATH 201 · MULTIVARIABLE CALCULUS</strong><i /><span>Section 04 · Fall Semester</span></div>
                <h1>Partial Derivatives &amp; Gradient Vectors</h1>
              </div>
            </div>
            <div className="tutor-course-header__actions">
              <span className="socratic-mode"><i /> <strong>Socratic Guide</strong> (Pedagogical Mode)</span>
              <button onClick={() => setShowSessionLog(true)} type="button"><Icon>history</Icon>Session Log</button>
              <div className="layout-menu-wrap">
                <button aria-expanded={showLayoutMenu} aria-label="Workspace layout options" onClick={() => setShowLayoutMenu((shown) => !shown)} type="button"><Icon>tune</Icon></button>
                {showLayoutMenu && <div className="layout-popover"><strong>Workspace layout</strong><span>Three-column tutoring canvas</span><span>Lecture 08 context linked</span><button onClick={() => { setShowLayoutMenu(false); showNotice('Workspace layout is already optimized') }} type="button">Done</button></div>}
              </div>
            </div>
          </header>

          <div className="tutor-grid">
            <aside className="tutor-context">
              <section className="tutor-card live-study-card">
                <div className="tutor-card__label"><span><Icon>sensors</Icon>Live Study Lens</span><b className={lensActive ? '' : 'is-off'}>{lensActive ? 'Active' : 'Paused'}</b></div>
                <strong>lecture_notes_wk8.pdf</strong>
                <div className="live-study-card__meta"><span>Synced: 12s ago</span><button aria-pressed={lensActive} onClick={() => setLensActive((active) => !active)} type="button">Auto-Ingest {lensActive ? 'ON' : 'OFF'}</button></div>
              </section>

              <section className="tutor-card source-card">
                <div className="source-card__title"><span><small>Active Reference</small><strong>Slide 14 / 32</strong></span><button aria-label="Open slide reference" onClick={onNavigateToMaterials} type="button"><Icon>open_in_new</Icon></button></div>
                <button className="source-preview" onClick={onNavigateToMaterials} type="button">
                  <span className="source-preview__paper"><b>Directional Derivatives</b><i>Dᵤ f = ∇f · û</i><span>||û|| = 1</span></span>
                  <span className="source-preview__caption">Prof. Vance · Lecture 8: Directional Derivatives</span>
                </button>
                <div className="source-actions">
                  <button onClick={onNavigateToMaterials} type="button"><Icon>crop_free</Icon>Inspect Snippet</button>
                  <button onClick={() => showNotice('OCR extracted and verified for Slide 14')} type="button"><Icon>document_scanner</Icon>OCR Parsed</button>
                </div>
                <div className="theorem-extract"><strong>Theorem 14.3 Extract</strong><code>"Dᵤ f(x₀, y₀) = ∇f(x₀, y₀) · û, where ||û|| = 1."</code></div>
              </section>

              <section className="tutor-card syllabus-card">
                <h2>Syllabus Navigator</h2>
                <button onClick={() => showNotice('Recap: Multivariable Functions')} type="button"><span><Icon>check_circle</Icon>14.1 Multivar Functions</span><small>Recap</small></button>
                <button onClick={() => showNotice('Recap: Limits & Continuity')} type="button"><span><Icon>check_circle</Icon>14.2 Limits &amp; Continuity</span><small>Recap</small></button>
                <button className="is-current" onClick={onNavigateToMaterials} type="button"><span><Icon>radio_button_checked</Icon>14.5 Directional &amp; Gradients</span><small>Active</small></button>
                <button className="is-locked" onClick={() => showNotice('Complete this lesson to unlock Tangent Planes')} type="button"><span><Icon>lock</Icon>14.6 Tangent Planes</span><small>Next</small></button>
              </section>
            </aside>

            <section aria-label="Socratic tutor conversation" className="tutor-dialogue">
              <div aria-live="polite" className="conversation-card tutor-card">
                <div className="session-timeline"><i /><span>TODAY · ACTIVE SESSION: 14M ELAPSED</span><i /></div>
                <article className="chat-message chat-message--student">
                  <div className="chat-message__byline"><span>Elena Vance · 2:14 PM</span><b><Icon>person</Icon></b></div>
                  <div className="student-bubble">
                    <p>I keep getting zero for the directional derivative along the tangent vector, what am I doing wrong here?</p>
                    <button className="scan-attachment" onClick={onNavigateToMaterials} type="button">
                      <span className="scan-attachment__header"><strong><Icon>stylus_note</Icon>Notebook Scan #04</strong><small>Vision Model Extracted</small></span>
                      <span className="scan-attachment__image"><span>∇f(1,2) · ⟨2, 1⟩ = 0 (?)</span></span>
                    </button>
                  </div>
                </article>

                <article className="chat-message chat-message--tutor">
                  <div className="chat-message__byline"><b className="tutor-avatar">S</b><strong>Synapse Tutor</strong><span>Pedagogical Verification</span></div>
                  <div className="tutor-response">
                    <p>Let's inspect your calculation in Step 2. Notice how you computed the gradient:</p>
                    <div className="chat-equation">∇f(x, y) = ⟨2x, −4y⟩ &nbsp;⟹&nbsp; ∇f(1, 2) = ⟨2, −8⟩</div>
                    <p>When evaluating at <code>(1, 2)</code>, did you normalize the directional vector <code>⟨2, 1⟩</code> first? Remember that directional derivatives strictly require a <strong>unit vector</strong>:</p>
                    <div className="chat-equation chat-equation--teal">Dᵤ f = ∇f · û, &nbsp; where &nbsp; û = v / ||v||</div>
                    <div className="self-check">
                      <div className="self-check__title"><Icon>psychology_alt</Icon><strong>Self-Check: What is the norm ||⟨2, 1⟩||?</strong></div>
                      <p>Select the magnitude to continue calculating the verified directional slope.</p>
                      <div className="checkpoint-options">
                        {checkpointAnswers.map((answer, index) => (
                          <button
                            aria-pressed={selectedCheckpoint === index}
                            className={`${selectedCheckpoint === index ? (index === 0 ? 'is-correct' : 'is-incorrect') : ''}${selectedCheckpoint === null && index === 0 ? ' is-hint' : ''}`}
                            key={answer.label}
                            onClick={() => setSelectedCheckpoint(index)}
                            type="button"
                          ><strong>{answer.label}</strong><small>{answer.detail}</small></button>
                        ))}
                      </div>
                      {selectedCheckpoint !== null && (
                        <div aria-live="polite" className={`checkpoint-feedback${selectedCheckpoint === 0 ? ' is-correct' : ' is-incorrect'}`}>
                          <Icon>{selectedCheckpoint === 0 ? 'verified' : 'error'}</Icon>
                          <span>{selectedCheckpoint === 0
                            ? 'Spot on! Because ||⟨2, 1⟩|| = √5, your unit vector must be ⟨2/√5, 1/√5⟩. Now evaluate the dot product with ∇f(1,2).'
                            : 'Not quite. The norm is the square root of the sum of squared components: √(2² + 1²) = √5.'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>

                {messages.map((message, index) => (
                  <article className={`chat-message${message.role === 'student' ? ' chat-message--student' : ' chat-message--tutor'}`} key={`${message.role}-${index}`}>
                    <div className="chat-message__byline">{message.role === 'student' ? <><span>Elena Vance · Just now</span><b><Icon>person</Icon></b></> : <><b className="tutor-avatar">S</b><strong>Synapse Tutor</strong><span>Pedagogical Verification</span></>}</div>
                    <div className={message.role === 'student' ? 'student-bubble' : 'tutor-response'}><p>{message.text}</p></div>
                  </article>
                ))}

                <div className="tutor-actions">
                  <strong>Tutor Actions:</strong>
                  {tutorActions.map((action) => <button key={action.label} onClick={() => chooseTutorAction(action.response)} type="button"><Icon>{action.icon}</Icon>{action.label}</button>)}
                </div>
              </div>

              <form className="composer-card tutor-card" onSubmit={sendMessage}>
                <div className="composer-context">
                  <div><span className="context-chip"><button aria-label="Open attached slide" onClick={onNavigateToMaterials} type="button"><Icon>attach_file</Icon></button>Slide 14 snippet attached<button aria-label="Remove attached slide" onClick={() => showNotice('Slide 14 snippet detached')} type="button"><Icon>close</Icon></button></span><span className="context-chip"><Icon>draw</Icon>Vector work active</span></div>
                  <span className="composer-sync"><i />Multimodal Live Sync</span>
                </div>
                <div className="symbol-toolbar"><strong>Symbols:</strong>{symbols.map((symbol) => <button aria-label={`Insert ${symbol}`} key={symbol} onClick={() => insertSymbol(symbol)} type="button">{symbol === '\\frac{df}{dx}' ? 'frac' : symbol}</button>)}</div>
                <textarea
                  aria-label="Reply to Synapse tutor"
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                      event.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Respond to Synapse tutor, insert equations, or paste mathematical reasoning..."
                  ref={composerRef}
                  rows={3}
                  value={draft}
                />
                <div className="composer-actions">
                  <div>
                    <button aria-label="Toggle LaTeX keyboard" onClick={() => showNotice('LaTeX symbol toolbar is ready above the reply box')} title="Toggle LaTeX Keyboard" type="button"><Icon>keyboard</Icon></button>
                    <button aria-label="Stylus or handwriting canvas" onClick={() => showNotice('Handwriting canvas is ready for your vector work')} title="Stylus / Handwriting Canvas" type="button"><Icon>draw</Icon></button>
                    <button aria-label="Upload scan or diagram" onClick={() => showNotice('Choose a scan from Learning Resources to attach it')} title="Upload Scan / Diagram" type="button"><Icon>add_photo_alternate</Icon></button>
                    <button aria-label="Voice dictation" onClick={() => showNotice('Voice dictation is not available in this preview')} title="Voice Dictation" type="button"><Icon>mic</Icon></button>
                    <button aria-label="Live screen share" onClick={() => showNotice('Screen share is not available in this preview')} title="Live Screen Share" type="button"><Icon>screen_share</Icon></button>
                  </div>
                  <span className="send-hint">⌘ + Enter to Send</span>
                  <button className="send-reply" type="submit">Send Socratic Reply<Icon>arrow_upward</Icon></button>
                </div>
              </form>
            </section>

            <aside className="tutor-insights">
              <section className="tutor-card scratchpad-card">
                <div className="insight-title"><span><Icon>functions</Icon>Math Scratchpad</span><small>Live LaTeX</small></div>
                <div className="scratchpad-work">
                  <strong>NORMALIZED VECTOR PRODUCT</strong>
                  <code>Dᵤf = ∇f(1, 2) · v / ||v||</code>
                  <code className="is-teal">= ⟨2, −8⟩ · ⟨2/√5, 1/√5⟩</code>
                  <code>= (4 − 8)/√5 = −4/√5 ≈ −1.789</code>
                </div>
                <div className="gradient-plot">
                  <div><span>Directional Slope Gradient</span><strong>Negative Rate (−1.79)</strong></div>
                  <VectorPlot />
                </div>
              </section>

              <section className="tutor-card dependency-card">
                <div className="insight-title"><span><Icon>troubleshoot</Icon>Dependency Radar</span><small>Diagnostic</small></div>
                <div className="dependency-item dependency-item--gap">
                  <div><strong><i />Vector Normalization</strong><b>42% · Flagged Gap</b></div>
                  <span className="dependency-progress"><i style={{ width: '42%' }} /></span>
                  <p>Root Cause: Forgetting to divide components by euclidean length ||v||.</p>
                </div>
                <div className="dependency-item">
                  <div><strong><i />Dot Product &amp; Orthogonality</strong><b>98% · Solid</b></div>
                  <span className="dependency-progress"><i style={{ width: '98%' }} /></span>
                </div>
                <div className="dependency-item">
                  <div><strong><i />First-Order Partial Derivatives</strong><b>89% · Stable</b></div>
                  <span className="dependency-progress"><i style={{ width: '89%' }} /></span>
                </div>
              </section>

              <section className="tutor-card microstep-card">
                <div className="insight-title"><span><Icon>bolt</Icon>TARGETED NEXT MICRO-STEP</span><small>2 min drill</small></div>
                <strong>3-question speed check: Normalizing 2D vectors in R²</strong>
                <p>Quickly close the identified normalization prerequisite gap before moving to Tangent Hyperplanes.</p>
                {showMicroDrill && (
                  <div className="micro-drill">
                    <strong>What is ||⟨3, 4⟩||?</strong>
                    <div>{['5', '7', '25'].map((answer, index) => <button className={drillAnswer === index ? (index === 0 ? 'is-correct' : 'is-incorrect') : ''} key={answer} onClick={() => setDrillAnswer(index)} type="button">{answer}</button>)}</div>
                    {drillAnswer !== null && <small>{drillAnswer === 0 ? 'Correct — √(3² + 4²) = 5.' : 'Try taking the square root of the sum of squares.'}</small>}
                  </div>
                )}
                <button className="start-micro-drill" onClick={() => { setShowMicroDrill((shown) => !shown); setDrillAnswer(null) }} type="button">{showMicroDrill ? 'Close Micro-Drill' : 'Start Micro-Drill'}<Icon>{showMicroDrill ? 'close' : 'play_arrow'}</Icon></button>
              </section>
            </aside>
          </div>
        </main>
      </div>

      {notice && <div aria-live="polite" className="toast">{notice}</div>}
      {showSessionLog && (
        <div className="modal-backdrop" onClick={() => setShowSessionLog(false)} role="presentation">
          <section aria-labelledby="session-log-title" aria-modal="true" className="tool-dialog session-log-dialog" onClick={(event) => event.stopPropagation()} role="dialog">
            <div className="tool-dialog__heading"><div><span className="eyebrow">MATH 201 · Section 04</span><h2 id="session-log-title">Session Log</h2></div><button aria-label="Close session log" className="icon-button" onClick={() => setShowSessionLog(false)} type="button"><Icon>close</Icon></button></div>
            <div className="session-log-entry"><span>2:14 PM</span><strong>Notebook Scan #04 attached</strong><p>Asked about a zero directional derivative along the tangent vector.</p></div>
            <div className="session-log-entry"><span>2:15 PM</span><strong>Normalization prerequisite identified</strong><p>Reviewing the unit vector rule from Lecture 08, Theorem 14.3.</p></div>
            {messages.length > 0 && <div className="session-log-entry"><span>Just now</span><strong>{messages.filter((message) => message.role === 'student').length} reply sent</strong><p>Your Socratic conversation is saved in this session.</p></div>}
          </section>
        </div>
      )}
    </div>
  )
}

export default TutorWorkspace
