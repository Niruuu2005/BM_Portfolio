import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { publicationSchema } from '@/schemas'

const PUB_TYPES = ['journal', 'conference', 'book_chapter', 'book']

const PublicationForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(publicationSchema),
    defaultValues: defaultValues || { pub_type: 'journal', is_visible: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label className="form-label">Publication Type *</label>
        <select {...register('pub_type')} className="form-control">
          {PUB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.pub_type && <p className="form-error">{errors.pub_type.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-control" placeholder="Publication title" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Authors *</label>
        <input {...register('authors')} className="form-control" placeholder="Author1, Author2, ..." />
        {errors.authors && <p className="form-error">{errors.authors.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Journal / Conference Name</label>
          <input {...register('journal_name')} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Year</label>
          <input {...register('year', { valueAsNumber: true })} type="number" className="form-control" />
          {errors.year && <p className="form-error">{errors.year.message}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Volume</label>
          <input {...register('volume')} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Issue</label>
          <input {...register('issue')} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Pages</label>
          <input {...register('pages')} className="form-control" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">DOI</label>
          <input {...register('doi')} className="form-control" placeholder="10.xxxx/xxxx" />
        </div>
        <div className="form-group">
          <label className="form-label">Impact Factor</label>
          <input {...register('impact_factor', { valueAsNumber: true })} type="number" step="0.001" className="form-control" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">URL</label>
        <input {...register('url')} className="form-control" placeholder="https://..." />
      </div>

      <div className="form-group">
        <label className="form-label">Publisher</label>
        <input {...register('publisher')} className="form-control" />
      </div>

      <div className="form-group">
        <label className="form-label">Indexing</label>
        <input {...register('indexing')} className="form-control" placeholder="SCI, Scopus, ..." />
      </div>

      <div className="form-group form-check">
        <input {...register('is_visible')} type="checkbox" id="pub_visible" className="form-check-input" />
        <label htmlFor="pub_visible" className="form-check-label">Visible on public site</label>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading} style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? 'Saving…' : 'Save Publication'}
      </button>
    </form>
  )
}

export default PublicationForm
