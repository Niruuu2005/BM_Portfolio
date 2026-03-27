import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ActivityForm from '@/components/admin/ActivityForm'
import MembershipForm from '@/components/admin/MembershipForm'

const TABS = [
  { key: 'fdp_attended', label: 'FDP' },
  { key: 'workshop_organized', label: 'Workshops' },
  { key: 'guest_lecture', label: 'Guest Lectures' },
  { key: 'judge_mentor', label: 'Judge / Mentor' },
  { key: 'reviewer', label: 'Reviewer' },
  { key: 'memberships', label: 'Memberships' },
]

const ActivitiesPage = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()
  const [tab, setTab] = useState('fdp_attended')
  const [modalOpen, setModal] = useState(false)
  const [editItem, setEdit] = useState(null)
  const [deleteId, setDelId] = useState(null)

  const isMemberships = tab === 'memberships'
  const TABLE = isMemberships ? 'memberships' : 'activities'

  const listPath =
    isMemberships
      ? `/api/admin/data/${TABLE}`
      : `/api/admin/data/${TABLE}?activity_type=${encodeURIComponent(tab)}`

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE, tab],
    enabled: !!accessToken,
    queryFn: async () => apiAdmin(listPath, { token: accessToken }),
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

  const activityCols = [
    { key: 'title', header: 'Title' },
    { key: 'organizer', header: 'Organizer' },
    { key: 'year', header: 'Year' },
  ]
  const membershipCols = [
    { key: 'organization', header: 'Organization' },
    { key: 'membership_type', header: 'Type' },
    { key: 'membership_id', header: 'ID' },
    { key: 'year_joined', header: 'Year' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Activities</h1>
        <button type="button" className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t.key} type="button" className={`tab-btn ${tab === t.key ? 'tab-btn--active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <DataTable
        data={data}
        columns={isMemberships ? membershipCols : activityCols}
        isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }}
        onDelete={(id) => setDelId(id)}
        onToggleVisibility={(id, is_visible) => toggleVis.mutate({ id, is_visible })}
      />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit' : 'Add'}>
        {isMemberships ? (
          <MembershipForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
        ) : (
          <ActivityForm defaultValues={editItem || { activity_type: tab }} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this entry?" />
    </div>
  )
}

export default ActivitiesPage
