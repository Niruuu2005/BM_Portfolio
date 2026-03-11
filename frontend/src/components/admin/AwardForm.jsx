import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { awardSchema } from '@/schemas'

const AwardForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(awardSchema),
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
        <label className="form-label">Awarding Body</label>
        <input {...register('awarding_body')} className="form-control" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Year</label>
          <input {...register('year', { valueAsNumber: true })} type="number" className="form-control" />
          {errors.year && <p className="form-error">{errors.year.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Award Type</label>
          <input {...register('award_type')} className="form-control" placeholder="e.g. Best Paper, Excellence" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea {...register('description')} className="form-control" rows={3} />
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="aw_visible" className="form-check-input" />
        <label htmlFor="aw_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Award'}
      </button>
    </form>
  )
}

export default AwardForm
