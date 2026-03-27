import { useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { useSubjectsTaught, useStudyMaterials } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import Modal from '@/components/shared/Modal'

const MATERIAL_TYPE_LABEL = {
  theory: 'Theory',
  notes: 'Notes',
  slides: 'Slides',
  reference: 'Reference',
  reading: 'Reading',
  assignment: 'Assignment',
  lab: 'Lab',
  video: 'Video',
  code: 'Code',
  link: 'Link',
  other: 'Other',
}

const norm = (s) => (s || '').trim().toLowerCase()

/** Prefer view link for preview, then file link */
const primaryUrl = (m) => m.external_url || m.file_url || null

/** Prefer file_url for download-style action */
const downloadUrl = (m) => m.file_url || m.external_url || null

/**
 * Inline preview when possible (Drive, PDF, images). Many hosts block iframes — user can open in new tab.
 */
function resolvePreview(url) {
  if (!url) return { kind: 'empty' }
  const v = url.toLowerCase()
  if (/\.(png|jpg|jpeg|gif|webp)(\?|#|$)/i.test(v)) return { kind: 'img', src: url }

  let m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (m) return { kind: 'iframe', src: `https://drive.google.com/file/d/${m[1]}/preview` }

  m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (v.includes('drive.google.com') && m) return { kind: 'iframe', src: `https://drive.google.com/file/d/${m[1]}/preview` }

  if (v.includes('.pdf') || v.includes('type=pdf')) {
    return { kind: 'iframe', src: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true` }
  }

  if (url.startsWith('http')) {
    return { kind: 'iframe', src: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true` }
  }

  return { kind: 'empty' }
}

function groupMaterialsByType(items) {
  const order = ['theory', 'notes', 'slides', 'reference', 'reading', 'assignment', 'lab', 'video', 'code', 'link', 'other']
  const groups = new Map()
  for (const m of items) {
    const t = m.material_type || 'other'
    if (!groups.has(t)) groups.set(t, [])
    groups.get(t).push(m)
  }
  const keys = [...new Set([...order.filter((k) => groups.has(k)), ...groups.keys()])]
  return keys.map((k) => ({ type: k, label: MATERIAL_TYPE_LABEL[k] ?? k, items: groups.get(k) }))
}

function buildSubjectBundles(subjects, materials) {
  const byId = new Map()
  for (const m of materials) {
    if (!m.subject_id) continue
    if (!byId.has(m.subject_id)) byId.set(m.subject_id, [])
    byId.get(m.subject_id).push(m)
  }

  const bundles = []
  const matchedIds = new Set()

  for (const sub of subjects) {
    const fromId = byId.get(sub.id) || []
    const fromName = materials.filter(
      (m) => !m.subject_id && norm(m.subject) === norm(sub.subject_name)
    )
    const merged = [...fromId, ...fromName]
    const seen = new Set()
    const unique = merged.filter((m) => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      matchedIds.add(m.id)
      return true
    })
    unique.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (b.year ?? 0) - (a.year ?? 0))
    bundles.push({
      key: sub.id,
      subject: sub,
      materials: unique,
    })
  }

  const unmatched = materials.filter((m) => !matchedIds.has(m.id))
  if (unmatched.length > 0) {
    unmatched.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (b.year ?? 0) - (a.year ?? 0))
    bundles.push({
      key: '__other__',
      subject: null,
      label: 'Other materials',
      materials: unmatched,
    })
  }

  return bundles
}

const EmptyState = ({ message }) => (
  <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-12) 0' }}>{message}</p>
)

const ErrorState = ({ message }) => (
  <p style={{ textAlign: 'center', color: 'var(--color-danger)', padding: 'var(--space-8) 0' }}>{message}</p>
)

