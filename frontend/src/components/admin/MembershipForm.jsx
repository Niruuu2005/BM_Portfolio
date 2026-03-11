import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { membershipSchema } from '@/schemas'

const MembershipForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(membershipSchema),
    defaultValues: defaultValues || { is_visible: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Organization *</label>
        <input {...register('organization')} className="form-control" placeholder="e.g. IEEE, ACM" />
        {errors.organization && <p className="form-error">{errors.organization.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Membership Type</label>
          <input {...register('membership_type')} className="form-control" placeholder="e.g. Senior Member" />
        </div>
        <div className="form-group">
          <label className="form-label">Membership ID</label>
          <input {...register('membership_id')} className="form-control" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Year Joined</label>
        <input {...register('year_joined', { valueAsNumber: true })} type="number" className="form-control" />
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="mem_visible" className="form-check-input" />
        <label htmlFor="mem_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Membership'}
      </button>
    </form>
  )
}

export default MembershipForm
