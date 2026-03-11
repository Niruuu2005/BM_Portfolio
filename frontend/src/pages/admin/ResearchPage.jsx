import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ResearchAreaForm from '@/components/admin/ResearchAreaForm'
import AwardForm from '@/components/admin/AwardForm'

const ResearchPage = () => {
  const queryClient = useQueryClient()
  const [tab,       setTab]   = useState('areas')
  const [modalOpen, setModal] = useState(false)
  const [editItem,  setEdit]  = useState(null)
  const [deleteId,  setDelId] = useState(null)

  const TABLE = tab === 'areas' ? 'research_areas' : tab === 'awards' ? 'awards' : 'grants'

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

  const areaCols  = [{ key: 'icon', header: '🔬' }, { key: 'name', header: 'Name' }, { key: 'description', header: 'Description', render: (v) => v?.substring(0,60) }, { key: 'is_visible', header: 'Visible', render: (v) => v ? '✅' : '🚫' }]
  const awardCols = [{ key: 'title', header: 'Title' }, { key: 'awarding_body', header: 'By' }, { key: 'year', header: 'Year' }, { key: 'is_visible', header: 'Visible', render: (v) => v ? '✅' : '🚫' }]
  const grantCols = [
    { key: 'title', header: 'Title', render: (v) => v?.substring(0,50)+'…' },
    { key: 'funding_agency', header: 'Agency' },
    { key: 'amount',  header: 'Amount', render: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '' },
    { key: 'status',  header: 'Status' },
  ]

  const columns = tab === 'areas' ? areaCols : tab === 'awards' ? awardCols : grantCols

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Research</h1>
        <button className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button className={`tab-btn ${tab === 'areas'  ? 'tab-btn--active' : ''}`} onClick={() => setTab('areas')}>Research Areas</button>
        <button className={`tab-btn ${tab === 'awards' ? 'tab-btn--active' : ''}`} onClick={() => setTab('awards')}>Awards</button>
        <button className={`tab-btn ${tab === 'grants' ? 'tab-btn--active' : ''}`} onClick={() => setTab('grants')}>Funded Projects</button>
      </div>

      <DataTable data={data} columns={columns} isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }} onDelete={(row) => setDelId(row.id)} />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit' : 'Add'}>
        {tab === 'areas'  && <ResearchAreaForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />}
        {tab === 'awards' && <AwardForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />}
        {tab === 'grants' && (
          <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(Object.fromEntries(new FormData(e.target))) }} className="admin-form">
            <div className="form-group"><label className="form-label">Title *</label><input name="title" defaultValue={editItem?.title} className="form-control" required /></div>
            <div className="form-group"><label className="form-label">Funding Agency *</label><input name="funding_agency" defaultValue={editItem?.funding_agency} className="form-control" required /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Amount (₹)</label><input name="amount" defaultValue={editItem?.amount} type="number" className="form-control" /></div>
              <div className="form-group"><label className="form-label">Status</label><select name="status" defaultValue={editItem?.status || 'ongoing'} className="form-control"><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Start Date</label><input name="start_date" defaultValue={editItem?.start_date} type="date" className="form-control" /></div>
              <div className="form-group"><label className="form-label">End Date</label><input name="end_date" defaultValue={editItem?.end_date} type="date" className="form-control" /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea name="description" defaultValue={editItem?.description} className="form-control" rows={3} /></div>
            <button type="submit" className="btn btn--primary" disabled={upsert.isPending} style={{ marginTop: 'var(--space-4)' }}>Save</button>
          </form>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this entry?" />
    </div>
  )
}

export default ResearchPage
