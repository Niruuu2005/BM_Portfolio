import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { activitySchema } from '@/schemas'

const ACTIVITY_TYPES = [
  { value: 'fdp_attended',       label: 'FDP / Training Attended' },
  { value: 'workshop_organized', label: 'Workshop / Seminar Organized' },
  { value: 'guest_lecture',      label: 'Guest Lecture / Expert Talk' },
  { value: 'judge_mentor',       label: 'Judge / Mentor / Coordinator' },
  { value: 'reviewer',           label: 'Reviewer / Editor' },
]

const ActivityForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: defaultValues || { activity_type: 'fdp_attended', is_visible: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Activity Type *</label>
        <select {...register('activity_type')} className="form-control">
          {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        {errors.activity_type && <p className="form-error">{errors.activity_type.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-control" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Organizer / Institution</label>
        <input {...register('organizer')} className="form-control" />
      </div>

      <div className="form-group">
        <label className="form-label">Venue</label>
        <input {...register('venue')} className="form-control" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Year</label>
          <input {...register('year', { valueAsNumber: true })} type="number" className="form-control" />
          {errors.year && <p className="form-error">{errors.year.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Duration (days / hours)</label>
          <input {...register('duration')} className="form-control" placeholder="e.g. 5 days" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Role</label>
        <input {...register('role')} className="form-control" placeholder="e.g. Resource Person, Judge" />
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="act_visible" className="form-check-input" />
        <label htmlFor="act_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Activity'}
      </button>
    </form>
  )
}

export default ActivityForm
