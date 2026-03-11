import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PublicationForm from '@/components/admin/PublicationForm'

const TABLE = 'publications'
const PUB_TABS = ['journal', 'conference', 'book_chapter', 'book']

const PublicationsPage = () => {
  const queryClient = useQueryClient()
  const [tab,       setTab]   = useState('journal')
  const [modalOpen, setModal] = useState(false)
  const [editItem,  setEdit]  = useState(null)
  const [deleteId,  setDelId] = useState(null)

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE, tab],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE).select('*').eq('pub_type', tab).order('year', { ascending: false })
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

  const columns = [
    { key: 'title',        header: 'Title',   render: (v) => v?.substring(0, 60) + (v?.length > 60 ? '…' : '') },
    { key: 'authors',      header: 'Authors', render: (v) => v?.substring(0, 40) + (v?.length > 40 ? '…' : '') },
    { key: 'journal_name', header: 'Journal' },
    { key: 'year',         header: 'Year' },
    { key: 'is_visible',   header: 'Visible',  render: (v) => v ? '✅' : '🚫' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Publications</h1>
        <button className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {PUB_TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'tab-btn--active' : ''}`} onClick={() => setTab(t)}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <DataTable data={data} columns={columns} isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }} onDelete={(row) => setDelId(row.id)} />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit Publication' : 'Add Publication'}>
        <PublicationForm defaultValues={editItem || { pub_type: tab }} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this publication?" />
    </div>
  )
}

export default PublicationsPage
