import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PublicationForm from '@/components/admin/PublicationForm'

const TABLE = 'publications'
const PUB_TABS = ['journal', 'conference', 'book_chapter', 'book']

const PublicationsPage = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()
  const [tab, setTab] = useState('journal')
  const [modalOpen, setModal] = useState(false)
  const [editItem, setEdit] = useState(null)
  const [deleteId, setDelId] = useState(null)

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE, tab],
    enabled: !!accessToken,
    queryFn: async () =>
      apiAdmin(`/api/admin/data/${TABLE}?pub_type=${encodeURIComponent(tab)}`, { token: accessToken }),
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

  const columns = [
    { key: 'title', header: 'Title', render: (v) => (v ? String(v).substring(0, 60) + (v.length > 60 ? '…' : '') : '') },
    { key: 'authors', header: 'Authors', render: (v) => (v ? String(v).substring(0, 40) + (v.length > 40 ? '…' : '') : '') },
    { key: 'journal_name', header: 'Journal' },
    { key: 'year', header: 'Year' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Publications</h1>
        <button type="button" className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {PUB_TABS.map((t) => (
          <button key={t} type="button" className={`tab-btn ${tab === t ? 'tab-btn--active' : ''}`} onClick={() => setTab(t)}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }}
        onDelete={(id) => setDelId(id)}
        onToggleVisibility={(id, is_visible) => toggleVis.mutate({ id, is_visible })}
      />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit Publication' : 'Add Publication'}>
        <PublicationForm defaultValues={editItem || { pub_type: tab }} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this publication?" />
    </div>
  )
}

export default PublicationsPage
