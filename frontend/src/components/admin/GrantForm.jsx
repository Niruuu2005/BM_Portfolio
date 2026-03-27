import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/** Matches `research_grants` in Supabase (no ref_no, role, duration_* ) */
const schema = z.object({
  title:          z.string().min(1, 'Title required'),
  funding_agency: z.string().optional().or(z.literal('')),
  amount: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().optional()
  ),
  status:      z.enum(['ongoing', 'completed']),
  start_date:  z.string().optional().or(z.literal('')),
  end_date:    z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  is_visible:  z.boolean().optional(),
})

const GrantForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { status: 'ongoing', is_visible: true },
  })

  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-control" />
        {errors.title && <span className="field-error">{errors.title.message}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Funding agency</label>
        <input {...register('funding_agency')} className="form-control" placeholder="e.g. UGC, DST" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount (INR)</label>
          <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select {...register('status')} className="form-control">
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start date</label>
          <input type="date" {...register('start_date')} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">End date</label>
          <input type="date" {...register('end_date')} className="form-control" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea {...register('description')} className="form-control" rows={3} />
      </div>
      <div className="form-checkbox">
        <input type="checkbox" id="grant-visible" {...register('is_visible')} />
        <label htmlFor="grant-visible">Visible on public site</label>
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Save grant'}
      </button>
    </form>
  )
}

export default GrantForm
