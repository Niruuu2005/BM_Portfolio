import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studyMaterialSchema } from '@/schemas'

const DriveHint = () => (
  <p className="form-hint text-muted" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
    Paste a Google Drive share link if you like; the public site can normalize view/download URLs.
  </p>
)

const StudyMaterialForm = ({ defaultValues, subjectOptions = [], onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(studyMaterialSchema),
    defaultValues: defaultValues || {
      material_type: 'notes',
      sort_order: 0,
      is_visible: true,
    },
  })

  const submit = (values) => {
    const v = { ...values }
    if (!v.subject_id) delete v.subject_id
    onSubmit(v)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-control" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Material type</label>
          <select {...register('material_type')} className="form-control">
            <optgroup label="Theory & notes">
              <option value="theory">Theory</option>
              <option value="notes">Notes</option>
              <option value="slides">Slides</option>
            </optgroup>
            <optgroup label="References & reading">
              <option value="reference">Reference / book / document</option>
              <option value="reading">Reading list</option>
              <option value="link">External link</option>
            </optgroup>
            <optgroup label="Work & practice">
              <option value="assignment">Assignment</option>
              <option value="lab">Lab</option>
            </optgroup>
            <optgroup label="Other">
              <option value="video">Video</option>
              <option value="code">Code</option>
              <option value="other">Other</option>
            </optgroup>
          </select>
          {errors.material_type && <p className="form-error">{errors.material_type.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Link to subject (optional)</label>
          <select {...register('subject_id')} className="form-control">
            <option value="">— None —</option>
            {subjectOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.subject_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Subject label (free text)</label>
        <input {...register('subject')} className="form-control" placeholder="e.g. Data Structures (shown on public site)" />
      </div>

      <div className="form-group">
        <label className="form-label">Academic term</label>
        <input {...register('academic_term')} className="form-control" placeholder="Semester I — 2024–25" />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea {...register('description')} className="form-control" rows={3} placeholder="Brief description…" />
      </div>

      <div className="form-group">
        <label className="form-label">File URL</label>
        <input {...register('file_url')} type="text" className="form-control" placeholder="https://… or Drive link" />
        <DriveHint />
      </div>

      <div className="form-group">
        <label className="form-label">External URL</label>
        <input {...register('external_url')} type="text" className="form-control" placeholder="View link, folder, playlist…" />
        <DriveHint />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Sort order</label>
          <input {...register('sort_order', { valueAsNumber: true })} type="number" className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Year</label>
          <input {...register('year', { valueAsNumber: true })} type="number" className="form-control" placeholder="2024" />
        </div>
        <div className="form-group form-check" style={{ alignSelf: 'end' }}>
          <input {...register('is_visible')} type="checkbox" id="sm_visible" className="form-check-input" />
          <label htmlFor="sm_visible" className="form-check-label">Visible to public</label>
        </div>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save material'}
      </button>
    </form>
  )
}

export default StudyMaterialForm
