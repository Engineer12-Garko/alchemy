import { useState, type ReactNode } from 'react'
import './diagnostic-review.css'

type ToolPanel = 'cas' | 'scratchpad' | null

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

const channels = [
  { icon: 'edit_note', label: 'Scratchpad' },
  { icon: 'document_scanner', label: 'Upload Scan' },
  { icon: 'functions', label: 'LaTeX Editor' },
  { icon: 'stylus_note', label: 'Stylus Canvas' },
]

function Icon({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>
      {children}
    </span>
  )
}

function SectionTitle({
  icon,
  children,
  trailing,
}: {
  icon: string
  children: ReactNode
  trailing?: string
}) {
  return (
    <div className="section-title">
      <div className="section-title__label">
        <Icon>{icon}</Icon>
        <h2>{children}</h2>
      </div>
      {trailing && <span className="section-title__trailing">{trailing}</span>}
    </div>
  )
}

function BranchMap() {
  return (
    <div className="branch-map">
      <div className="branch-map__heading">
        <span>Dependence Branch Map</span>
        <span className="text-teal">Tree Verification</span>
      </div>
      <svg
        aria-label="Dependency tree showing the omitted y branch"
        className="branch-map__svg"
        role="img"
        viewBox="0 0 460 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#0e1c2f" height="26" rx="6" width="60" x="200" y="8" />
        <text className="map-root" textAnchor="middle" x="230" y="25">z(x, y)</text>
        <line className="map-line map-line--good" x1="210" x2="110" y1="34" y2="60" />
        <text className="map-label map-label--good" x="145" y="44">∂z/∂x</text>
        <rect fill="#86f2e4" height="24" rx="6" width="70" x="70" y="52" />
        <text className="map-node map-node--good" textAnchor="middle" x="105" y="68">x = s·cos(t)</text>
        <line className="map-line map-line--good" x1="105" x2="105" y1="76" y2="100" />
        <text className="map-label map-label--good" x="125" y="92">∂x/∂s</text>
        <rect fill="#0e1c2f" height="20" rx="4" width="40" x="85" y="98" />
        <text className="map-root map-root--small" textAnchor="middle" x="105" y="112">s</text>
        <line className="map-line map-line--missed" x1="250" x2="350" y1="34" y2="60" />
        <text className="map-label map-label--missed" x="315" y="44">∂z/∂y (Dropped)</text>
        <rect fill="#ffdad6" height="24" rx="6" width="70" x="315" y="52" />
        <text className="map-node map-node--missed" textAnchor="middle" x="350" y="68">y = s·sin(t)</text>
        <line className="map-line map-line--missed" x1="350" x2="350" y1="76" y2="100" />
        <text className="map-label map-label--missed" x="370" y="92">∂y/∂s</text>
        <rect fill="#0e1c2f" height="20" rx="4" width="40" x="330" y="98" />
        <text className="map-root map-root--small" textAnchor="middle" x="350" y="112">s</text>
      </svg>
      <p className="branch-map__caption">
        Dotted crimson line designates the uncalculated branch dependency tree path.
      </p>
    </div>
  )
}

