import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { experienceSchema } from '@/schemas'

const ExperienceForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues || { is_current: false },
  })
  const isCurrent = watch('is_current')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Role / Designation *</label>
        <input {...register('role')} className="form-control" placeholder="e.g. Associate Professor" />
        {errors.role && <p className="form-error">{errors.role.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Organization *</label>
        <input {...register('organization')} className="form-control" />
        {errors.organization && <p className="form-error">{errors.organization.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Department</label>
        <input {...register('department')} className="form-control" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date *</label>
          <input {...register('start_date')} type="date" className="form-control" />
          {errors.start_date && <p className="form-error">{errors.start_date.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input {...register('end_date')} type="date" className="form-control" disabled={isCurrent} />
        </div>
      </div>

      <div className="form-group form-check">
        <input {...register('is_current')} type="checkbox" id="exp_current" className="form-check-input" />
        <label htmlFor="exp_current" className="form-check-label">Currently working here</label>
      </div>

      <div className="form-group">
        <label className="form-label">Responsibilities (one per line)</label>
        <textarea {...register('responsibilities_text')} className="form-control" rows={4}
          placeholder="Responsibility 1&#10;Responsibility 2" />
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Experience'}
      </button>
    </form>
  )
}

export default ExperienceForm
