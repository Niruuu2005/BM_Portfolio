import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EducationForm from '@/components/admin/EducationForm'

const TABLE = 'education'

const EducationPage = () => {
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

  const openAdd = () => {
    setEdit(null)
    setModal(true)
  }
  const openEdit = (row) => {
    setEdit(row)
    setModal(true)
  }

  const columns = [
    { key: 'degree', header: 'Degree' },
    { key: 'field_of_study', header: 'Field' },
    { key: 'institution', header: 'Institution' },
    { key: 'start_year', header: 'Year' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Education</h1>
        <button type="button" className="btn btn--primary" onClick={openAdd}>+ Add</button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={(id) => setDelId(id)}
      />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit Education' : 'Add Education'}>
        <EducationForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDelId(null)}
        onConfirm={() => remove.mutate(deleteId)}
        message="Delete this education entry? This cannot be undone."
      />
    </div>
  )
}

export default EducationPage
