import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import MembershipForm from '@/components/admin/MembershipForm'

const TABLE = 'memberships'
const COLUMNS = [
  { key: 'organization', label: 'Organization' },
  { key: 'membership_type', label: 'Type' },
  { key: 'membership_id', label: 'Member No.' },
  { key: 'year_joined', label: 'Since' },
]

const MembershipsPage = () => {
  const qc = useQueryClient()
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
      qc.invalidateQueries({ queryKey: [TABLE] })
      setModal(false)
      toast.success('Saved!')
    },
    onError: (e) => toast.error(e.message),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      await apiAdmin(`/api/admin/data/${TABLE}/${id}`, { token: accessToken, method: 'DELETE' })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TABLE] })
      setDelId(null)
      toast.success('Deleted!')
    },
    onError: (e) => toast.error(e.message),
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
      qc.invalidateQueries({ queryKey: [TABLE] })
      toast.success('Visibility updated!')
    },
    onError: (e) => toast.error(e.message),
  })

  return (
    <div>
      <div className="page-title-bar">
        <h2>Professional Memberships</h2>
        <button type="button" className="btn btn-primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add Membership</button>
      </div>
      <DataTable
        data={data}
        columns={COLUMNS}
        isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }}
        onDelete={(id) => setDelId(id)}
        onToggleVisibility={(id, is_visible) => toggleVis.mutate({ id, is_visible })}
      />
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit Membership' : 'Add Membership'}>
        <MembershipForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this membership? This cannot be undone." />
    </div>
  )
}
export default MembershipsPage
