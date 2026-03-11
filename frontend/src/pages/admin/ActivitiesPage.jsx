import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ActivityForm from '@/components/admin/ActivityForm'
import MembershipForm from '@/components/admin/MembershipForm'

const TABS = [
  { key: 'fdp_attended',       label: 'FDP' },
  { key: 'workshop_organized', label: 'Workshops' },
  { key: 'guest_lecture',      label: 'Guest Lectures' },
  { key: 'judge_mentor',       label: 'Judge / Mentor' },
  { key: 'reviewer',           label: 'Reviewer' },
  { key: 'memberships',        label: 'Memberships' },
]

const ActivitiesPage = () => {
  const queryClient = useQueryClient()
  const [tab,       setTab]   = useState('fdp_attended')
  const [modalOpen, setModal] = useState(false)
  const [editItem,  setEdit]  = useState(null)
  const [deleteId,  setDelId] = useState(null)

  const isMemberships = tab === 'memberships'
  const TABLE = isMemberships ? 'memberships' : 'activities'

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE, tab],
    queryFn: async () => {
      let q = supabase.from(TABLE).select('*')
      if (!isMemberships) q = q.eq('activity_type', tab)
      q = q.order('year', { ascending: false })
      const { data, error } = await q
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

  const activityCols   = [{ key: 'title', header: 'Title' }, { key: 'organizer', header: 'Organizer' }, { key: 'year', header: 'Year' }, { key: 'is_visible', header: 'Visible', render: (v) => v ? '✅' : '🚫' }]
  const membershipCols = [{ key: 'organization', header: 'Organization' }, { key: 'membership_type', header: 'Type' }, { key: 'membership_id', header: 'ID' }, { key: 'year_joined', header: 'Year' }]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Activities</h1>
        <button className="btn btn--primary" onClick={() => { setEdit(null); setModal(true) }}>+ Add</button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'tab-btn--active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <DataTable data={data} columns={isMemberships ? membershipCols : activityCols} isLoading={isLoading}
        onEdit={(row) => { setEdit(row); setModal(true) }} onDelete={(row) => setDelId(row.id)} />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit' : 'Add'}>
        {isMemberships
          ? <MembershipForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
          : <ActivityForm   defaultValues={editItem || { activity_type: tab }} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
        }
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this entry?" />
    </div>
  )
}

export default ActivitiesPage
