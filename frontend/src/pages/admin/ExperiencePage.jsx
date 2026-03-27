import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ExperienceForm from '@/components/admin/ExperienceForm'

const TABLE = 'experience'

const ExperiencePage = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()
  const [modalOpen, setModal] = useState(false)
  const [editItem, setEdit] = useState(null)
  const [deleteId, setDelId] = useState(null)

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE],
    enabled: !!accessToken,
    queryFn: async () => apiAdmin(`/api/admin/data/${TABLE}`, { token: accessToken }),
  })

  const upsert = useMutation({
    mutationFn: async (values) => {
      const payload = {
        ...values,
        responsibilities: values.responsibilities_text
          ? values.responsibilities_text.split('\n').map((r) => r.trim()).filter(Boolean)
          : [],
      }
      delete payload.responsibilities_text
      if (editItem) {
        await apiAdmin(`/api/admin/data/${TABLE}/${editItem.id}`, {
          token: accessToken,
          method: 'PUT',
          body: payload,
        })
      } else {
        await apiAdmin(`/api/admin/data/${TABLE}`, { token: accessToken, method: 'POST', body: payload })
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

  const openAdd = () => {
    setEdit(null)
    setModal(true)
  }
  const openEdit = (row) => {
    setEdit({
      ...row,
      responsibilities_text: Array.isArray(row.responsibilities) ? row.responsibilities.join('\n') : '',
    })
    setModal(true)
  }

  const columns = [
    { key: 'role', header: 'Role' },
    { key: 'organization', header: 'Organization' },
    { key: 'start_date', header: 'Start' },
    { key: 'is_current', header: 'Current', render: (v) => (v ? '✅' : '') },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Experience</h1>
        <button type="button" className="btn btn--primary" onClick={openAdd}>+ Add</button>
      </div>

      <DataTable data={data} columns={columns} isLoading={isLoading} onEdit={openEdit} onDelete={(id) => setDelId(id)} />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit Experience' : 'Add Experience'}>
        <ExperienceForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this experience entry?" />
    </div>
  )
}

export default ExperiencePage
