import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { copyrightSchema } from '@/schemas'

const CopyrightForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(copyrightSchema),
    defaultValues: defaultValues || { is_visible: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-control" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Authors *</label>
        <input {...register('authors')} className="form-control" placeholder="Author1, Author2, ..." />
        {errors.authors && <p className="form-error">{errors.authors.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Registration Number</label>
          <input {...register('registration_number')} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Registration Date</label>
          <input {...register('registration_date')} type="date" className="form-control" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Work Type</label>
        <input {...register('work_type')} className="form-control" placeholder="e.g. Software, Literary Work" />
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="cr_visible" className="form-check-input" />
        <label htmlFor="cr_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Copyright'}
      </button>
    </form>
  )
}

export default CopyrightForm
