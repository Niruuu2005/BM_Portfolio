import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import DataTable   from '@/components/shared/DataTable'
import Modal       from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EducationForm from '@/components/admin/EducationForm'

const TABLE = 'education'

const EducationPage = () => {
  const queryClient = useQueryClient()
  const [modalOpen, setModal] = useState(false)
  const [editItem,  setEdit]  = useState(null)
  const [deleteId,  setDelId] = useState(null)

  const { data = [], isLoading } = useQuery({
    queryKey: [TABLE],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE).select('*').order('start_year', { ascending: false })
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

  const openAdd  = () => { setEdit(null);  setModal(true) }
  const openEdit = (row) => { setEdit(row); setModal(true) }

  const columns = [
    { key: 'degree',        header: 'Degree' },
    { key: 'field_of_study', header: 'Field' },
    { key: 'institution',   header: 'Institution' },
    { key: 'start_year',    header: 'Year' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)' }}>Education</h1>
        <button className="btn btn--primary" onClick={openAdd}>+ Add</button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={(row) => setDelId(row.id)}
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
