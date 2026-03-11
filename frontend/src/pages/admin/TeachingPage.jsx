import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SubjectForm from '@/components/admin/SubjectForm'

const TeachingPage = () => {
  const queryClient = useQueryClient()
  const [tab,       setTab]   = useState('subjects')
  const [modalOpen, setModal] = useState(false)
  const [editItem,  setEdit]  = useState(null)
  const [deleteId,  setDelId] = useState(null)

  const TABLE = tab === 'subjects' ? 'subjects_taught' : tab === 'materials' ? 'study_materials' : 'projects_guided'

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const upsert = useMutation({
    mutationFn: async (values) => {
      const { error } = editItem
        ? await supabase.from(TABLE).update(values).eq('id', editItem.id)
        : await supabase.from(TABLE).insert(values)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [TABLE] }); setModal(false); toast.success('Saved!') },
    onError: (err) => toast.error(err.message),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from(TABLE).delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [TABLE] }); setDelId(null); toast.success('Deleted!') },
    onError: (err) => toast.error(err.message),
  })

  const subjectCols  = [{ key: 'subject_name', header: 'Subject' }, { key: 'subject_code', header: 'Code' }, { key: 'level', header: 'Level' }]
  const materialCols = [{ key: 'title', header: 'Title' }, { key: 'subject', header: 'Subject' }, { key: 'year', header: 'Year' }]
  const projectCols  = [{ key: 'title', header: 'Title' }, { key: 'students', header: 'Students' }, { key: 'level', header: 'Level' }, { key: 'year', header: 'Year' }]

  const currentCols = tab === 'subjects' ? subjectCols : tab === 'materials' ? materialCols : projectCols

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Teaching</h1>
        <button className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button className={`tab-btn ${tab === 'subjects'  ? 'tab-btn--active' : ''}`} onClick={() => setTab('subjects')}>Subjects</button>
        <button className={`tab-btn ${tab === 'materials' ? 'tab-btn--active' : ''}`} onClick={() => setTab('materials')}>Materials</button>
        <button className={`tab-btn ${tab === 'projects'  ? 'tab-btn--active' : ''}`} onClick={() => setTab('projects')}>Projects</button>
      </div>

      <DataTable data={data} columns={currentCols} isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }} onDelete={(row) => setDelId(row.id)} />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit' : 'Add'}>
        {tab === 'subjects' && <SubjectForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />}
        {tab === 'materials' && (
          <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(Object.fromEntries(new FormData(e.target))) }} className="admin-form">
            <div className="form-group"><label className="form-label">Title</label><input name="title" defaultValue={editItem?.title} className="form-control" /></div>
            <div className="form-group"><label className="form-label">Subject</label><input name="subject" defaultValue={editItem?.subject} className="form-control" /></div>
            <div className="form-group"><label className="form-label">Year</label><input name="year" defaultValue={editItem?.year} type="number" className="form-control" /></div>
            <button type="submit" className="btn btn--primary" disabled={upsert.isPending} style={{ marginTop: 'var(--space-4)' }}>Save</button>
          </form>
        )}
        {tab === 'projects' && (
          <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(Object.fromEntries(new FormData(e.target))) }} className="admin-form">
            <div className="form-group"><label className="form-label">Title</label><input name="title" defaultValue={editItem?.title} className="form-control" /></div>
            <div className="form-group"><label className="form-label">Students</label><input name="students" defaultValue={editItem?.students} className="form-control" /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Level</label><select name="level" defaultValue={editItem?.level || 'UG'} className="form-control"><option value="UG">UG</option><option value="PG">PG</option></select></div>
              <div className="form-group"><label className="form-label">Year</label><input name="year" defaultValue={editItem?.year} type="number" className="form-control" /></div>
            </div>
            <button type="submit" className="btn btn--primary" disabled={upsert.isPending} style={{ marginTop: 'var(--space-4)' }}>Save</button>
          </form>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this entry?" />
    </div>
  )
}

export default TeachingPage