const TeachingSection = () => {
  const { data: subjects = [], isLoading: loadS, isError: errS } = useSubjectsTaught()
  const { data: materials = [], isLoading: loadM, isError: errM } = useStudyMaterials()

  const [openBundle, setOpenBundle] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  const bundles = useMemo(() => buildSubjectBundles(subjects, materials), [subjects, materials])

  const loading = loadS || loadM
  const error = errS || errM

  const openBundleModal = (bundle) => {
    setOpenBundle(bundle)
    setSelectedMaterial(bundle.materials[0] ?? null)
  }

  const groupedInModal = openBundle ? groupMaterialsByType(openBundle.materials) : []

  const preview = selectedMaterial ? resolvePreview(primaryUrl(selectedMaterial)) : { kind: 'empty' }
  const dl = selectedMaterial ? downloadUrl(selectedMaterial) : null

  const levelLabel = (level) => {
    if (level === 'UG') return 'Undergraduate'
    if (level === 'PG') return 'Postgraduate'
    return level || ''
  }

  const closeModal = () => {
    setOpenBundle(null)
    setSelectedMaterial(null)
  }

  const modalTitle = openBundle
    ? openBundle.subject
      ? `${openBundle.subject.subject_name}${openBundle.subject.subject_code ? ` (${openBundle.subject.subject_code})` : ''}`
      : openBundle.label
    : ''

  return (
    <section id="teaching" className="section">
      <div className="container">
        <SectionHeader
          title="Teaching & learning"
          subtitle="Select a subject to view study materials, preview resources, and download or open files"
        />

        {loading && <LoadingSkeleton count={4} />}
        {error && <ErrorState message="Failed to load teaching data. Please try again later." />}
        {!loading && !error && subjects.length === 0 && materials.length === 0 && (
          <EmptyState message="No subjects or materials listed yet." />
        )}
        {!loading && !error && (subjects.length > 0 || materials.length > 0) && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-10)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
              {bundles.map((bundle) => {
                const sub = bundle.subject
                const count = bundle.materials.length
                const title = sub ? sub.subject_name : bundle.label
                return (
                  <button
                    key={bundle.key}
                    type="button"
                    className="teaching-subject-card"
                    onClick={() => openBundleModal(bundle)}
                  >
                    <p style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-1)' }}>
                      {title}
                    </p>
                    {sub?.subject_code && (
                      <p className="teaching-subject-card__meta">Code: {sub.subject_code}</p>
                    )}
                    {sub?.level && (
                      <p className="teaching-subject-card__meta">{levelLabel(sub.level)}</p>
                    )}
                    {(sub?.year_from || sub?.year_to) && (
                      <p className="teaching-subject-card__meta">
                        {sub.year_from}
                        {sub.year_to ? ` – ${sub.year_to}` : ''}
                      </p>
                    )}
                    <p className="teaching-subject-card__hint">
                      {count === 0 ? 'No materials yet — click to view' : `${count} material${count !== 1 ? 's' : ''} · View & download`}
                    </p>
                  </button>
                )
              })}
            </div>
          </Motion.div>
        )}

        <Modal isOpen={!!openBundle} onClose={closeModal} title={modalTitle} contentClassName="modal-content--teaching">
          {!openBundle || openBundle.materials.length === 0 ? (
            <p className="text-muted" style={{ margin: 0, lineHeight: 1.65 }}>
              No study materials are linked to this subject yet. In admin, set <strong>Link to subject</strong> or match the
              <strong> Subject label</strong> to this course name, and add Drive or file URLs.
            </p>
          ) : (
            <div className="teaching-material-layout">
              <div>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
                  Materials
                </p>
                <div className="teaching-material-list">
                  {groupedInModal.map(({ type, label, items }) => (
                    <div key={type} style={{ marginBottom: 'var(--space-4)' }}>
                      <p style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>
                        {label}
                      </p>
                      {items.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`teaching-material-row${selectedMaterial?.id === m.id ? ' teaching-material-row--active' : ''}`}
                          onClick={() => setSelectedMaterial(m)}
                        >
                          <span style={{ fontWeight: 600, display: 'block' }}>{m.title}</span>
                          {m.academic_term && (
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{m.academic_term}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0 }}>
                {selectedMaterial?.description && (
                  <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.65, margin: 0 }}>
                    {selectedMaterial.description}
                  </p>
                )}
                <div className="teaching-preview-wrap">
                  {preview.kind === 'img' && (
                    <img src={preview.src} alt="" style={{ maxWidth: '100%', maxHeight: 'min(480px, 55vh)', objectFit: 'contain' }} />
                  )}
                  {preview.kind === 'iframe' && (
                    <iframe
                      title="Preview"
                      className="teaching-preview-frame"
                      src={preview.src}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  )}
                  {preview.kind === 'empty' && (
                    <div className="teaching-preview-placeholder">
                      {selectedMaterial
                        ? 'Inline preview is not available for this link. Use the buttons below to open or download in a new tab.'
                        : 'Select a material to preview.'}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  {dl && (
                    <a href={dl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      Download / open file
                    </a>
                  )}
                  {selectedMaterial?.external_url && selectedMaterial?.file_url && selectedMaterial.external_url !== selectedMaterial.file_url && (
                    <a href={selectedMaterial.external_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      Open view link
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  )
}

export default TeachingSection
