import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const uploadProfilePhoto = async (file) => {
  const ext = file.name.split('.').pop()
  const filePath = `profile.${ext}`
  const { error } = await supabase.storage.from('profile-photos').upload(filePath, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('profile-photos').getPublicUrl(filePath)
  return data.publicUrl
}

export const uploadCV = async (file) => {
  const { error } = await supabase.storage.from('cv-documents').upload('cv.pdf', file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('cv-documents').getPublicUrl('cv.pdf')
  return data.publicUrl
}

export const uploadStudyMaterial = async (file, subject, year) => {
  const sanitized = subject.replace(/\s+/g, '_').toLowerCase()
  const filePath  = `${sanitized}_${year}_${Date.now()}.${file.name.split('.').pop()}`
  const { error } = await supabase.storage.from('study-materials').upload(filePath, file)
  if (error) throw error
  const { data } = supabase.storage.from('study-materials').getPublicUrl(filePath)
  return data.publicUrl
}

export const useUploadProfilePhoto = () =>
  useMutation({ mutationFn: (file) => uploadProfilePhoto(file) })

export const useUploadCV = () =>
  useMutation({ mutationFn: (file) => uploadCV(file) })

export const useUploadStudyMaterial = () =>
  useMutation({ mutationFn: ({ file, subject, year }) => uploadStudyMaterial(file, subject, year) })
