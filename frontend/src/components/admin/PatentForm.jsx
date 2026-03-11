import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patentSchema } from '@/schemas'

const STATUS_OPTIONS = ['filed', 'published', 'granted']

const PatentForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(patentSchema),
    defaultValues: defaultValues || { status: 'filed', is_visible: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-control" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Inventors *</label>
        <input {...register('inventors')} className="form-control" placeholder="Name1, Name2, ..." />
        {errors.inventors && <p className="form-error">{errors.inventors.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Application Number</label>
          <input {...register('application_number')} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Patent Number</label>
          <input {...register('patent_number')} className="form-control" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Filing Date</label>
          <input {...register('filing_date')} type="date" className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Grant Date</label>
          <input {...register('grant_date')} type="date" className="form-control" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select {...register('status')} className="form-control">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Country</label>
          <input {...register('country')} className="form-control" placeholder="India" />
        </div>
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="pat_visible" className="form-check-input" />
        <label htmlFor="pat_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Patent'}
      </button>
    </form>
  )
}

export default PatentForm