function DiagnosticReview({
  onNavigateToMaterials,
  onNavigateToTutor,
}: {
  onNavigateToMaterials: () => void
  onNavigateToTutor: () => void
}) {
  const [activeNav, setActiveNav] = useState('Practice & Quizzes')
  const [activeChannel, setActiveChannel] = useState('Stylus Canvas')
  const [question, setQuestion] = useState(2)
  const [isPaused, setIsPaused] = useState(false)
  const [liveLens, setLiveLens] = useState(true)
  const [toolPanel, setToolPanel] = useState<ToolPanel>(null)
  const [scratchpad, setScratchpad] = useState('')
  const [showFullWorking, setShowFullWorking] = useState(false)
  const [notice, setNotice] = useState('')

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3200)
  }

  const progress = Math.round((question / 5) * 100)

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <div className="sidebar__main">
          <a className="brand" href="#home" onClick={(event) => event.preventDefault()}>
            <span className="brand__mark">S</span>
            <span className="brand__name">
              <strong>Synapse</strong>
              <small>Academic Studio</small>
            </span>
            <span className="brand__version">AI 2.5</span>
          </a>

          <button className="course-select" type="button" onClick={() => showNotice('MATH 201 · Multivariable Calculus')}>
            <Icon>menu_book</Icon>
            <span className="course-select__text">
              <small>Enrolled Course</small>
              <strong>MATH 201: Multivar Calc</strong>
            </span>
            <Icon className="course-select__arrow">unfold_more</Icon>
          </button>

          <nav aria-label="Main navigation" className="side-nav">
            {navigation.map((item) => (
              <button
                aria-current={activeNav === item.label ? 'page' : undefined}
                className={`side-nav__item${activeNav === item.label ? ' is-active' : ''}`}
                key={item.label}
                onClick={() => {
                  if (item.label === 'Learning Resources') {
                    onNavigateToMaterials()
                    return
                  }
                  if (item.label === 'AI Tutor Workspace') {
                    onNavigateToTutor()
                    return
                  }
                  setActiveNav(item.label)
                  if (item.label !== 'Practice & Quizzes') showNotice(`${item.label} selected`)
                }}
                type="button"
              >
                <Icon>{item.icon}</Icon>
                <span>{item.label}</span>
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
          <button className="profile-card" type="button" onClick={() => showNotice('Signed in as Elena Vance')}>
            <span className="profile-card__avatar"><Icon>person</Icon></span>
            <span className="profile-card__copy"><strong>Elena Vance</strong><small>Junior · CS &amp; Math</small></span>
            <Icon>more_vert</Icon>
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <label className="search-box">
            <Icon>search</Icon>
            <input aria-label="Search course materials" placeholder="Search course materials, concepts, formulas..." />
          </label>
          <button className="topbar__course" type="button" onClick={() => showNotice('MATH 201 · Section 04')}>
            <span /> MATH 201 · Section 04
          </button>
          <div className="topbar__actions">
            <button
              aria-pressed={liveLens}
              className="live-toggle"
              onClick={() => setLiveLens((enabled) => !enabled)}
              type="button"
            >
              <Icon>visibility</Icon>
              <span>Live Study Lens</span>
              <span className={`switch${liveLens ? ' is-on' : ''}`}><i /></span>
            </button>
            <button aria-label="Notifications" className="icon-button notification-button" onClick={() => showNotice('You are all caught up')} type="button">
              <Icon>notifications</Icon><i />
            </button>
            <button aria-label="User profile" className="topbar__avatar" onClick={() => showNotice('Elena Vance · Junior · CS & Math')} type="button">
              <Icon>person</Icon>
            </button>
          </div>
        </header>

        <main className="main-content">
          <section aria-labelledby="session-title" className="session-banner panel">
            <div className="session-banner__top">
              <div className="session-banner__title">
                <div className="eyebrow-row">
                  <span className="eyebrow"><i /> Targeted Adaptive Session</span>
                  <span className="dot-separator">·</span>
                  <span>Question {question} of 5</span>
                  <span className="dot-separator">·</span>
                  <strong>Multivariable Chain Rule</strong>
                </div>
                <h1 id="session-title">Calculus III Diagnostic Studio</h1>
              </div>
              <div className="session-tools">
                <span className="difficulty-pill"><Icon>tune</Icon><b>Difficulty: Medium</b><small>(Auto-calibrated from Q1)</small></span>
                <button className="small-button" onClick={() => setToolPanel('cas')} type="button"><Icon>calculate</Icon>CAS Tool</button>
                <button className="small-button" onClick={() => setToolPanel('scratchpad')} type="button"><Icon>draw</Icon>Scratchpad</button>
                <button className="small-button" onClick={() => setIsPaused((paused) => !paused)} type="button">
                  <Icon>{isPaused ? 'play_circle' : 'pause_circle'}</Icon>{isPaused ? 'Resume' : 'Pause'}
                </button>
              </div>
            </div>
            <div className="progress-meta">
              <span><Icon>hourglass_top</Icon>Estimated remaining: <b>{isPaused ? 'Paused' : `${Math.max(1, 7 - question)} mins`}</b></span>
              <b>{progress}% Session Complete</b>
            </div>
            <div aria-label={`${progress}% session complete`} className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progress}%` }} />
            </div>
          </section>

          <div className="review-grid">
            <section aria-label="Problem and submitted work" className="review-column review-column--primary">
              <article className="problem-card panel">
                <div className="problem-card__meta">
                  <div className="tag-group">
                    <span className="tag tag--section">MATH 201 · Section 3.4</span>
                    <span className="tag">Standard Time: 3m 00s</span>
                  </div>
                  <span className="proof-label"><Icon>verified_user</Icon>Rigorous Proof Scored</span>
                </div>
                <div className="problem-statement">
                  <span className="eyebrow">Problem Statement</span>
                  <p>
                    Let <code>z = f(x, y) = x²y + 3y²</code>, where <code>x = s · cos(t)</code> and <code>y = s · sin(t)</code>.
                  </p>
                  <p className="problem-statement__evaluate">
                    Evaluate <code>∂z/∂s</code> at the evaluation point <code>(s = 1, t = 0)</code>.
                  </p>
                </div>
                <div className="channel-picker">
                  <div className="channel-picker__header">
                    <span>Active Input Channel</span>
                    <span className="text-teal"><i /> Live Sync Enabled</span>
                  </div>
                  <div aria-label="Choose input channel" className="channel-list" role="group">
                    {channels.map((channel) => (
                      <button
                        aria-pressed={activeChannel === channel.label}
                        className={`channel-button${activeChannel === channel.label ? ' is-active' : ''}`}
                        key={channel.label}
                        onClick={() => setActiveChannel(channel.label)}
                        type="button"
                      >
                        <Icon>{channel.icon}</Icon>{channel.label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>

              <article className="submission-card panel">
                <div className="submission-heading">
                  <div className="submission-heading__identity">
                    <span className="submission-icon"><Icon>assignment_turned_in</Icon></span>
                    <span><strong>Elena's Branch Analysis</strong><small>Submitted via Stylus · Turnaround: 2m 14s</small></span>
                  </div>
                  <span className="status-pill status-pill--warning"><Icon>warning</Icon>Partially Correct</span>
                </div>
                <div className="answer-comparison">
                  <div><span>Your Final Answer</span><strong>0 <small className="status-pill status-pill--success">Value Match</small></strong></div>
                  <div><span>Canonical Target Value</span><strong>0 <small>(Identical scalar)</small></strong></div>
                </div>
                <div className="derivation">
                  <div className="subsection-heading"><span>Submitted Derivation Snippet</span><span>Line 3 of 4</span></div>
                  <div className="derivation__paper">
                    <small>Elena wrote:</small>
                    <code>∂z/∂s = (2xy)(cos t) = (2(1)(0))(1) = 0</code>
                    <span className="error-note"><Icon>close</Icon> Incomplete derivation tree: intermediate term omitted</span>
                    {showFullWorking && (
                      <div className="full-working">
                        <b>Full working review</b>
                        <span>∂z/∂s = (∂z/∂x)(∂x/∂s) + (∂z/∂y)(∂y/∂s)</span>
                        <span>= (2xy)cos(t) + (x² + 6y)sin(t)</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="misconception">
                  <Icon>crisis_alert</Icon>
                  <div>
                    <strong>Key Misconception Pinpointed</strong>
                    <p>
                      You correctly evaluated the first branch <code>∂z/∂x · ∂x/∂s</code>, but dropped the entire secondary dependence tree branch <code>∂z/∂y · ∂y/∂s</code>. Even though <code>sin(0) = 0</code> causes the omitted term to vanish coincidentally here, this reasoning will fail whenever <code>t ≠ kπ</code>.
                    </p>
                  </div>
                </div>
                <BranchMap />
              </article>
            </section>

            <section aria-label="Diagnostics and recommended interventions" className="review-column review-column--secondary">
              <article className="diagnostic-card panel">
                <SectionTitle icon="troubleshoot" trailing="Automated Evaluation">Step Diagnostic Breakdown</SectionTitle>
                <div className="diagnostic-step">
                  <div className="diagnostic-step__heading">
                    <span className="step-number">1</span>
                    <strong>x-Partial Dependence Branch</strong>
                    <span className="status-pill status-pill--success"><Icon>check_circle</Icon>Solved</span>
                  </div>
                  <p>Computed <code>∂z/∂x = 2xy</code> and <code>∂x/∂s = cos(t)</code>. Evaluated at point <code>(1, 0)</code> yielded <code>(2·1·0)(1) = 0</code>.</p>
                </div>
                <div className="diagnostic-step diagnostic-step--missed">
                  <div className="diagnostic-step__heading">
                    <span className="step-number">2</span>
                    <strong>y-Partial Dependence Branch</strong>
                    <span className="status-pill status-pill--error"><Icon>error</Icon>Missed Step</span>
                  </div>
                  <p>Full chain rule requires adding <code>(∂z/∂y)(∂y/∂s) = (x² + 6y)(sin t)</code>. At <code>s=1, t=0</code>, it evaluates to <code>(1 + 0)(0) = 0</code>. This step was omitted from the derivation.</p>
                </div>
                <div className="canonical-form">
                  <span>Canonical Form:</span>
                  <code>∂z/∂s = (∂z/∂x)(∂x/∂s) + (∂z/∂y)(∂y/∂s) = 0 + 0 = 0</code>
                </div>
              </article>

              <article className="router-card panel">
                <SectionTitle icon="alt_route" trailing="Recommended Interventions">Adaptive Pedagogical Router</SectionTitle>
                <button className="intervention" onClick={() => showNotice('Starting a guided AI tutor walkthrough')} type="button">
                  <span className="intervention__top"><span className="intervention__icon"><Icon>psychology</Icon></span><strong>Ask AI Tutor to Walk Through This Exact Step</strong><Icon>arrow_forward</Icon></span>
                  <span className="intervention__description">Launches an interactive visual tree diagram walkthrough with targeted Socratic questions regarding compound partial terms.</span>
                  <span className="intervention__meta"><b>Estimated: 90 secs</b><i />Guided Animation</span>
                </button>
                <button className="intervention" onClick={() => showNotice('A similar practice problem is ready')} type="button">
                  <span className="intervention__top"><span className="intervention__icon"><Icon>difference</Icon></span><strong>Try an Identical Structure Problem</strong><Icon>arrow_forward</Icon></span>
                  <span className="intervention__description">Scaffolds a twin problem where <code>t = π/4</code> so vanishing terms cannot mask branch omissions.</span>
                  <span className="intervention__meta"><b>Remedial Reinforcement</b><i />With branch hints</span>
                </button>
              </article>

              <article className="retention-card panel">
                <SectionTitle icon="model_training"><>Retention &amp; Mastery Impact</></SectionTitle>
                <div className="mastery">
                  <div className="mastery__labels"><span>Multivariable Chain Rule Mastery</span><strong>42% → 58%</strong></div>
                  <div aria-label="Mastery 58%" className="progress-track progress-track--mastery" role="progressbar" aria-valuenow={58} aria-valuemin={0} aria-valuemax={100}><span /></div>
                  <div className="mastery__scale"><span>Foundational</span><strong>Current: Intermediate Tier</strong><span>Advanced Fluency</span></div>
                </div>
                <div className="review-schedule">
                  <Icon>event_upcoming</Icon>
                  <span><small>Next review scheduled in:</small><strong>3 days (Optimal cognitive recall window)</strong></span>
                </div>
              </article>

              <div className="bottom-actions">
                <button className="review-button" onClick={() => setShowFullWorking((show) => !show)} type="button">
                  <Icon>history_edu</Icon>{showFullWorking ? 'Hide Full Working' : 'Review Full Working'}
                </button>
                <button className="next-button" disabled={question >= 5} onClick={() => setQuestion((current) => Math.min(5, current + 1))} type="button">
                  {question >= 5 ? 'Session Complete' : 'Next Practice Question'}<Icon>{question >= 5 ? 'check' : 'arrow_forward'}</Icon>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      {notice && <div aria-live="polite" className="toast">{notice}</div>}

      {toolPanel && (
        <div className="modal-backdrop" onClick={() => setToolPanel(null)} role="presentation">
          <section
            aria-labelledby="tool-panel-title"
            aria-modal="true"
            className="tool-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="tool-dialog__heading">
              <div><span className="eyebrow">Study tools</span><h2 id="tool-panel-title">{toolPanel === 'cas' ? 'CAS Calculator' : 'Scratchpad'}</h2></div>
              <button aria-label="Close study tool" className="icon-button" onClick={() => setToolPanel(null)} type="button"><Icon>close</Icon></button>
            </div>
            {toolPanel === 'cas' ? (
              <div className="cas-result"><span>Current expression</span><code>(∂z/∂x)(∂x/∂s) + (∂z/∂y)(∂y/∂s)</code><span>At s = 1, t = 0</span><strong>0 + 0 = 0</strong></div>
            ) : (
              <label className="scratchpad-input">Your working<textarea autoFocus onChange={(event) => setScratchpad(event.target.value)} placeholder="Write a note or equation…" value={scratchpad} /></label>
            )}
            <button className="next-button tool-dialog__done" onClick={() => setToolPanel(null)} type="button">Done<Icon>check</Icon></button>
          </section>
        </div>
      )}
    </div>
  )
}

export default DiagnosticReview
