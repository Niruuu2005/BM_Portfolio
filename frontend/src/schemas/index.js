import { z } from 'zod'

export const publicationSchema = z.object({
  title:     z.string().min(5, 'Title must be at least 5 characters'),
  authors:   z.string().min(3, 'Authors are required'),
  venue:     z.string().optional(),
  volume:    z.string().optional(),
  issue:     z.string().optional(),
  pages:     z.string().optional(),
  year:      z.coerce.number().int().min(1900).max(2100),
  doi:       z.string().optional(),
  url:       z.string().url('Must be a valid URL').optional().or(z.literal('')),
  publisher: z.string().optional(),
  indexing:  z.enum(['SCI', 'Scopus', 'UGC', 'Others', '']).optional(),
  isbn_issn: z.string().optional(),
})

export const educationSchema = z.object({
  degree:           z.string().min(2, 'Degree is required'),
  specialization:   z.string().optional(),
  institution:      z.string().optional(),
  university:       z.string().optional(),
  year:             z.coerce.number().int().min(1950).max(2100),
  score:            z.string().optional(),
  rank_distinction: z.string().optional(),
  thesis_title:     z.string().optional(),
  sort_order:       z.coerce.number().int().default(0),
})

export const patentSchema = z.object({
  title:          z.string().min(5, 'Title is required'),
  inventors:      z.string().min(2, 'Inventors are required'),
  application_no: z.string().optional(),
  year:           z.coerce.number().int().min(1990).max(2100),
  country:        z.string().default('India'),
  status:         z.enum(['filed', 'published', 'exam', 'granted']),
  description:    z.string().optional(),
})

export const copyrightSchema = z.object({
  title:    z.string().min(3, 'Title is required'),
  reg_no:   z.string().optional(),
  reg_date: z.string().optional(),
  year:     z.coerce.number().int().min(1990).max(2100),
  type:     z.enum(['lab_manual', 'software', 'research', 'presentation', '']).optional(),
})

export const activitySchema = z.object({
  title:       z.string().min(3, 'Title is required'),
  organizer:   z.string().optional(),
  venue:       z.string().optional(),
  institution: z.string().optional(),
  year:        z.coerce.number().int().min(1990).max(2100),
  duration:    z.string().optional(),
  mode:        z.enum(['Online', 'Offline', 'Hybrid', '']).optional(),
  role:        z.string().optional(),
  description: z.string().optional(),
})

export const experienceSchema = z.object({
  designation:  z.string().min(2, 'Designation is required'),
  department:   z.string().optional(),
  institution:  z.string().min(2, 'Institution is required'),
  type:         z.enum(['academic', 'industry', 'research']),
  start_date:   z.string().optional(),
  end_date:     z.string().optional(),
  is_current:   z.boolean().default(false),
  sort_order:   z.coerce.number().int().default(0),
})

export const researchAreaSchema = z.object({
  name:       z.string().min(2, 'Name is required'),
  icon:       z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
})

export const awardSchema = z.object({
  title:       z.string().min(3, 'Title is required'),
  awarded_by:  z.string().optional(),
  year:        z.coerce.number().int().min(1990).max(2100),
  description: z.string().optional(),
  url:         z.string().url().optional().or(z.literal('')),
})

export const subjectSchema = z.object({
  subject:   z.string().min(2, 'Subject is required'),
  level:     z.enum(['UG', 'PG']),
  department:z.string().optional(),
  year_from: z.coerce.number().int().optional(),
  year_to:   z.coerce.number().int().optional(),
})

export const membershipSchema = z.object({
  organization: z.string().min(2, 'Organization is required'),
  type:         z.enum(['life_member', 'member', 'senior_member', 'fellow']).default('member'),
  member_no:    z.string().optional(),
  year_from:    z.coerce.number().int().optional(),
  year_to:      z.coerce.number().int().optional(),
})
