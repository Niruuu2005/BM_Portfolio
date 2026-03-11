# Module — Forms & Validation

> **Module Goal:** Implement all admin forms using React Hook Form + Zod schema validation. Forms are used inside `Modal` components and handle both add and edit scenarios. Each form corresponds to one database table.

---

## 6.1 Philosophy

| Concern | Solution |
|---------|---------|
| Form state | React Hook Form (`useForm`) |
| Validation | Zod schemas |
| Bridge | `@hookform/resolvers/zod` |
| Error display | Inline under each field |
| Submit | `onSubmit` prop forwarded to parent mutation |
| Default values | `defaultValues` prop (populated for edit mode) |

---

## 6.2 Zod Schemas

```javascript
// src/schemas/publicationSchema.js
import { z } from 'zod'

export const publicationSchema = z.object({
  title:     z.string().min(5,  'Title must be at least 5 characters'),
  authors:   z.string().min(3,  'Authors are required'),
  venue:     z.string().optional(),
  volume:    z.string().optional(),
  issue:     z.string().optional(),
  pages:     z.string().optional(),
  year:      z.coerce.number().int().min(1900).max(2100),
  doi:       z.string().optional(),
  url:       z.string().url('Must be a valid URL').optional().or(z.literal('')),
  publisher: z.string().optional(),
  indexing:  z.enum(['SCI', 'Scopus', 'UGC', 'Others', '']).optional(),
  isbn_issn: z.string().optional(),
})
```

```javascript
// src/schemas/educationSchema.js
import { z } from 'zod'

export const educationSchema = z.object({
  degree:           z.string().min(2, 'Degree is required'),
  specialization:   z.string().optional(),
  institution:      z.string().optional(),
  university:       z.string().optional(),
  year:             z.coerce.number().int().min(1950).max(2100),
  score:            z.string().optional(),
  rank_distinction: z.string().optional(),
  thesis_title:     z.string().optional(),
  sort_order:       z.coerce.number().int().default(0),
})
```

```javascript
// src/schemas/patentSchema.js
import { z } from 'zod'

export const patentSchema = z.object({
  title:          z.string().min(5, 'Title is required'),
  inventors:      z.string().min(2, 'Inventors are required'),
  application_no: z.string().optional(),
  year:           z.coerce.number().int().min(1990).max(2100),
  country:        z.string().default('India'),
  status:         z.enum(['filed', 'published', 'exam', 'granted']),
  description:    z.string().optional(),
})
```

```javascript
// src/schemas/activitySchema.js
import { z } from 'zod'

export const activitySchema = z.object({
  title:       z.string().min(3, 'Title is required'),
  organizer:   z.string().optional(),
  venue:       z.string().optional(),
  institution: z.string().optional(),
  year:        z.coerce.number().int().min(1990).max(2100),
  duration:    z.string().optional(),
  mode:        z.enum(['Online', 'Offline', 'Hybrid', '']).optional(),
  role:        z.string().optional(),
  description: z.string().optional(),
})
```

```javascript
// src/schemas/experienceSchema.js
import { z } from 'zod'

export const experienceSchema = z.object({
  designation:  z.string().min(2, 'Designation is required'),
  department:   z.string().optional(),
  institution:  z.string().min(2, 'Institution is required'),
  type:         z.enum(['academic', 'industry', 'research']),
  start_date:   z.string().optional(),
  end_date:     z.string().optional(),
  is_current:   z.boolean().default(false),
  sort_order:   z.coerce.number().int().default(0),
})
```

---

## 6.3 Publication Form Component

```jsx
// src/components/admin/PublicationForm.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { publicationSchema } from '@/schemas/publicationSchema'

const PublicationForm = ({ defaultValues, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(publicationSchema),
    defaultValues: defaultValues || {
      title: '', authors: '', venue: '', volume: '', issue: '',
      pages: '', year: new Date().getFullYear(), doi: '',
      url: '', publisher: '', indexing: '', isbn_issn: '',
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">

      <div className="form-group">
        <label>Title *</label>
        <input {...register('title')} placeholder="Paper title" />
        {errors.title && <span className="field-error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label>Authors *</label>
        <input {...register('authors')} placeholder="Author A, Author B, Author C" />
        {errors.authors && <span className="field-error">{errors.authors.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Journal / Conference</label>
          <input {...register('venue')} placeholder="Journal of XYZ" />
        </div>
        <div className="form-group">
          <label>Year *</label>
          <input type="number" {...register('year')} />
          {errors.year && <span className="field-error">{errors.year.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Volume</label>
          <input {...register('volume')} placeholder="Vol. 12" />
        </div>
        <div className="form-group">
          <label>Issue</label>
          <input {...register('issue')} placeholder="Issue 3" />
        </div>
        <div className="form-group">
          <label>Pages</label>
          <input {...register('pages')} placeholder="pp. 45-58" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>DOI</label>
          <input {...register('doi')} placeholder="10.1000/xyz123" />
        </div>
        <div className="form-group">
          <label>Indexing</label>
          <select {...register('indexing')}>
            <option value="">Select...</option>
            <option value="SCI">SCI</option>
            <option value="Scopus">Scopus</option>
            <option value="UGC">UGC</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Publisher</label>
        <input {...register('publisher')} placeholder="Elsevier / Springer / IEEE" />
      </div>

      <div className="form-group">
        <label>ISBN / ISSN</label>
        <input {...register('isbn_issn')} />
      </div>

      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Saving...' : defaultValues ? '✔ Update' : '+ Add Publication'}
      </button>
    </form>
  )
}

export default PublicationForm
```

