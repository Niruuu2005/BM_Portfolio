import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SubjectForm from '@/components/admin/SubjectForm'

const TeachingPage = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()
  const [tab, setTab] = useState('subjects')
  const [modalOpen, setModal] = useState(false)
  const [editItem, setEdit] = useState(null)
  const [deleteId, setDelId] = useState(null)

  const TABLE = tab === 'subjects' ? 'subjects_taught' : tab === 'materials' ? 'study_materials' : 'projects_guided'

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE],
    enabled: !!accessToken,
    queryFn: async () => apiAdmin(`/api/admin/data/${TABLE}`, { token: accessToken }),
  })

  const { data: subjectOptions = [] } = useQuery({
    queryKey: ['subjects_taught', 'options'],
    enabled: !!accessToken && tab === 'materials',
    queryFn: async () => apiAdmin('/api/admin/subjects_taught/options', { token: accessToken }),
  })

  const upsert = useMutation({
    mutationFn: async (values) => {
      if (editItem) {
        await apiAdmin(`/api/admin/data/${TABLE}/${editItem.id}`, {
          token: accessToken,
          method: 'PUT',
          body: values,
        })
      } else {
        await apiAdmin(`/api/admin/data/${TABLE}`, { token: accessToken, method: 'POST', body: values })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE] })
      if (TABLE === 'subjects_taught') {
        queryClient.invalidateQueries({ queryKey: ['subjects_taught', 'options'] })
      }
      setModal(false)
      toast.success('Saved!')
    },
    onError: (err) => toast.error(err.message),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      await apiAdmin(`/api/admin/data/${TABLE}/${id}`, { token: accessToken, method: 'DELETE' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE] })
      if (TABLE === 'subjects_taught') {
        queryClient.invalidateQueries({ queryKey: ['subjects_taught', 'options'] })
      }
      setDelId(null)
      toast.success('Deleted!')
    },
    onError: (err) => toast.error(err.message),
  })

  const toggleVis = useMutation({
    mutationFn: async ({ id, is_visible }) => {
      await apiAdmin(`/api/admin/data/${TABLE}/${id}/visibility`, {
        token: accessToken,
        method: 'PATCH',
        body: { is_visible: !is_visible },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE] })
      toast.success('Visibility updated!')
    },
    onError: (err) => toast.error(err.message),
  })

  const subjectCols = [
    { key: 'subject_name', header: 'Subject' },
    { key: 'subject_code', header: 'Code' },
    { key: 'level', header: 'Level' },
  ]
  const materialCols = [
    { key: 'title', header: 'Title' },
    { key: 'material_type', header: 'Type' },
    { key: 'subject', header: 'Subject' },
    { key: 'academic_term', header: 'Term' },
    { key: 'year', header: 'Year' },
  ]
  const projectCols = [
    { key: 'title', header: 'Title' },
    { key: 'students', header: 'Students' },
    { key: 'level', header: 'Level' },
    { key: 'year', header: 'Year' },
    { key: 'description', header: 'Description' },
  ]

  const currentCols = tab === 'subjects' ? subjectCols : tab === 'materials' ? materialCols : projectCols

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const vals = Object.fromEntries(fd)
    vals.is_visible = fd.get('is_visible') === 'on'
    Object.keys(vals).forEach((k) => {
      if (vals[k] === '') delete vals[k]
    })
    if (vals.year != null && vals.year !== '') vals.year = Number(vals.year)
    if (vals.sort_order != null && vals.sort_order !== '') vals.sort_order = Number(vals.sort_order)
    if (tab === 'materials' && !fd.get('subject_id')) delete vals.subject_id
    upsert.mutate(vals)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Teaching</h1>
        <button type="button" className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button type="button" className={`tab-btn ${tab === 'subjects' ? 'tab-btn--active' : ''}`} onClick={() => setTab('subjects')}>Subjects</button>
        <button type="button" className={`tab-btn ${tab === 'materials' ? 'tab-btn--active' : ''}`} onClick={() => setTab('materials')}>Study Materials</button>
        <button type="button" className={`tab-btn ${tab === 'projects' ? 'tab-btn--active' : ''}`} onClick={() => setTab('projects')}>Projects Guided</button>
      </div>

      <DataTable
        data={data}
        columns={currentCols}
        isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }}
        onDelete={(id) => setDelId(id)}
        onToggleVisibility={(id, is_visible) => toggleVis.mutate({ id, is_visible })}
      />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit' : 'Add'}>
        {tab === 'subjects' && (
          <SubjectForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
        )}

        {tab === 'materials' && (
          <form onSubmit={handleFormSubmit} className="admin-form">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input name="title" required defaultValue={editItem?.title} className="form-control" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Material type</label>
                <select name="material_type" className="form-control" defaultValue={editItem?.material_type || 'notes'}>
                  <optgroup label="Theory & notes">
                    <option value="theory">Theory</option>
                    <option value="notes">Notes</option>
                    <option value="slides">Slides</option>
                  </optgroup>
                  <optgroup label="References & reading">
                    <option value="reference">Reference / book / document</option>
                    <option value="reading">Reading list</option>
                    <option value="link">External link</option>
                  </optgroup>
                  <optgroup label="Work & practice">
                    <option value="assignment">Assignment</option>
                    <option value="lab">Lab</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="video">Video</option>
                    <option value="code">Code</option>
                    <option value="other">Other</option>
                  </optgroup>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Link to subject (optional)</label>
                <select name="subject_id" className="form-control" defaultValue={editItem?.subject_id || ''}>
                  <option value="">— None —</option>
                  {subjectOptions.map((s) => (
                    <option key={s.id} value={s.id}>{s.subject_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject label (free text)</label>
              <input name="subject" defaultValue={editItem?.subject} className="form-control" placeholder="e.g. Data Structures (shown on public site)" />
            </div>

            <div className="form-group">
              <label className="form-label">Academic term</label>
              <input name="academic_term" defaultValue={editItem?.academic_term} className="form-control" placeholder="Semester I — 2024–25" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" defaultValue={editItem?.description} className="form-control" rows={3} placeholder="Brief description of this resource…" />
            </div>

            <div className="form-group">
              <label className="form-label">File URL</label>
              <input name="file_url" type="url" defaultValue={editItem?.file_url} className="form-control" placeholder="https://…/resource.pdf" />
            </div>

            <div className="form-group">
              <label className="form-label">External URL</label>
              <input name="external_url" type="url" defaultValue={editItem?.external_url} className="form-control" placeholder="https://… (slides, playlist, repo)" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sort order</label>
                <input name="sort_order" type="number" defaultValue={editItem?.sort_order ?? 0} className="form-control" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input name="year" type="number" defaultValue={editItem?.year} className="form-control" placeholder="2024" />
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end', alignSelf: 'end' }}>
                <div className="form-checkbox">
                  <input
                    name="is_visible"
                    type="checkbox"
                    id="mat-visible"
                    defaultChecked={editItem ? editItem.is_visible : true}
                  />
                  <label htmlFor="mat-visible">Visible to public</label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn--primary" disabled={upsert.isPending} style={{ marginTop: 'var(--space-4)' }}>
              {upsert.isPending ? 'Saving…' : 'Save Material'}
            </button>
          </form>
        )}

        {tab === 'projects' && (
          <form onSubmit={handleFormSubmit} className="admin-form">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input name="title" required defaultValue={editItem?.title} className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Students</label>
              <input name="students" defaultValue={editItem?.students} className="form-control" placeholder="e.g. Alice, Bob, Charlie" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" defaultValue={editItem?.description} className="form-control" rows={3} placeholder="Brief project summary…" />
            </div>

            <div className="form-group">
              <label className="form-label">Technologies</label>
              <input name="technologies" defaultValue={editItem?.technologies} className="form-control" placeholder="React, Node.js, MongoDB (comma-separated)" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Level</label>
                <select name="level" defaultValue={editItem?.level || 'UG'} className="form-control">
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input name="year" type="number" defaultValue={editItem?.year} className="form-control" placeholder="2024" />
              </div>
            </div>

            <div className="form-checkbox">
              <input
                name="is_visible"
                type="checkbox"
                id="proj-visible"
                defaultChecked={editItem ? editItem.is_visible : true}
              />
              <label htmlFor="proj-visible">Visible to public</label>
            </div>

            <button type="submit" className="btn btn--primary" disabled={upsert.isPending} style={{ marginTop: 'var(--space-4)' }}>
              {upsert.isPending ? 'Saving…' : 'Save Project'}
            </button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDelId(null)}
        onConfirm={() => remove.mutate(deleteId)}
        message="Delete this entry?"
      />
    </div>
  )
}

export default TeachingPage
