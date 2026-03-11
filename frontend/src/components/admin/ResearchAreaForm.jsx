import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { researchAreaSchema } from '@/schemas'

const ResearchAreaForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(researchAreaSchema),
    defaultValues: defaultValues || { is_visible: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Name *</label>
        <input {...register('name')} className="form-control" placeholder="e.g. Machine Learning" />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Icon (emoji)</label>
        <input {...register('icon')} className="form-control" placeholder="🤖" />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea {...register('description')} className="form-control" rows={3} />
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="ra_visible" className="form-check-input" />
        <label htmlFor="ra_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Research Area'}
      </button>
    </form>
  )
}

export default ResearchAreaForm
