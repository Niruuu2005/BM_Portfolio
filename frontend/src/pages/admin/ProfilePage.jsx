import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useProfile } from '@/hooks/useProfile'
import { useUploadProfilePhoto, useUploadCV } from '@/hooks/useStorage'
import Spinner from '@/components/shared/Spinner'

const ProfilePage = () => {
  const queryClient  = useQueryClient()
  const { data: profile, isLoading } = useProfile()
  const uploadPhoto  = useUploadProfilePhoto()
  const uploadCV     = useUploadCV()

  const { register, handleSubmit } = useForm({ values: profile || {} })

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('profile').update(data).eq('id', data.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated!')
    },
    onError: (err) => toast.error(err.message),
  })

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadPhoto.mutateAsync(file)
    if (url) {
      await supabase.from('profile').update({ photo_url: url }).eq('id', profile.id)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Photo updated!')
    }
  }

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadCV.mutateAsync(file)
    if (url) {
      await supabase.from('profile').update({ cv_url: url }).eq('id', profile.id)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('CV updated!')
    }
  }

  if (isLoading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-8)' }}>
        Profile
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        <form onSubmit={handleSubmit(saveProfile)} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input {...register('name')} className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input {...register('designation')} className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input {...register('department')} className="form-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Institution</label>
            <input {...register('institution')} className="form-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Institution URL</label>
            <input {...register('institution_url')} className="form-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input {...register('email')} type="email" className="form-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input {...register('phone')} className="form-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea {...register('address')} className="form-control" rows={2} />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea {...register('bio')} className="form-control" rows={4} />
          </div>

          <div className="form-group">
            <label className="form-label">Career Objective</label>
            <textarea {...register('career_obj')} className="form-control" rows={3} />
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            Academic Profile Links
          </h3>
          {['scholar_url','scopus_url','orcid_url','wos_url','researchgate_url','publons_url','linkedin_url'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{field.replace('_url','').replace('_',' ')}</label>
              <input {...register(field)} className="form-control" placeholder="https://..." />
            </div>
          ))}

          <button type="submit" className="btn btn--primary" disabled={isPending} style={{ marginTop: 'var(--space-4)' }}>
            {isPending ? 'Saving…' : 'Save Profile'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-4)' }}>Profile Photo</h3>
            {profile?.photo_url && (
              <img src={profile.photo_url} alt="profile" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 'var(--space-4)' }} />
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} id="photo-upload" style={{ display: 'none' }} />
            <label htmlFor="photo-upload" className="btn btn--outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
              {uploadPhoto.isPending ? 'Uploading…' : 'Choose Photo'}
            </label>
          </div>

          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-4)' }}>Curriculum Vitae (CV)</h3>
            {profile?.cv_url && (
              <a href={profile.cv_url} target="_blank" rel="noreferrer" className="btn btn--outline" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
                View Current CV
              </a>
            )}
            <br />
            <input type="file" accept="application/pdf" onChange={handleCVUpload} id="cv-upload" style={{ display: 'none' }} />
            <label htmlFor="cv-upload" className="btn btn--outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
              {uploadCV.isPending ? 'Uploading…' : 'Upload New CV (PDF)'}
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
