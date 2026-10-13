import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './course-materials.css'
import '../../features/assessment/diagnostic-review.css'
import { apiRequest } from '../../services/api_client'

interface MaterialRecord { id: number; filename: string; content_type: string; byte_size: number; created_at: string }

const suggestedPrompts = [
  'Summarize the main ideas in this source.',
  'Explain one derivation from the document step by step.',
  'What should I review first to understand this material?',
]

function Icon({ children, className = '' }: { children: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{children}</span>
}

function CourseMaterials() {
  const navigateTo = useNavigate()
  const [zoom, setZoom] = useState(100)
  const [documentSearch, setDocumentSearch] = useState('')
  const [query, setQuery] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const [materials, setMaterials] = useState<MaterialRecord[]>([])
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const [selectedMaterialText, setSelectedMaterialText] = useState('')
  const [materialError, setMaterialError] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [uploadedFile, setUploadedFile] = useState('')
  const uploadRef = useRef<HTMLInputElement>(null)
  const slideRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let active = true
    apiRequest<MaterialRecord[]>('/materials')
      .then(async (data) => {
        if (!active) return
        setMaterials(data)
        if (data.length) {
          const current = data[0]
          const detail = await apiRequest<{ id: number; filename: string; text: string }>(`/materials/${current.id}`)
          if (active) {
            setSelectedMaterialId(current.id)
            setSelectedMaterialText(detail.text)
            setUploadedFile(current.filename)
          }
        }
      })
      .catch((reason: unknown) => { if (active) setMaterialError(reason instanceof Error ? reason.message : 'Unable to load uploaded materials') })
    return () => { active = false }
  }, [])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const copyExtractedText = async () => {
    try {
      await navigator.clipboard.writeText(selectedMaterialText)
      showToast('Extracted document text copied')
    } catch {
      showToast('Clipboard access is unavailable in this browser')
    }
  }

  const downloadNotes = () => {
    if (!selectedMaterialText) return
    const url = URL.createObjectURL(new Blob([selectedMaterialText], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${uploadedFile.replace(/\.[^.]+$/, '') || 'course-material'}-extracted.txt`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Extracted text downloaded')
  }

  const submitQuestion = async () => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      showToast('Enter a question about this lecture first')
      return
    }
    setBusy(true)
    setMaterialError('')
    try {
      const result = await apiRequest<{ reply: string }>('/tutor/chat', {
        method: 'POST',
        body: JSON.stringify({ message: trimmedQuery, material_id: selectedMaterialId }),
      })
      setSubmittedQuestion(result.reply)
      setQuery('')
    } catch (reason) {
      setMaterialError(reason instanceof Error ? reason.message : 'Unable to query your materials')
    } finally {
      setBusy(false)
    }
  }

  const uploadMaterial = async (file: File) => {
    setBusy(true)
    setMaterialError('')
    const form = new FormData()
    form.append('file', file)
    try {
      const uploaded = await apiRequest<{ id: number; filename: string; characters_extracted: number }>('/materials', { method: 'POST', body: form })
      const record: MaterialRecord = { id: uploaded.id, filename: uploaded.filename, content_type: file.type || 'application/octet-stream', byte_size: file.size, created_at: new Date().toISOString() }
      const detail = await apiRequest<{ id: number; filename: string; text: string }>(`/materials/${record.id}`)
      setMaterials((current) => [record, ...current.filter((item) => item.id !== record.id)])
      setSelectedMaterialId(record.id)
      setSelectedMaterialText(detail.text)
      setUploadedFile(record.filename)
      showToast(`${record.filename} uploaded · ${uploaded.characters_extracted.toLocaleString()} characters extracted`)
    } catch (reason) {
      setMaterialError(reason instanceof Error ? reason.message : 'Unable to upload the material')
    } finally {
      setBusy(false)
    }
  }

  const selectMaterial = async (id: number | null) => {
    setSelectedMaterialId(id)
    setSelectedMaterialText('')
    setMaterialError('')
    if (id === null) return
    try {
      const detail = await apiRequest<{ id: number; filename: string; text: string }>(`/materials/${id}`)
      setSelectedMaterialText(detail.text)
      setUploadedFile(detail.filename)
    } catch (reason) {
      setMaterialError(reason instanceof Error ? reason.message : 'Unable to open uploaded material')
    }
  }

  return (
    <div className="materials-main-content">
        <header className="topbar">
          <span className="topbar-search-status"><Icon>search</Icon>{materials.length} uploaded source(s)</span>
          <button className="topbar__course" onClick={() => navigateTo('/study-planner')} type="button"><span /> {materials.length} uploaded material(s)</button>
          <div className="topbar__actions">
            <span className="live-toggle"><Icon>visibility</Icon><span>Document tools</span></span>
            <button aria-label="Study planner and due tasks" className="icon-button notification-button" onClick={() => navigateTo('/study-planner')} type="button"><Icon>notifications</Icon><i /></button>
            <button aria-label="User profile settings" className="topbar__avatar" onClick={() => navigateTo('/settings')} type="button"><Icon>person</Icon></button>
          </div>
        </header>

        <main className="main-content materials-main">
          <nav aria-label="Breadcrumb" className="materials-breadcrumb">
            <span>Learning Resources</span><Icon>chevron_right</Icon>
            <strong>Course Materials</strong>
          </nav>

          <section className="materials-heading">
            <div>
              <h1>Course Materials &amp;<br className="materials-title-break" /> Document Intelligence</h1>
              <p>Upload PDFs, text, Markdown, or CSV files. Extracted content is saved to your account and can ground tutor answers.</p>
            </div>
            <div className="materials-heading__actions">
              <button className="materials-secondary-button" onClick={() => {
                document.getElementById('topic-outline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }} type="button"><Icon>folder_copy</Icon>Browse uploaded sources</button>
              <button className="materials-primary-button" onClick={() => uploadRef.current?.click()} type="button"><Icon>upload_file</Icon>Upload Material</button>
              <input
                accept=".pdf,.txt,.md,.csv"
                aria-label="Upload course material"
                className="visually-hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void uploadMaterial(file)
                  event.target.value = ''
                }}
                ref={uploadRef}
                type="file"
              />
            </div>
          </section>

          <div className="materials-grid">
            <section aria-label="Uploaded document viewer" className="materials-left" ref={slideRef}>
              <article className="viewer-card panel">
                <div className="viewer-heading">
                  <span className="viewer-file-icon"><Icon>picture_as_pdf</Icon></span>
                  <div className="viewer-heading__file">
                    <div className="viewer-heading__title">
                      <strong>{uploadedFile || 'No material selected'}</strong>
                      <span className="ocr-pill">{selectedMaterialText ? `${selectedMaterialText.length.toLocaleString()} characters extracted` : 'Upload a document to view its text'}</span>
                    </div>
                    <small>Stored in your account · {materials.length} uploaded source(s)</small>
                  </div>
                  <div className="viewer-controls">
                    <button aria-label="Decrease text size" disabled={zoom <= 70} onClick={() => setZoom((current) => Math.max(70, current - 10))} type="button"><Icon>zoom_out</Icon></button>
                    <span>{zoom}%</span>
                    <button aria-label="Increase text size" disabled={zoom >= 140} onClick={() => setZoom((current) => Math.min(140, current + 10))} type="button"><Icon>zoom_in</Icon></button>
                  </div>
                </div>

                <div className="slide-search"><label><Icon>search</Icon><input aria-label="Search extracted document text" onChange={(event) => setDocumentSearch(event.target.value)} placeholder="Search within this document" value={documentSearch} /></label><span>{documentSearch && selectedMaterialText ? `${selectedMaterialText.toLowerCase().split(documentSearch.toLowerCase()).length - 1} match(es)` : 'Text extraction'}</span></div>

                {selectedMaterialText ? <article className="slide-stage uploaded-material-text" aria-label={`Extracted text from ${uploadedFile}`} style={{ zoom: zoom / 100 }}>
                  <div className="slide-title"><h2>{uploadedFile}</h2><p>Extracted document text · {selectedMaterialText.length.toLocaleString()} characters</p></div>
                  <pre>{documentSearch ? selectedMaterialText.split(new RegExp(`(${documentSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')).map((part, index) => part.toLowerCase() === documentSearch.toLowerCase() ? <mark key={`${index}-${part}`}>{part}</mark> : part) : selectedMaterialText}</pre>
                  <div className="slide-footer"><span>Extracted text for {uploadedFile}</span><span><button onClick={() => void copyExtractedText()} type="button"><Icon>content_copy</Icon>Copy Text</button><button onClick={downloadNotes} type="button"><Icon>download</Icon>Export Text</button></span></div>
                </article> : <div className="slide-stage upload-empty-state"><Icon>upload_file</Icon><strong>{materials.length ? 'Select a source to read its extracted text' : 'No materials uploaded yet'}</strong><p>Upload a PDF, TXT, Markdown, or CSV file to make its text available here and to the tutor.</p><button disabled={busy} onClick={() => uploadRef.current?.click()} type="button">{busy ? 'Uploading…' : 'Upload a document'}</button></div>}

                <div className="document-actions">
                  <button className="document-action document-action--primary" onClick={() => navigateTo('/ai-tutor')} type="button"><Icon>neurology</Icon>Ask AI Tutor</button>
                  <button className="document-action" onClick={() => navigateTo('/quiz')} type="button"><Icon>quiz</Icon>Practice a question</button>
                  <button className="document-action" onClick={() => navigateTo('/ai-tutor')} type="button"><Icon>draw</Icon>Discuss this text</button>
                  <button className="document-action" onClick={() => navigateTo('/progress')} type="button"><Icon>bookmark_add</Icon>Review schedule</button>
                </div>

                <div className="associated-assets">
                  <div className="associated-assets__heading"><span>Uploaded Sources</span><span>{materials.length} file(s)</span></div>
                  <div className="asset-list">
                    {materials.map((item) => <button aria-pressed={selectedMaterialId === item.id} className={`asset-item${selectedMaterialId === item.id ? ' asset-item--new' : ''}`} key={item.id} onClick={() => void selectMaterial(item.id)} type="button"><Icon>description</Icon><span><strong>{item.filename}</strong><small>{(item.byte_size / 1024).toFixed(1)} KB · {new Date(item.created_at).toLocaleDateString()}</small></span></button>)}
                    {materials.length === 0 && <p className="materials-filter-note">Uploaded files will appear here.</p>}
                  </div>
                </div>
              </article>
            </section>

            <section aria-label="Extracted course intelligence" className="materials-right">
              <article className="outline-card panel" id="topic-outline">
                <div className="materials-card-title"><span><Icon>folder_copy</Icon><h2>Uploaded source text</h2></span><small>{selectedMaterialText.length.toLocaleString()} chars</small></div>
                <p className="materials-card-intro">{uploadedFile || 'Select an uploaded file'} · content extracted from your own source.</p>
                {selectedMaterialText ? <pre className="source-text-preview">{selectedMaterialText.slice(0, 1800)}{selectedMaterialText.length > 1800 ? '…' : ''}</pre> : <p className="materials-filter-note">Select a source above to inspect its extracted text.</p>}
              </article>

              <article className="query-card panel">
                <div className="materials-card-title"><span><Icon>psychology_alt</Icon><h2>Document Query Studio</h2></span><small>Socratic Lens</small></div>
                <p className="materials-card-intro">Ask about the selected uploaded source. The tutor receives that source text as context.</p>
                <div className="suggested-prompts">
                  <strong>Suggested High-Yield Prompts:</strong>
                  {suggestedPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => setQuery(prompt)} type="button"><Icon>auto_awesome</Icon><span>{prompt}</span></button>
                  ))}
                </div>
                {materialError && <p className="materials-filter-note" role="alert">{materialError}</p>}
                {materials.length > 0 && <label className="materials-filter-note">Ground answers in an uploaded source: <select onChange={(event) => void selectMaterial(event.target.value ? Number(event.target.value) : null)} value={selectedMaterialId ?? ''}><option value="">No source selected</option>{materials.map((item) => <option key={item.id} value={item.id}>{item.filename}</option>)}</select></label>}
                {submittedQuestion && (
                  <div aria-live="polite" className="grounded-answer">
                    <strong><Icon>auto_awesome</Icon>Grounded response</strong>
                    <p>{submittedQuestion}</p>
                    <small>{selectedMaterialId ? `Source: ${materials.find((item) => item.id === selectedMaterialId)?.filename ?? 'uploaded material'}` : 'Answer generated by the configured AI tutor; no uploaded source was selected.'}</small>
                  </div>
                )}
                <div className="query-compose">
                  <textarea aria-label="Ask a question about your uploaded material" onChange={(event) => setQuery(event.target.value)} placeholder="Ask a question about the selected document..." rows={3} value={query} />
                  <div className="query-compose__tools"><button aria-label="Use voice input in tutor workspace" onClick={() => navigateTo('/ai-tutor')} type="button"><Icon>mic</Icon></button><button aria-label="Attach a file" onClick={() => uploadRef.current?.click()} type="button"><Icon>attachment</Icon></button></div>
                </div>
                <div className="query-submit-row">
                  <span><Icon>menu_book</Icon>{selectedMaterialId ? `Source: ${uploadedFile}` : 'Select a source above to ground your question'}</span>
                  <button disabled={busy} onClick={() => void submitQuestion()} type="button">{busy ? 'Working…' : 'Submit to Socratic Tutor'}<Icon>arrow_forward</Icon></button>
                </div>
              </article>

              <article className="drill-card panel" id="adaptive-drill">
                <div className="materials-card-title"><span><Icon>fitness_center</Icon><h2>Practice with your course material</h2></span></div>
                <p className="materials-card-intro">Open the assessment area to try the built-in question or generate a new question with your configured AI provider.</p>
                <button className="start-quiz" onClick={() => navigateTo('/quiz')} type="button"><Icon>quiz</Icon>Open Practice &amp; Quizzes</button>
              </article>
            </section>
          </div>

          <footer className="integrity-footer">
            <span className="integrity-footer__icon"><Icon>verified_user</Icon></span>
            <span className="integrity-footer__copy"><strong>Source handling</strong><small>Uploaded text is supplied to the tutor when a source is selected. Check generated guidance against your course materials.</small></span>
            <span className="integrity-footer__actions"><button onClick={() => { setActiveTab('All Materials'); document.querySelector('.materials-left')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} type="button">View extracted materials</button><button onClick={downloadNotes} type="button">Export Slide Notes</button></span>
          </footer>
        </main>
      {toast && <div aria-live="polite" className="toast">{toast}</div>}
    </div>
  )
}

export default CourseMaterials
