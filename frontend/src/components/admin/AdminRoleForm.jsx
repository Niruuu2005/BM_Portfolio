import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  role:        z.string().min(1, 'Role required'),
  scope:       z.enum(['Institute','University','Department']).optional(),
  institution: z.string().optional(),
  year_from:   z.coerce.number().optional(),
  year_to:     z.coerce.number().optional(),
  description: z.string().optional(),
  is_visible:  z.boolean().default(true),
})

const AdminRoleForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  })
  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>Role / Position *</label>
        <input {...register('role')} placeholder="e.g. PG Coordinator" />
        {errors.role && <span className="field-error">{errors.role.message}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Scope</label>
          <select {...register('scope')}>
            <option value="">— Select —</option>
            <option value="Institute">Institute</option>
            <option value="University">University</option>
            <option value="Department">Department</option>
          </select>
        </div>
        <div className="form-group">
          <label>From Year</label>
          <input type="number" {...register('year_from')} />
        </div>
        <div className="form-group">
          <label>To Year (blank = current)</label>
          <input type="number" {...register('year_to')} />
        </div>
      </div>
      <div className="form-group">
        <label>Institution</label>
        <input {...register('institution')} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea {...register('description')} />
      </div>
      <div className="form-checkbox">
        <input type="checkbox" id="adminrole-visible" {...register('is_visible')} />
        <label htmlFor="adminrole-visible">Visible on public site</label>
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Save Role'}
      </button>
    </form>
  )
}
export default AdminRoleForm
