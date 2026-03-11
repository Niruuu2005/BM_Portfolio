# Module — Admin Content Management (CMS)

> **Module Goal:** Build full CRUD admin interfaces for every content section. All admin pages share a common pattern: a data table listing records, a modal form for add/edit, a delete confirmation dialog, and a visibility toggle per row.

---

## 5.1 Folder Structure

```
src/pages/admin/
├── DashboardPage.jsx       ← Statistics overview
├── ProfilePage.jsx         ← Profile, photo and CV upload
├── EducationPage.jsx
├── ExperiencePage.jsx
├── PublicationsPage.jsx
├── PatentsPage.jsx
├── TeachingPage.jsx
└── ActivitiesPage.jsx
```

---

## 5.2 Generic `DataTable` Component

```jsx
// src/components/shared/DataTable.jsx
import { useState } from 'react'

const DataTable = ({ columns, data = [], onEdit, onDelete, onToggleVisibility }) => {
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const PER_PAGE = 10

  const filtered  = data.filter((row) =>
    columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="data-table-wrapper">
      {/* Search */}
      <div className="table-toolbar">
        <input className="table-search" placeholder="Search..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        <span className="table-count">{filtered.length} record(s)</span>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => <th key={col.key}>{col.label}</th>)}
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length + 2} className="table-empty">No records found.</td></tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  <td>
                    <button
                      className={`visibility-btn ${row.is_visible ? 'visible' : 'hidden'}`}
                      onClick={() => onToggleVisibility?.(row.id, row.is_visible)}
                    >
                      {row.is_visible ? '👁 Visible' : '🚫 Hidden'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon btn-edit" onClick={() => onEdit?.(row)}>✏️</button>
                      <button className="btn-icon btn-delete" onClick={() => onDelete?.(row.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  )
}

export default DataTable
```

### CSS
```css
.data-table-wrapper { display: flex; flex-direction: column; gap: var(--space-4); }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
.table-search { padding: var(--space-2) var(--space-4); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font-size: var(--font-size-sm); width: 300px; }
.table-search:focus { outline: none; border-color: var(--color-accent); }
.table-count { color: var(--color-text-muted); font-size: var(--font-size-sm); }
.table-scroll { overflow-x: auto; border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.data-table th { padding: var(--space-3) var(--space-4); background: var(--color-surface); text-align: left; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; font-size: var(--font-size-xs); letter-spacing: 0.08em; border-bottom: 1px solid var(--color-border); white-space: nowrap; }
.data-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.03); }
.table-empty { text-align: center; padding: var(--space-12); color: var(--color-text-muted); }
.visibility-btn { padding: 3px 10px; border-radius: var(--radius-full); border: none; font-size: var(--font-size-xs); font-weight: 600; cursor: pointer; }
.visibility-btn.visible { background: rgba(16,185,129,0.15); color: var(--color-success); }
.visibility-btn.hidden  { background: rgba(239,68,68,0.12);  color: var(--color-danger); }
.action-btns { display: flex; gap: var(--space-2); }
.btn-icon { background: none; border: none; cursor: pointer; padding: 4px; border-radius: var(--radius-sm); font-size: 1rem; }
.btn-edit:hover   { background: rgba(59,130,246,0.15); }
.btn-delete:hover { background: rgba(239,68,68,0.15); }
.pagination { display: flex; align-items: center; justify-content: center; gap: var(--space-4); }
.pagination button { padding: var(--space-2) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); cursor: pointer; }
.pagination button:hover:not(:disabled) { border-color: var(--color-accent); color: var(--color-accent); }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination span { color: var(--color-text-muted); font-size: var(--font-size-sm); }
```

---

## 5.3 Generic `Modal` Component

```jsx
// src/components/shared/Modal.jsx
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
          <motion.div className="modal-content" initial={{ scale:0.92, y:20, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }} exit={{ scale:0.92, y:20, opacity:0 }} transition={{ duration:0.2 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{title}</h2>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
```

