# Module — Storage Management

> **Module Goal:** Create and configure all Supabase Storage buckets for file uploads (profile photos, CV, study materials, and activity certificates). Set proper access policies so public buckets are downloadable by anyone and private buckets are admin-only.

---

## 4.1 Bucket Overview

| Bucket Name | Public? | Used For | File Types |
|-------------|:-------:|---------|-----------|
| `profile-photos` | ✅ Yes | Profile headshot | `.jpg`, `.png`, `.webp` |
| `cv-documents` | ✅ Yes | Downloadable CV PDF | `.pdf` |
| `study-materials` | ✅ Yes | Lab manuals, notes | `.pdf`, `.ppt`, `.doc` |
| `activity-certificates` | ❌ No | FDP/workshop certificates | `.pdf`, `.jpg` |

---

## 4.2 Create Buckets (SQL)

Run in Supabase SQL Editor:

```sql
-- 1. Profile Photos (public download)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880,                                              -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 2. CV Documents (public download)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-documents',
  'cv-documents',
  true,
  10485760,                                             -- 10 MB limit
  ARRAY['application/pdf']
);

-- 3. Study Materials (public download)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  true,
  52428800,                                             -- 50 MB limit
  ARRAY['application/pdf', 'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- 4. Activity Certificates (private — admin only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'activity-certificates',
  'activity-certificates',
  false,
  10485760,                                             -- 10 MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
);
```

> Or create via Dashboard → Storage → New Bucket (simpler UI method)

---

## 4.3 Storage RLS Policies

### Policy 1: Public can SELECT (download) from public buckets

```sql
-- profile-photos: public read
CREATE POLICY "Public read profile-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

-- cv-documents: public read
CREATE POLICY "Public read cv-documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-documents');

-- study-materials: public read
CREATE POLICY "Public read study-materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'study-materials');
```

### Policy 2: Admin can INSERT (upload) to any bucket

```sql
CREATE POLICY "Admin can upload to any bucket"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

### Policy 3: Admin can UPDATE files

```sql
CREATE POLICY "Admin can update files"
ON storage.objects FOR UPDATE
USING (auth.uid() IS NOT NULL);
```

### Policy 4: Admin can DELETE files

```sql
CREATE POLICY "Admin can delete files"
ON storage.objects FOR DELETE
USING (auth.uid() IS NOT NULL);
```

### Policy 5: Admin can also READ private bucket (certificates)

```sql
CREATE POLICY "Admin read certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'activity-certificates' AND auth.uid() IS NOT NULL);
```

---

## 4.4 Upload Files from Frontend (JS SDK)

### Upload Profile Photo

```javascript
// src/hooks/useStorage.js
import { supabase } from '@/lib/supabase'

export const uploadProfilePhoto = async (file) => {
  const ext      = file.name.split('.').pop()
  const filePath = `profile.${ext}`   // always overwrites same file

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, { upsert: true, cacheControl: '3600' })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath)

  return data.publicUrl   // e.g., https://xxx.supabase.co/storage/v1/object/public/profile-photos/profile.jpg
}
```

### Upload CV PDF

```javascript
export const uploadCV = async (file) => {
  const { error } = await supabase.storage
    .from('cv-documents')
    .upload('cv.pdf', file, { upsert: true, cacheControl: '3600' })

  if (error) throw error

  const { data } = supabase.storage
    .from('cv-documents')
    .getPublicUrl('cv.pdf')

  return data.publicUrl
}
```

### Upload Study Material

```javascript
export const uploadStudyMaterial = async (file, subject, year) => {
  const sanitized = subject.replace(/\s+/g, '_').toLowerCase()
  const filePath  = `${sanitized}_${year}_${Date.now()}.${file.name.split('.').pop()}`

  const { error } = await supabase.storage
    .from('study-materials')
    .upload(filePath, file, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage
    .from('study-materials')
    .getPublicUrl(filePath)

  return data.publicUrl
}
```

### Upload Activity Certificate (private)

```javascript
export const uploadCertificate = async (file, activityTitle) => {
  const sanitized = activityTitle.replace(/\s+/g, '_').toLowerCase().slice(0, 40)
  const filePath  = `${sanitized}_${Date.now()}.${file.name.split('.').pop()}`

  const { error } = await supabase.storage
    .from('activity-certificates')
    .upload(filePath, file, { upsert: false })

  if (error) throw error

  // Private bucket — use createSignedUrl for temporary access
  const { data } = await supabase.storage
    .from('activity-certificates')
    .createSignedUrl(filePath, 3600)   // 1-hour signed URL

  return data.signedUrl
}
```

---

## 4.5 Delete Files

```javascript
export const deleteFile = async (bucket, filePath) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) throw error
}
```

---

## 4.6 Get Public URL (for already-uploaded files)

```javascript
export const getPublicUrl = (bucket, filePath) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}
```

URL format:
```
https://YOUR_PROJECT.supabase.co/storage/v1/object/public/BUCKET_NAME/FILE_PATH
```

---

## 4.7 Store File URLs in Database

After uploading, always save the public URL back to the appropriate database table:

```javascript
// After uploading profile photo:
const photoUrl = await uploadProfilePhoto(file)
await supabase.from('profile')
  .update({ photo_url: photoUrl })
  .eq('id', profileId)

// After uploading CV:
const cvUrl = await uploadCV(file)
await supabase.from('profile')
  .update({ cv_url: cvUrl })
  .eq('id', profileId)

// After uploading a study material:
const fileUrl = await uploadStudyMaterial(file, subject, year)
await supabase.from('study_materials')
  .insert({ title, subject, level, year, file_url: fileUrl })
```

---

## 4.8 Admin File Manager (Optional Enhancement)

You can list all files in a bucket from the admin panel:

```javascript
// List all files in study-materials bucket
const { data: files, error } = await supabase.storage
  .from('study-materials')
  .list('', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' }
  })

console.log(files)
// [{ name: 'ml_lab_2024.pdf', id: '...', metadata: { size: 1234 } }]
```

---

## 4.9 Module Completion Checklist

```
[ ] profile-photos bucket created (public, 5MB, jpg/png/webp)
[ ] cv-documents bucket created (public, 10MB, pdf only)
[ ] study-materials bucket created (public, 50MB, pdf/ppt/doc)
[ ] activity-certificates bucket created (private, 10MB)
[ ] Public SELECT policy for 3 public buckets
[ ] Admin INSERT/UPDATE/DELETE policies for all buckets
[ ] Admin SELECT for private certificates bucket
[ ] uploadProfilePhoto() function implemented and tested
[ ] uploadCV() function implemented and tested
[ ] uploadStudyMaterial() function implemented and tested
[ ] File URL saved to DB after every successful upload
[ ] Verify: public URL works in browser (no auth needed)
[ ] Verify: private bucket returns 403 without auth
```

---

*Backend Module — Storage Management | v1.0 — March 2026*
