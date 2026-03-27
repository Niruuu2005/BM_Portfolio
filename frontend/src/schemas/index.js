import { z } from 'zod'

/** Matches `publications` table + `PublicationForm` (journal_name, pub_type — not venue) */
export const publicationSchema = z.object({
  pub_type: z.enum(['journal', 'conference', 'book_chapter', 'book']),
  title:    z.string().min(5, 'Title must be at least 5 characters'),
  authors:  z.string().min(3, 'Authors are required'),
  journal_name: z.string().optional().or(z.literal('')),
  volume:   z.string().optional().or(z.literal('')),
  issue:    z.string().optional().or(z.literal('')),
  pages:    z.string().optional().or(z.literal('')),
  year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1900).max(2100).optional()
  ),
  doi:       z.string().optional().or(z.literal('')),
  url:       z.string().url('Must be a valid URL').optional().or(z.literal('')),
  publisher: z.string().optional().or(z.literal('')),
  indexing:  z.string().optional().or(z.literal('')),
  impact_factor: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().optional()
  ),
  is_visible: z.boolean().optional(),
})

/** Matches `education` + `EducationForm` (field_of_study, start_year/end_year — not specialization/year) */
export const educationSchema = z.object({
  degree:         z.string().min(2, 'Degree is required'),
  field_of_study: z.string().min(2, 'Field of study is required'),
  institution:    z.string().min(2, 'Institution is required'),
  university:     z.string().optional().or(z.literal('')),
  start_year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1950).max(2100)
  ),
  end_year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1950).max(2100).optional()
  ),
  grade: z.string().optional().or(z.literal('')),
})

/** Matches `patents` + `PatentForm` (application_number — not application_no; no year column in DB) */
export const patentSchema = z.object({
  title:               z.string().min(5, 'Title is required'),
  inventors:           z.string().min(2, 'Inventors are required'),
  application_number:  z.string().optional().or(z.literal('')),
  patent_number:       z.string().optional().or(z.literal('')),
  filing_date:         z.string().optional().or(z.literal('')),
  grant_date:          z.string().optional().or(z.literal('')),
  status:              z.enum(['filed', 'published', 'granted']),
  country:             z.string().optional().or(z.literal('')),
  is_visible:          z.boolean().optional(),
})

/** Matches `copyrights` + `CopyrightForm` (registration_number, work_type — not reg_no/type enum) */
export const copyrightSchema = z.object({
  title:                z.string().min(3, 'Title is required'),
  authors:              z.string().min(2, 'Authors are required'),
  registration_number:  z.string().optional().or(z.literal('')),
  registration_date:    z.string().optional().or(z.literal('')),
  work_type:            z.string().optional().or(z.literal('')),
  year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1990).max(2100).optional()
  ),
  is_visible: z.boolean().optional(),
})

/** Matches `activities` + `ActivityForm` (activity_type — not institution/mode/description) */
export const activitySchema = z.object({
  activity_type: z.enum(['fdp_attended', 'workshop_organized', 'guest_lecture', 'judge_mentor', 'reviewer']),
  title:         z.string().min(3, 'Title is required'),
  organizer:     z.string().optional().or(z.literal('')),
  venue:         z.string().optional().or(z.literal('')),
  year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1990).max(2100).optional()
  ),
  duration:   z.string().optional().or(z.literal('')),
  role:       z.string().optional().or(z.literal('')),
  is_visible: z.boolean().optional(),
})

/** Matches `experience` + `ExperienceForm` (role, organization — ExperiencePage maps responsibilities_text → JSON) */
export const experienceSchema = z.object({
  role:                  z.string().min(2, 'Role is required'),
  organization:          z.string().min(2, 'Organization is required'),
  department:            z.string().optional().or(z.literal('')),
  start_date:            z.string().min(1, 'Start date is required'),
  end_date:              z.string().optional().or(z.literal('')),
  is_current:            z.boolean().optional(),
  responsibilities_text: z.string().optional().or(z.literal('')),
})

/** Matches `research_areas` + `ResearchAreaForm` */
export const researchAreaSchema = z.object({
  name:        z.string().min(2, 'Name is required'),
  icon:        z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  is_visible:  z.boolean().optional(),
})

/** Matches `awards` + `AwardForm` (awarding_body, award_type — not awarded_by/url) */
export const awardSchema = z.object({
  title:         z.string().min(3, 'Title is required'),
  awarding_body: z.string().optional().or(z.literal('')),
  year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1990).max(2100).optional()
  ),
  award_type:   z.string().optional().or(z.literal('')),
  description:  z.string().optional().or(z.literal('')),
  is_visible:   z.boolean().optional(),
})

/** Matches `subjects_taught` + `SubjectForm` fields (DB also has year_from/year_to — add when form exposes them) */
export const subjectSchema = z.object({
  subject_name: z.string().min(2, 'Subject name is required'),
  subject_code: z.string().optional().or(z.literal('')),
  level:        z.enum(['UG', 'PG']),
  is_visible:   z.boolean().optional(),
})

/** Aligned with docs/sql/004_migration_study_materials_categories.sql CHECK */
const studyMaterialTypes = z.enum([
  'notes',
  'slides',
  'lab',
  'video',
  'code',
  'link',
  'theory',
  'reference',
  'assignment',
  'reading',
  'other',
])

/** Matches `study_materials` + `StudyMaterialForm` */
export const studyMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  material_type: studyMaterialTypes,
  subject_id: z.union([z.string().uuid(), z.literal('')]).optional(),
  subject: z.string().optional().or(z.literal('')),
  academic_term: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  file_url: z.string().optional().or(z.literal('')),
  external_url: z.string().optional().or(z.literal('')),
  sort_order: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? 0 : v),
    z.number().int()
  ),
  year: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1990).max(2100).optional()
  ),
  is_visible: z.boolean().optional(),
})

/** Matches `memberships` + `MembershipForm` + DB columns */
export const membershipSchema = z.object({
  organization:    z.string().min(2, 'Organization is required'),
  membership_type: z.string().optional().or(z.literal('')),
  membership_id:   z.string().optional().or(z.literal('')),
  year_joined: z.preprocess(
    (v) => (v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().int().min(1900).max(2100).optional()
  ),
  is_visible: z.boolean().optional(),
})
