import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PatentForm from '@/components/admin/PatentForm'
import CopyrightForm from '@/components/admin/CopyrightForm'

const PatentsPage = () => {
  const queryClient = useQueryClient()
  const [tab,       setTab]   = useState('patents')
  const [modalOpen, setModal] = useState(false)
  const [editItem,  setEdit]  = useState(null)
  const [deleteId,  setDelId] = useState(null)

  const TABLE = tab === 'patents' ? 'patents' : 'copyrights'

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

  const patentCols = [
    { key: 'title',              header: 'Title',    render: (v) => v?.substring(0,50)+'…' },
    { key: 'inventors',          header: 'Inventors' },
    { key: 'status',             header: 'Status' },
    { key: 'application_number', header: 'App No.' },
    { key: 'is_visible',         header: 'Visible', render: (v) => v ? '✅' : '🚫' },
  ]

  const copyrightCols = [
    { key: 'title',               header: 'Title',   render: (v) => v?.substring(0,50)+'…' },
    { key: 'authors',             header: 'Authors' },
    { key: 'registration_number', header: 'Reg No.' },
    { key: 'work_type',           header: 'Type' },
    { key: 'is_visible',          header: 'Visible', render: (v) => v ? '✅' : '🚫' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Patents & Copyrights</h1>
        <button className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button className={`tab-btn ${tab === 'patents'    ? 'tab-btn--active' : ''}`} onClick={() => setTab('patents')}>Patents</button>
        <button className={`tab-btn ${tab === 'copyrights' ? 'tab-btn--active' : ''}`} onClick={() => setTab('copyrights')}>Copyrights</button>
      </div>

      <DataTable data={data} columns={tab === 'patents' ? patentCols : copyrightCols} isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }} onDelete={(row) => setDelId(row.id)} />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? `Edit ${tab === 'patents' ? 'Patent' : 'Copyright'}` : `Add ${tab === 'patents' ? 'Patent' : 'Copyright'}`}>
        {tab === 'patents'
          ? <PatentForm    defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
          : <CopyrightForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
        }
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message={`Delete this ${tab === 'patents' ? 'patent' : 'copyright'}?`} />
    </div>
  )
}

export default PatentsPage
