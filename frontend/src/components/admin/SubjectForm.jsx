import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subjectSchema } from '@/schemas'

const SubjectForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: defaultValues || { level: 'UG', is_visible: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Subject Name *</label>
        <input {...register('subject_name')} className="form-control" />
        {errors.subject_name && <p className="form-error">{errors.subject_name.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Subject Code</label>
          <input {...register('subject_code')} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Level</label>
          <select {...register('level')} className="form-control">
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
          </select>
        </div>
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="sub_visible" className="form-check-input" />
        <label htmlFor="sub_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Subject'}
      </button>
    </form>
  )
}

export default SubjectForm
