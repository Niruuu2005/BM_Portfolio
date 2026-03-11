import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema } from '@/schemas'

const EducationForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: defaultValues || {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Degree *</label>
        <input {...register('degree')} className="form-control" placeholder="e.g. Ph.D." />
        {errors.degree && <p className="form-error">{errors.degree.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Field of Study *</label>
        <input {...register('field_of_study')} className="form-control" placeholder="e.g. Computer Science" />
        {errors.field_of_study && <p className="form-error">{errors.field_of_study.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Institution *</label>
        <input {...register('institution')} className="form-control" />
        {errors.institution && <p className="form-error">{errors.institution.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">University</label>
        <input {...register('university')} className="form-control" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Year *</label>
          <input {...register('start_year', { valueAsNumber: true })} type="number" className="form-control" />
          {errors.start_year && <p className="form-error">{errors.start_year.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">End Year</label>
          <input {...register('end_year', { valueAsNumber: true })} type="number" className="form-control" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Grade / CGPA</label>
        <input {...register('grade')} className="form-control" />
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Education'}
      </button>
    </form>
  )
}

export default EducationForm
