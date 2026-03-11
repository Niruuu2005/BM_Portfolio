import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import DataTable    from '@/components/shared/DataTable'
import Modal        from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ExperienceForm from '@/components/admin/ExperienceForm'

const TABLE = 'experience'

const ExperiencePage = () => {
  const queryClient = useQueryClient()
  const [modalOpen, setModal] = useState(false)
  const [editItem,  setEdit]  = useState(null)
  const [deleteId,  setDelId] = useState(null)

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE).select('*').order('start_date', { ascending: false })
      if (error) throw error
      return data
    },
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
      const { error } = editItem
        ? await supabase.from(TABLE).update(payload).eq('id', editItem.id)
        : await supabase.from(TABLE).insert(payload)
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

  const openAdd  = () => { setEdit(null);  setModal(true) }
  const openEdit = (row) => {
    setEdit({ ...row, responsibilities_text: Array.isArray(row.responsibilities) ? row.responsibilities.join('\n') : '' })
    setModal(true)
  }

  const columns = [
    { key: 'role',         header: 'Role' },
    { key: 'organization', header: 'Organization' },
    { key: 'start_date',   header: 'Start' },
    { key: 'is_current',   header: 'Current', render: (v) => v ? '✅' : '' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Experience</h1>
        <button className="btn btn--primary" onClick={openAdd}>+ Add</button>
      </div>

      <DataTable data={data} columns={columns} isLoading={isLoading} onEdit={openEdit} onDelete={(row) => setDelId(row.id)} />

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit Experience' : 'Add Experience'}>
        <ExperienceForm defaultValues={editItem} onSubmit={upsert.mutate} isLoading={upsert.isPending} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDelId(null)} onConfirm={() => remove.mutate(deleteId)} message="Delete this experience entry?" />
    </div>
  )
}

export default ExperiencePage
