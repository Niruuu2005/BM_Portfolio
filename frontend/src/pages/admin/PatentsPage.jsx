import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PatentForm from '@/components/admin/PatentForm'
import CopyrightForm from '@/components/admin/CopyrightForm'

const PatentsPage = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()
  const [tab, setTab] = useState('patents')
  const [modalOpen, setModal] = useState(false)
  const [editItem, setEdit] = useState(null)
  const [deleteId, setDelId] = useState(null)

  const TABLE = tab === 'patents' ? 'patents' : 'copyrights'

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE, tab],
    enabled: !!accessToken,
    queryFn: async () => apiAdmin(`/api/admin/data/${TABLE}`, { token: accessToken }),
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

  const patentCols = [
    { key: 'title', header: 'Title', render: (v) => (v && v.length > 50 ? `${v.slice(0, 50)}…` : (v ?? '—')) },
    { key: 'inventors', header: 'Inventors' },
    { key: 'status', header: 'Status' },
    { key: 'application_number', header: 'App No.' },
  ]

  const copyrightCols = [
    { key: 'title', header: 'Title', render: (v) => (v && v.length > 50 ? `${v.slice(0, 50)}…` : (v ?? '—')) },
    { key: 'authors', header: 'Authors' },
    { key: 'registration_number', header: 'Reg No.' },
    { key: 'work_type', header: 'Type' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Patents & Copyrights</h1>
        <button type="button" className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button type="button" className={`tab-btn ${tab === 'patents' ? 'tab-btn--active' : ''}`} onClick={() => setTab('patents')}>Patents</button>
        <button type="button" className={`tab-btn ${tab === 'copyrights' ? 'tab-btn--active' : ''}`} onClick={() => setTab('copyrights')}>Copyrights</button>
      </div>

      <DataTable
        data={data}
        columns={tab === 'patents' ? patentCols : copyrightCols}
        isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }}
        onDelete={(id) => setDelId(id)}
        onToggleVisibility={(id, is_visible) => toggleVis.mutate({ id, is_visible })}
      />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? `Edit ${tab === 'patents' ? 'Patent' : 'Copyright'}` : `Add ${tab === 'patents' ? 'Patent' : 'Copyright'}`}>
        {tab === 'patents' ? (
          <PatentForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
        ) : (
          <CopyrightForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message={`Delete this ${tab === 'patents' ? 'patent' : 'copyright'}?`} />
    </div>
  )
}

export default PatentsPage