```css
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: var(--space-4); }
.modal-content { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-6) var(--space-6) var(--space-4); border-bottom: 1px solid var(--color-border); }
.modal-header h2 { font-family: var(--font-heading); font-size: var(--font-size-xl); }
.modal-close { background: none; border: none; color: var(--color-text-muted); font-size: 1.25rem; cursor: pointer; padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); }
.modal-close:hover { color: var(--color-text); }
.modal-body { padding: var(--space-6); }
```

---

## 5.4 `ConfirmDialog` Component

```jsx
// src/components/shared/ConfirmDialog.jsx
import Modal from './Modal'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Delete'}>
    <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
      {message || 'Are you sure? This cannot be undone.'}
    </p>
    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
      <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      <button className="btn btn-danger" onClick={onConfirm} style={{ background: 'var(--color-danger)', color: '#fff', border: 'none', padding: 'var(--space-2) var(--space-6)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
    </div>
  </Modal>
)

export default ConfirmDialog
```

---

## 5.5 Publications Admin Page — Full CRUD (Template for All Pages)

```jsx
// src/pages/admin/PublicationsPage.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/layout/AdminLayout'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PublicationForm from '@/components/admin/PublicationForm'
import toast from 'react-hot-toast'

const TABS = [
  { label: 'Journal',      value: 'journal' },
  { label: 'Conference',   value: 'conference' },
  { label: 'Book Chapter', value: 'book_chapter' },
  { label: 'Book',         value: 'book' },
]

const COLUMNS = [
  { key: 'year',     label: 'Year',     render: (v) => <strong>{v}</strong> },
  { key: 'title',    label: 'Title' },
  { key: 'authors',  label: 'Authors' },
  { key: 'venue',    label: 'Journal / Conference' },
  { key: 'indexing', label: 'Indexing' },
]

const PublicationsPage = () => {
  const qc = useQueryClient()
  const [tab, setTab]         = useState('journal')
  const [modalOpen, setModal] = useState(false)
  const [editItem, setEdit]   = useState(null)
  const [deleteId, setDelId]  = useState(null)

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['admin-pubs', tab],
    queryFn: async () => {
      const { data } = await supabase.from('publications').select('*').eq('type', tab).order('year', { ascending: false })
      return data
    }
  })

  const upsert = useMutation({
    mutationFn: async (v) => {
      if (editItem) {
        const { error } = await supabase.from('publications').update(v).eq('id', editItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('publications').insert({ ...v, type: tab })
        if (error) throw error
      }
    },
    onSuccess: () => { toast.success(editItem ? 'Updated.' : 'Added.'); qc.invalidateQueries(['admin-pubs']); setModal(false); setEdit(null) },
    onError: () => toast.error('Failed. Try again.')
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('publications').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { toast.success('Deleted.'); qc.invalidateQueries(['admin-pubs']); setDelId(null) }
  })

  const toggleVis = useMutation({
    mutationFn: async ({ id, current }) => {
      const { error } = await supabase.from('publications').update({ is_visible: !current }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries(['admin-pubs'])
  })

  return (
    <AdminLayout title="Manage Publications">
      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {TABS.map((t) => (
          <button key={t.value} className={`tab-btn ${tab === t.value ? 'tab-btn--active' : ''}`} onClick={() => setTab(t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add Publication</button>
      </div>

      {isLoading ? <p className="text-muted">Loading...</p> : (
        <DataTable columns={COLUMNS} data={publications}
          onEdit={(row) => { setEdit(row); setModal(true) }}
          onDelete={(id) => setDelId(id)}
          onToggleVisibility={(id, cur) => toggleVis.mutate({ id, current: cur })}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModal(false); setEdit(null) }}
        title={editItem ? 'Edit Publication' : 'Add Publication'}>
        <PublicationForm defaultValues={editItem} onSubmit={(v) => upsert.mutate(v)} loading={upsert.isPending} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)}
        onConfirm={() => remove.mutate(deleteId)} title="Delete Publication"
        message="This will permanently delete this publication." />
    </AdminLayout>
  )
}

export default PublicationsPage
```

> **Repeat the same pattern** for `EducationPage`, `ExperiencePage`, `PatentsPage`, `TeachingPage`, and `ActivitiesPage` — only the `COLUMNS`, `TABS`, form component, and table name change.

---

## 5.6 Dashboard Stats Page

