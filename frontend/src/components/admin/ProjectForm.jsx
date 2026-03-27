import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/** Matches `projects_guided` (UG/PG, students, technologies) */
const schema = z.object({
  title:        z.string().min(1, 'Title required'),
  students:     z.string().optional().or(z.literal('')),
  level:        z.enum(['UG', 'PG']),
  year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1900).max(2100).optional()
  ),
  description:  z.string().optional().or(z.literal('')),
  technologies: z.string().optional().or(z.literal('')),
  is_visible:   z.boolean().optional(),
})

const ProjectForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { level: 'UG', is_visible: true },
  })

  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">Project title *</label>
        <input {...register('title')} className="form-control" />
        {errors.title && <span className="field-error">{errors.title.message}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Level *</label>
          <select {...register('level')} className="form-control">
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Year</label>
          <input type="number" {...register('year', { valueAsNumber: true })} className="form-control" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Students</label>
        <input {...register('students')} className="form-control" placeholder="e.g. Alice, Bob" />
      </div>
      <div className="form-group">
        <label className="form-label">Technologies</label>
        <input {...register('technologies')} className="form-control" placeholder="e.g. React, Python (comma-separated)" />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea {...register('description')} className="form-control" rows={4} />
      </div>
      <div className="form-checkbox">
        <input type="checkbox" id="project-visible" {...register('is_visible')} />
        <label htmlFor="project-visible">Visible on public site</label>
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Save project'}
      </button>
    </form>
  )
}

export default ProjectForm
