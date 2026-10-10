import { useRef, useState } from 'react'
import './course-materials.css'
import '../../features/assessment/diagnostic-review.css'

type MaterialTab = 'All Materials' | 'Lecture Slides' | 'Problem Sets' | 'Formula Sheets & Syllabi' | 'Extracted Concept Graph'

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

const materialTabs: { icon?: string; label: MaterialTab; count?: number }[] = [
  { label: 'All Materials', count: 14 },
  { icon: 'slideshow', label: 'Lecture Slides', count: 8 },
  { icon: 'assignment', label: 'Problem Sets', count: 4 },
  { icon: 'menu_book', label: 'Formula Sheets & Syllabi', count: 2 },
  { icon: 'hub', label: 'Extracted Concept Graph' },
]

const suggestedPrompts = [
  'Why must vector v be normalized to unit length before the scalar dot product?',
  'Show step-by-step derivation for the slide 14 temperature gradient example.',
  'How does this relate to chain rule with multivariable composite surfaces?',
]

function Icon({ children, className = '' }: { children: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{children}</span>
}

function VectorDiagram() {
  return (
    <svg aria-label="Gradient vector and unit direction vector at a point on a contour" className="vector-diagram" role="img" viewBox="0 0 260 160">
      <defs>
        <marker id="materials-arrow" markerHeight="6" markerWidth="6" orient="auto" refX="6" refY="5" viewBox="0 0 10 10">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#006a61" />
        </marker>
      </defs>
      <line className="vector-axis" x1="20" x2="240" y1="130" y2="130" />
      <line className="vector-axis" x1="130" x2="130" y1="20" y2="145" />
      <path className="vector-contour" d="M 35 120 C 80 120, 100 45, 230 40" />
      <circle cx="110" cy="85" fill="#006a61" r="4.5" />
      <text className="vector-label" x="95" y="105">P₀(x₀,y₀)</text>
      <line markerEnd="url(#materials-arrow)" stroke="#006a61" strokeWidth="2.5" x1="110" x2="175" y1="85" y2="35" />
      <text className="vector-label vector-label--teal" x="178" y="32">∇f</text>
      <line className="vector-unit" x1="110" x2="185" y1="85" y2="92" />
      <text className="vector-label" x="190" y="96">û</text>
      <path className="vector-angle" d="M 140 70 A 25 25 0 0 1 143 86" />
      <text className="vector-label vector-label--teal" x="146" y="80">θ</text>
    </svg>
  )
}

function CourseMaterials({
  onNavigateToAssessment,
  onNavigateToTutor,
}: {
  onNavigateToAssessment: () => void
  onNavigateToTutor: () => void
}) {
  const [activeNav, setActiveNav] = useState('Learning Resources')
  const [activeTab, setActiveTab] = useState<MaterialTab>('All Materials')
  const [page, setPage] = useState(14)
  const [zoom, setZoom] = useState(100)
  const [hitIndex, setHitIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const [toast, setToast] = useState('')
  const [uploadedFile, setUploadedFile] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)
  const slideRef = useRef<HTMLElement>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const chooseNav = (label: string) => {
    if (label === 'Practice & Quizzes') {
      onNavigateToAssessment()
      return
    }
    if (label === 'AI Tutor Workspace') {
      onNavigateToTutor()
      return
    }
    setActiveNav(label)
    if (label !== 'Learning Resources') showToast(`${label} selected`)
  }

  const jumpToTopic = () => {
    setHitIndex((index) => (index + 1) % 3)
    setPage((current) => current === 14 ? 15 : 14)
    showToast(`Jumped to search result ${((hitIndex + 1) % 3) + 1} of 3`)
  }

  const copyFormula = async () => {
    try {
      await navigator.clipboard.writeText('D_u f(x_0, y_0) = ∇f(x_0, y_0) · û, where ||û|| = 1')
      showToast('LaTeX definition copied')
    } catch {
      showToast('Clipboard access is unavailable in this browser')
    }
  }

  const downloadNotes = () => {
    const notes = [
      'MATH 201 · Lecture 08 · Directional Derivatives & Unit Vector Normalization',
      '',
      'D_u f(x_0, y_0) = ∇f(x_0, y_0) · û, where ||û|| = 1',
      '',
      'The maximum directional derivative occurs when û aligns with ∇f.',
      'Normalize the direction vector before calculating the directional derivative.',
    ].join('\n')
    const url = URL.createObjectURL(new Blob([notes], { type: 'text/plain' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'lecture-08-slide-notes.txt'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Slide notes downloaded')
  }

  const submitQuestion = () => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      showToast('Enter a question about this lecture first')
      return
    }
    setSubmittedQuestion(trimmedQuery)
    setQuery('')
  }

  const tabMessage = activeTab === 'All Materials'
    ? 'Showing the active lecture and related course material.'
    : activeTab === 'Extracted Concept Graph'
      ? 'Showing extracted concepts for Lecture 08.'
      : `Showing ${activeTab.toLowerCase()} for MATH 201.`

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <div className="sidebar__main">
          <a className="brand" href="#home" onClick={(event) => event.preventDefault()}>
            <span className="brand__mark">S</span>
            <span className="brand__name"><strong>Synapse</strong><small>Academic Studio</small></span>
            <span className="brand__version">AI 2.5</span>
          </a>
          <button className="course-select" onClick={() => showToast('MATH 201 · Multivariable Calculus')} type="button">
            <Icon>menu_book</Icon>
            <span className="course-select__text"><small>Enrolled Course</small><strong>MATH 201: Multivar Calc</strong></span>
            <Icon className="course-select__arrow">unfold_more</Icon>
          </button>
          <nav aria-label="Main navigation" className="side-nav">
            {navigation.map((item) => (
              <button
                aria-current={activeNav === item.label ? 'page' : undefined}
                className={`side-nav__item${activeNav === item.label ? ' is-active' : ''}`}
                key={item.label}
                onClick={() => chooseNav(item.label)}
                type="button"
              >
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
          <button className="profile-card" onClick={() => showToast('Signed in as Elena Vance')} type="button">
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
            <input aria-label="Search course materials" onChange={(event) => setQuery(event.target.value)} placeholder="Search course materials, concepts, formulas..." value={query} />
          </label>
          <button className="topbar__course" onClick={() => showToast('MATH 201 · Section 04')} type="button"><span /> MATH 201 · Section 04</button>
          <div className="topbar__actions">
            <button aria-pressed="true" className="live-toggle" onClick={() => showToast('Live Study Lens is enabled')} type="button">
              <Icon>visibility</Icon><span>Live Study Lens</span><span className="switch is-on"><i /></span>
            </button>
            <button aria-label="Notifications" className="icon-button notification-button" onClick={() => showToast('You are all caught up')} type="button"><Icon>notifications</Icon><i /></button>
            <button aria-label="User profile" className="topbar__avatar" onClick={() => showToast('Elena Vance · Junior · CS & Math')} type="button"><Icon>person</Icon></button>
          </div>
        </header>

        <main className="main-content materials-main">
          <div className="materials-breadcrumb">
            <button onClick={() => showToast('Your courses')} type="button">My Courses</button><Icon>chevron_right</Icon>
            <button onClick={() => showToast('MATH 201 · Multivariable Calculus')} type="button">MATH 201: Multivariable Calculus</button><Icon>chevron_right</Icon>
            <strong>Course Materials</strong>
          </div>

          <section className="materials-heading">
            <div>
              <h1>Course Materials &amp;<br className="materials-title-break" /> Document Intelligence</h1>
              <p>AI-indexed lecture slides, problem sets, and syllabus concepts. OCR-parsed for instant query analysis and adaptive practice synthesis.</p>
            </div>
            <div className="materials-heading__actions">
              <span className="canvas-sync"><i /> Canvas LMS Synced</span>
              <button className="materials-secondary-button" onClick={() => {
                setActiveTab('Extracted Concept Graph')
                document.getElementById('topic-outline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }} type="button"><Icon>account_tree</Icon>Extract Concept Graph</button>
              <button className="materials-primary-button" onClick={() => uploadRef.current?.click()} type="button"><Icon>upload_file</Icon>Upload Material</button>
              <input
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg"
                aria-label="Upload course material"
                className="visually-hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    setUploadedFile(file.name)
                    showToast(`${file.name} added to the upload queue`)
                  }
                  event.target.value = ''
                }}
                ref={uploadRef}
                type="file"
              />
            </div>
          </section>

          <div className="material-tabs" aria-label="Filter course materials" role="tablist">
            {materialTabs.map((tab) => (
              <button
                aria-selected={activeTab === tab.label}
                className={`material-tab${activeTab === tab.label ? ' is-active' : ''}`}
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label)
                  if (tab.label === 'Extracted Concept Graph') {
                    document.getElementById('topic-outline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                role="tab"
                type="button"
              >
                {tab.icon && <Icon>{tab.icon}</Icon>}
                <span>{tab.label}</span>
                {tab.count !== undefined && <small>{tab.count}</small>}
              </button>
            ))}
          </div>
          {activeTab !== 'All Materials' && <p aria-live="polite" className="materials-filter-note">{tabMessage}</p>}

          <div className="materials-grid">
            <section aria-label="Lecture document viewer" className={`materials-left${isFullscreen ? ' is-fullscreen' : ''}`} ref={slideRef}>
              <article className="viewer-card panel">
                <div className="viewer-heading">
                  <span className="viewer-file-icon"><Icon>picture_as_pdf</Icon></span>
                  <div className="viewer-heading__file">
                    <div className="viewer-heading__title">
                      <strong>Lecture 08: Directional Derivatives &amp; Gradient Vectors.pdf</strong>
                      <span className="ocr-pill">99.4% OCR Verified</span>
                    </div>
                    <small>Prof. Julian Vance · Department of Mathematics · Recorded Fall 2024</small>
                  </div>
                  <div className="viewer-controls">
                    <button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><Icon>chevron_left</Icon></button>
                    <span>{page} / 32</span>
                    <button aria-label="Next page" disabled={page >= 32} onClick={() => setPage((current) => Math.min(32, current + 1))} type="button"><Icon>chevron_right</Icon></button>
                    <i />
                    <button aria-label="Zoom out" disabled={zoom <= 70} onClick={() => setZoom((current) => Math.max(70, current - 10))} type="button"><Icon>zoom_out</Icon></button>
                    <span>{zoom}%</span>
                    <button aria-label="Zoom in" disabled={zoom >= 140} onClick={() => setZoom((current) => Math.min(140, current + 10))} type="button"><Icon>zoom_in</Icon></button>
                    <button aria-label={isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen'} onClick={() => setIsFullscreen((fullscreen) => !fullscreen)} type="button"><Icon>{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</Icon></button>
                  </div>
                </div>

                <div className="slide-search">
                  <span><Icon>search</Icon>Search within slide stream (Cmd+F)</span>
                  <span><code>"gradient vector" ({3 - hitIndex % 3} hits)</code><button onClick={jumpToTopic} type="button">Jump to next</button></span>
                </div>

                <article className="slide-stage" aria-label={`Lecture slide ${page}`} style={{ zoom: zoom / 100 }}>
                  <div className="slide-ribbon"><span><i /> MATH 201 · LECTURE 08 · THEOREM 3.4</span><span>Slide Timestamp: 24:18 (Audio Synced)</span></div>
                  <div className="slide-title">
                    <h2>Directional Derivatives &amp; Unit Vector Normalization</h2>
                    <p>Rate of change along an arbitrary orientation vector in Euclidean 2-space</p>
                  </div>
                  <div className="formal-definition">
                    <div className="formal-definition__top"><span>Formal Definition</span><button onClick={copyFormula} type="button"><Icon>content_copy</Icon>Copy LaTeX</button></div>
                    <div className="formula-display"><strong>D<sub>u</sub> f(x₀, y₀) = ∇f(x₀, y₀) · û</strong><span>where</span><b>||û|| = 1</b></div>
                    <p><strong>Theorem 3.4 (Steepest Ascent):</strong> The maximum directional derivative at point (x₀, y₀) occurs precisely when the direction vector û aligns parallel to the gradient vector ∇f, with maximum magnitude equal to ||∇f(x₀, y₀)||.</p>
                  </div>
                  <div className="slide-interpretation">
                    <div className="vector-figure">
                      <span>Vector Direction Plane</span>
                      <VectorDiagram />
                      <small>Fig 8.2: Angle θ between ∇f and arbitrary û</small>
                    </div>
                    <div className="interpretation-notes">
                      <div><strong><Icon>verified</Icon>Geometric Interpretation</strong><p>The dot product projects the maximum gradient vector onto the test heading vector. When θ = 90°, directional change is identically 0 (level curve contour line).</p></div>
                      <div className="frequent-trap"><strong><Icon>warning</Icon>Frequent Trap</strong><p>Forgetting to normalize raw vector <code>v = ⟨a, b⟩</code> by dividing by its Euclidean norm produces an inflated scalar rate.</p></div>
                    </div>
                  </div>
                  <div className="slide-footer">
                    <span>OCR Extraction Confidence: 99.4% · MathJax Verified</span>
                    <span><button onClick={() => showToast('Read-aloud is not available in this browser preview')} type="button"><Icon>record_voice_over</Icon>Read Aloud</button><button onClick={downloadNotes} type="button"><Icon>download</Icon>Export Notes</button></span>
                  </div>
                </article>

                <div className="document-actions">
                  <button className="document-action document-action--primary" onClick={onNavigateToTutor} type="button"><Icon>neurology</Icon>Ask AI Tutor</button>
                  <button className="document-action" onClick={() => { setQuizStarted(true); setQuizAnswer(null); document.getElementById('adaptive-drill')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }} type="button"><Icon>quiz</Icon>Generate Drill</button>
                  <button className="document-action" onClick={() => showToast('Lecture 08 slide added to your scratchpad')} type="button"><Icon>draw</Icon>To Scratchpad</button>
                  <button className="document-action" onClick={() => showToast('Slide 14 scheduled for spaced review')} type="button"><Icon>bookmark_add</Icon>Spaced Review</button>
                </div>

                <div className="associated-assets">
                  <div className="associated-assets__heading"><span>Associated Course Assets</span><button onClick={() => showToast('8 files in the Lecture 08 bundle')} type="button">View 8 files in Lecture 08 bundle</button></div>
                  <div className="asset-list">
                    <button className="asset-item" onClick={() => showToast('PS4_Solutions.pdf · Matches Slide 14–18')} type="button"><Icon>description</Icon><span><strong>PS4_Solutions.pdf</strong><small>Matches Slide 14–18</small></span></button>
                    <button className="asset-item" onClick={() => showToast('Lecture08_Audio.m4a · Transcript indexed')} type="button"><Icon>videocam</Icon><span><strong>Lecture08_Audio.m4a</strong><small>Transcript indexed</small></span></button>
                    <button className="asset-item" onClick={() => showToast('Stewart_Ch14.6.pdf · Assigned Reading')} type="button"><Icon>functions</Icon><span><strong>Stewart_Ch14.6.pdf</strong><small>Assigned Reading</small></span></button>
                    {uploadedFile && <button className="asset-item asset-item--new" onClick={() => showToast(`${uploadedFile} is queued for indexing`)} type="button"><Icon>upload_file</Icon><span><strong>{uploadedFile}</strong><small>Queued for indexing</small></span></button>}
                  </div>
                </div>
              </article>
            </section>

            <section aria-label="Extracted course intelligence" className="materials-right">
              <article className="outline-card panel" id="topic-outline">
                <div className="materials-card-title"><span><Icon>account_tree</Icon><h2>Extracted Topic Outline</h2></span><small>Lecture 08 Tree</small></div>
                <p className="materials-card-intro">Hierarchical syllabus taxonomy synthesized from uploaded slides &amp; speech transcripts.</p>
                <div className="topic-item">
                  <div className="topic-item__heading"><strong>1. Directional Derivative Definition</strong><span className="topic-mastery">88% Solid Mastery</span></div>
                  <div className="topic-progress"><span style={{ width: '88%' }} /></div>
                  <div className="topic-item__meta"><span>Slides 1–7 · 2 Practice Sets Completed</span><button onClick={() => { setPage(4); showToast('Opened notes for the directional derivative definition') }} type="button">Review Notes</button></div>
                </div>
                <div className="topic-item topic-item--bottleneck">
                  <div className="topic-item__heading"><strong><Icon>report_problem</Icon>2. Unit Vector Normalization</strong><span className="topic-bottleneck">Bottleneck</span></div>
                  <div className="topic-progress"><span style={{ width: '38%' }} /></div>
                  <div className="topic-item__meta"><span className="linked-topic">Linked: #MATH201-MR-03</span><span>Flagged in Quiz #4 (Attempt 2)</span></div>
                  <p>Common error: Evaluated ∇f · v directly with vector length ≠ 1, missing radical scale divisor √(a² + b²).</p>
                </div>
                <div className="topic-item">
                  <div className="topic-item__heading"><strong>3. Gradient as Steepest Ascent</strong><span className="topic-in-progress">62% In Progress</span></div>
                  <div className="topic-progress"><span style={{ width: '62%' }} /></div>
                  <div className="topic-item__meta"><span>Slides 12–21 · Active Slide 14</span><button onClick={() => { setPage(14); slideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} type="button">Inspect Proof</button></div>
                </div>
                <div className="topic-item topic-item--upcoming">
                  <div className="topic-item__heading"><strong>4. Tangent Plane Formulation</strong><span>Upcoming</span></div>
                  <div className="topic-item__meta"><span>Slides 22–32 · Scheduled Lecture 09</span><span>Prerequisite: Concept 3</span></div>
                </div>
                {activeTab === 'Extracted Concept Graph' && <div className="graph-note"><Icon>hub</Icon>Concept graph view is focused on this lecture's prerequisite and mastery links.</div>}
              </article>

              <article className="query-card panel">
                <div className="materials-card-title"><span><Icon>psychology_alt</Icon><h2>Document Query Studio</h2></span><small>Socratic Lens</small></div>
                <p className="materials-card-intro">Ask questions grounded strictly in this lecture transcript and formula sheets.</p>
                <div className="suggested-prompts">
                  <strong>Suggested High-Yield Prompts:</strong>
                  {suggestedPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => setQuery(prompt)} type="button"><Icon>auto_awesome</Icon><span>{prompt}</span></button>
                  ))}
                </div>
                {submittedQuestion && (
                  <div aria-live="polite" className="grounded-answer">
                    <strong><Icon>auto_awesome</Icon>Grounded response</strong>
                    <p>{submittedQuestion}</p>
                    <p>A directional derivative uses a unit direction vector: normalize <code>v</code> first, then compute <code>∇f · û</code>. The lecture’s Theorem 3.4 says the maximum rate occurs when û points along the gradient.</p>
                    <small>Source: Lecture 08, Slide 14 · Theorem 3.4</small>
                  </div>
                )}
                <div className="query-compose">
                  <textarea aria-label="Ask a question grounded in Lecture 08" onChange={(event) => setQuery(event.target.value)} placeholder="Ask any question grounded in Lecture 08 (e.g. clarify the geometric angle theta)..." rows={3} value={query} />
                  <div className="query-compose__tools"><button aria-label="Voice input" onClick={() => showToast('Voice input is not available in this preview')} type="button"><Icon>mic</Icon></button><button aria-label="Attach a file" onClick={() => uploadRef.current?.click()} type="button"><Icon>attachment</Icon></button></div>
                </div>
                <div className="query-submit-row">
                  <span><Icon>menu_book</Icon>Citing: Slide 14 · Stewart 14.6</span>
                  <button onClick={submitQuestion} type="button">Submit to Socratic Tutor<Icon>arrow_forward</Icon></button>
                </div>
              </article>

              <article className="drill-card panel" id="adaptive-drill">
                <div className="materials-card-title"><span><Icon>fitness_center</Icon><h2>Adaptive Practice Drill</h2></span><small className="synth-pill">2 Synthesized Questions</small></div>
                <p className="materials-card-intro">Live questions constructed directly from Slide 14 theorem &amp; past student bottleneck data.</p>
                <div className="drill-question">
                  <div><strong>DRILL #1 · CONCEPT REINFORCEMENT</strong><span>Est. 90 sec</span></div>
                  <p>Let f(x, y) = x²e³ʸ. Compute the directional derivative at point (2, 0) in the direction of raw vector v = ⟨3, 4⟩.</p>
                  <div className="drill-tags"><span>Tests: Unit Normalization</span><span>Difficulty: Medium</span></div>
                </div>
                <div className="drill-question">
                  <div><strong>DRILL #2 · THEOREM INTUITION</strong><span>Est. 60 sec</span></div>
                  <p>If the directional derivative along vector û equals zero, what is the geometric relationship between û and the contour level curve of f?</p>
                  <div className="drill-tags"><span>Tests: Orthogonality</span><span>Difficulty: Conceptual</span></div>
                </div>
                {quizStarted && (
                  <div className="quiz-panel">
                    <strong>Micro-quiz · Slide 14</strong>
                    <p>Before calculating a directional derivative in the direction of v = ⟨3, 4⟩, what should you do?</p>
                    <div>
                      {['Use v directly', 'Normalize v to unit length', 'Square each component'].map((answer) => (
                        <button
                          aria-pressed={quizAnswer === answer}
                          className={quizAnswer === answer ? (answer === 'Normalize v to unit length' ? 'is-correct' : 'is-incorrect') : ''}
                          key={answer}
                          onClick={() => setQuizAnswer(answer)}
                          type="button"
                        >{answer}</button>
                      ))}
                    </div>
                    {quizAnswer && <small>{quizAnswer === 'Normalize v to unit length' ? 'Correct — û = v / ||v||.' : 'Not quite. The direction vector must have unit length.'}</small>}
                  </div>
                )}
                <button className="start-quiz" onClick={() => { setQuizStarted((started) => !started); setQuizAnswer(null) }} type="button">
                  <Icon>{quizStarted ? 'close' : 'play_circle'}</Icon>{quizStarted ? 'Close Micro-Quiz' : 'Start 3-Minute Micro-Quiz on Slide 14'}
                </button>
              </article>
            </section>
          </div>

          <footer className="integrity-footer">
            <span className="integrity-footer__icon"><Icon>verified_user</Icon></span>
            <span className="integrity-footer__copy"><strong>Academic Integrity &amp; Grounding Assurance</strong><small>Synapse verified all mathematical expressions against Prof. Vance's official Canvas syllabus. Zero generative hallucination policy active.</small></span>
            <span className="integrity-footer__actions"><button onClick={() => showToast('OCR raw JSON is not available in this preview')} type="button">View OCR Raw JSON</button><button onClick={downloadNotes} type="button">Export Slide Notes</button></span>
          </footer>
        </main>
      </div>
      {toast && <div aria-live="polite" className="toast">{toast}</div>}
    </div>
  )
}

export default CourseMaterials