```jsx
// src/pages/admin/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/layout/AdminLayout'

const STATS = [
  { label: 'Publications', table: 'publications', icon: '📖', color: '#3B82F6' },
  { label: 'Patents',      table: 'patents',      icon: '💡', color: '#10B981' },
  { label: 'Copyrights',   table: 'copyrights',   icon: '©️',  color: '#F59E0B' },
  { label: 'Activities',   table: 'activities',   icon: '🛠️',  color: '#8B5CF6' },
  { label: 'Projects',     table: 'projects_guided', icon: '🎓', color: '#EC4899' },
]

const DashboardPage = () => {
  const { data: counts = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const results = await Promise.all(
        STATS.map((s) => supabase.from(s.table).select('id', { count: 'exact', head: true }))
      )
      return Object.fromEntries(STATS.map((s, i) => [s.table, results[i].count]))
    }
  })

  return (
    <AdminLayout title="Dashboard">
      <div className="stats-grid">
        {STATS.map((s) => (
          <div key={s.table} className="stats-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '2rem', color: s.color }}>{s.icon}</div>
            <div className="stats-number">{counts[s.table] ?? '—'}</div>
            <div className="stats-label">{s.label}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default DashboardPage
```

```css
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--space-6); }
.stats-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); text-align: center; }
.stats-number { font-family: var(--font-heading); font-size: var(--font-size-4xl); font-weight: 700; }
.stats-label { color: var(--color-text-muted); font-size: var(--font-size-sm); margin-top: var(--space-2); }
```

---

## 5.7 FileUpload Component

```jsx
// src/components/shared/FileUpload.jsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const FileUpload = ({ bucket, filePath, onUploaded, accept = '.pdf,.jpg,.png' }) => {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = filePath || `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    toast.success('Uploaded!')
    onUploaded?.(data.publicUrl)
    setUploading(false)
  }

  return (
    <label className="file-upload-label">
      <input type="file" accept={accept} onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
      <span className="btn btn-outline">{uploading ? 'Uploading...' : '📎 Choose File'}</span>
    </label>
  )
}

export default FileUpload
```

---

## 5.8 Common Button Styles

```css
/* Add to global.css */
.btn { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-6); border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: 600; cursor: pointer; border: 2px solid transparent; transition: all var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-accent); color: #fff; border-color: var(--color-accent); }
.btn-primary:hover { background: var(--color-accent-hover); border-color: var(--color-accent-hover); text-decoration: none; }
.btn-outline { background: transparent; color: var(--color-text); border-color: var(--color-border); }
.btn-outline:hover { border-color: var(--color-accent); color: var(--color-accent); text-decoration: none; }
.btn-full { width: 100%; justify-content: center; }
.tab-btn { padding: var(--space-2) var(--space-4); background: transparent; border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-muted); font-size: var(--font-size-sm); cursor: pointer; transition: all var(--transition-fast); }
.tab-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.tab-btn--active { background: var(--color-accent); border-color: var(--color-accent); color: #fff; }
.tabs { display: flex; gap: var(--space-2); flex-wrap: wrap; }
```

---

## 5.9 Module Completion Checklist

```
[ ] DataTable.jsx — search, pagination, visibility toggle, actions
[ ] Modal.jsx — animated (framer-motion), ESC close, scroll lock
[ ] ConfirmDialog.jsx — wraps Modal for delete confirmations
[ ] FileUpload.jsx — Supabase Storage upload
[ ] DashboardPage — stat cards with table row counts
[ ] ProfilePage   — form + photo upload + CV upload
[ ] EducationPage  — CRUD with sort_order support
[ ] ExperiencePage — CRUD with is_current flag
[ ] PublicationsPage — tab per type, full CRUD
[ ] PatentsPage   — patents + copyrights in tabs
[ ] TeachingPage  — subjects taught + study materials + project uploads
[ ] ActivitiesPage — all activity types in tabs (fdp, workshop, lecture, reviewer)
[ ] All pages use AdminLayout wrapper for sidebar
[ ] All mutations invalidate correct React Query keys
[ ] All errors and successes shown as toasts
```

---

*Frontend Module — Admin CMS | v1.0 — March 2026*