---

## 6.4 Education Form Component

```jsx
// src/components/admin/EducationForm.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema } from '@/schemas/educationSchema'

const EducationForm = ({ defaultValues, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: defaultValues || { degree: '', specialization: '', institution: '', university: '', year: new Date().getFullYear(), score: '', rank_distinction: '', thesis_title: '', sort_order: 0 }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-row">
        <div className="form-group">
          <label>Degree *</label>
          <input {...register('degree')} placeholder="Ph.D. / M.E. / B.E." />
          {errors.degree && <span className="field-error">{errors.degree.message}</span>}
        </div>
        <div className="form-group">
          <label>Year *</label>
          <input type="number" {...register('year')} />
          {errors.year && <span className="field-error">{errors.year.message}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>Specialization</label>
        <input {...register('specialization')} placeholder="Computer Engineering" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Institution</label>
          <input {...register('institution')} placeholder="PCCOE, Pune" />
        </div>
        <div className="form-group">
          <label>University</label>
          <input {...register('university')} placeholder="SPPU" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Score / CGPA</label>
          <input {...register('score')} placeholder="9.1 CGPA or 87.5%" />
        </div>
        <div className="form-group">
          <label>Rank / Distinction</label>
          <input {...register('rank_distinction')} placeholder="1st Rank in University" />
        </div>
      </div>
      <div className="form-group">
        <label>Thesis / Project Title</label>
        <input {...register('thesis_title')} placeholder="For Ph.D. / M.E. only" />
      </div>
      <div className="form-group">
        <label>Sort Order (display position)</label>
        <input type="number" {...register('sort_order')} />
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Saving...' : defaultValues ? '✔ Update' : '+ Add Education'}
      </button>
    </form>
  )
}

export default EducationForm
```

---

## 6.5 Activity Form Component

```jsx
// src/components/admin/ActivityForm.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { activitySchema } from '@/schemas/activitySchema'

const ActivityForm = ({ defaultValues, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: defaultValues || { title: '', organizer: '', venue: '', institution: '', year: new Date().getFullYear(), duration: '', mode: '', role: '', description: '' }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="form-group">
        <label>Title *</label>
        <input {...register('title')} placeholder="e.g., National FDP on AI & ML" />
        {errors.title && <span className="field-error">{errors.title.message}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Organizer</label>
          <input {...register('organizer')} />
        </div>
        <div className="form-group">
          <label>Year *</label>
          <input type="number" {...register('year')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Venue / Institution</label>
          <input {...register('venue')} />
        </div>
        <div className="form-group">
          <label>Duration</label>
          <input {...register('duration')} placeholder="5 Days" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Mode</label>
          <select {...register('mode')}>
            <option value="">Select</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div className="form-group">
          <label>Your Role</label>
          <input {...register('role')} placeholder="Participant / Organizer / Resource Person" />
        </div>
      </div>
      <div className="form-group">
        <label>Description (optional)</label>
        <textarea {...register('description')} rows={3} />
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Saving...' : defaultValues ? '✔ Update' : '+ Add Activity'}
      </button>
    </form>
  )
}

export default ActivityForm
```

---

## 6.6 Form CSS (Shared Styles)

```css
/* Add to global.css */
.admin-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-family: var(--font-body);
  transition: border-color var(--transition-fast);
  width: 100%;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.form-group select option { background: var(--color-surface); }

.field-error {
  color: var(--color-danger);
  font-size: var(--font-size-xs);
  margin-top: 2px;
}
```

---

## 6.7 Forms Completion Checklist

```
[ ] publicationSchema.js — all 11 fields with validation
[ ] educationSchema.js — degree, university, year, score, rank
[ ] patentSchema.js — title, inventors, app no, status, country
[ ] activitySchema.js — title, organizer, year, mode, role
[ ] experienceSchema.js — designation, institution, type, is_current
[ ] PatentForm.jsx — uses patentSchema
[ ] ExperienceForm.jsx — uses experienceSchema, is_current checkbox
[ ] PublicationForm.jsx — all publication fields + indexing select
[ ] EducationForm.jsx — all education fields + sort_order
[ ] ActivityForm.jsx — all activity fields + mode select
[ ] All forms handle edit mode via defaultValues
[ ] All validation errors displayed inline under each field
[ ] Form CSS in global.css — .admin-form, .form-row, .form-group, .field-error
```

---

*Frontend Module — Forms & Validation | v1.0 — March 2026*
