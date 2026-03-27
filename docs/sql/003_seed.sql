-- BM Portfolio — Seed data (run after 002_policies.sql)
-- Uses service role / dashboard: policies allow INSERT only for app_admins.
-- Easiest: temporarily run as postgres in SQL Editor, or run seeds before create-admin with a one-off policy.
-- Recommended flow: run 001 + 002, then insert seed using Dashboard Table Editor, OR run this file
-- in SQL Editor as a user that bypasses RLS (e.g. disable RLS briefly) — OR use service role API.
--
-- Default: this script matches Supabase SQL Editor running as postgres (bypasses RLS).

INSERT INTO public.profile (
  name, designation, department, institution, institution_url, institution_logo_url,
  email, address, tagline, bio, career_obj,
  scholar_url, scopus_url, wos_url
) VALUES (
  'Mrs. B. Mahalakshmi (Mahalakshmi Bodireddy)',
  'Assistant Professor',
  'Computer Engineering',
  'Pimpri Chinchwad College of Engineering (PCCOE), Nigdi',
  'https://www.pccoepune.com',
  NULL,
  'mahalakshmi.bodireddy@pccoepune.org',
  'Dept. of Computer Engineering, PCCOE, Sector 26, Pradhikaran, Nigdi, Pune – 411044',
  'Empowering learners through Data Science, AI, and over two decades of academic excellence',
  'Mrs. B. Mahalakshmi is a dedicated Assistant Professor in the Department of Computer Engineering at PCCOE, Pune, with over 20 years of teaching experience. She has been an integral part of the institution since approximately 2005, contributing to undergraduate teaching, student mentorship, departmental governance, and applied research. Her work spans the intersection of data analytics, machine learning, and healthcare diagnostics, with notable contributions to biomedical signal processing and automated medical image analysis. She actively serves as an internal member of the Board of Studies (BoS) for the Computer Engineering department.',
  'To foster a culture of innovation and research excellence in Computer Engineering by integrating applied data science methodologies into teaching and contributing to meaningful technological advancements in healthcare and human-computer interaction domains.',
  'https://scholar.google.com/citations?user=HyzudGMAAAAJ',
  'https://www.scopus.com/authid/detail.uri?authorId=57190399971',
  'https://www.webofscience.com/wos/author/record/ACK-3444-2022'
);

INSERT INTO public.education (degree, field_of_study, institution, university, start_year, end_year, is_pursuing, sort_order, is_visible) VALUES
  ('M.E.',     'Computer Engineering',                NULL,      'Savitribai Phule Pune University (SPPU)', NULL, NULL, false, 1, true),
  ('B.Tech',   'Computer Science and Engineering',    NULL,      NULL,                                       NULL, NULL, false, 2, true),
  ('B.E.',     'Computer Engineering',                NULL,      NULL,                                       NULL, NULL, false, 3, true);

INSERT INTO public.experience (role, organization, department, start_date, is_current, responsibilities, sort_order, is_visible) VALUES
  (
    'Assistant Professor',
    'Pimpri Chinchwad College of Engineering (PCCOE)',
    'Computer Engineering',
    '2005-06-01',
    true,
    '["Teaching UG courses in Data Analytics, Data Science, and System Programming",
      "Student mentoring and career guidance",
      "Higher Studies Cell Coordinator",
      "Internal Member – Board of Studies (BoS), Computer Engineering",
      "NEP 2020 curriculum design and implementation"]'::jsonb,
    1,
    true
  );

INSERT INTO public.research_areas (name, icon, description, sort_order, is_visible) VALUES
  ('Data Analytics',               '📊', 'Analytics pipelines, visualization, and data-driven decision making.', 1, true),
  ('Data Science',                 '🔬', 'Statistical learning and applied data science in engineering education.', 2, true),
  ('System Programming',           '💻', 'OS-level programming and systems fundamentals.', 3, true),
  ('Machine Learning',             '🤖', 'Supervised/unsupervised models for real-world applications.', 4, true),
  ('Biomedical Signal Processing', '💓', 'ECG and physiological signal analysis.', 5, true),
  ('Medical Image Analysis',       '🏥', 'Automated diagnostics and medical imaging.', 6, true),
  ('Computer Vision',              '👁️', 'Detection, tracking, and scene understanding.', 7, true);

INSERT INTO public.awards (title, awarding_body, award_type, year, description, is_visible) VALUES
  ('Best Paper / Excellence (sample)', 'Conference / Institute', 'Academic', 2017, 'Replace with your real awards via admin.', true);

INSERT INTO public.research_grants (title, funding_agency, amount, status, start_date, end_date, description, is_visible) VALUES
  ('Research grant (sample)', 'Funding agency TBD', NULL, 'ongoing', NULL, NULL, 'Replace with funded project details via admin.', true);

INSERT INTO public.publications (pub_type, title, authors, journal_name, year, indexing, is_visible) VALUES
  (
    'conference',
    'A Three Lead Wireless ECG System',
    'B. Mahalakshmi, Ankush Dudani, Chippy Kumar, Avinash Ghatge',
    '3rd International Conference on Computing, Communication, Control and Automation (ICCUBEA-2017)',
    2017,
    'Scopus',
    true
  ),
  (
    'journal',
    'Comparative Study of Automated Glaucoma Detection Using Machine Learning',
    'B. Mahalakshmi et al.',
    NULL,
    NULL,
    NULL,
    true
  ),
  (
    'conference',
    'Real-Time Human Sitting Posture Detection Using YOLOv5',
    'B. Mahalakshmi et al.',
    NULL,
    NULL,
    NULL,
    true
  );

INSERT INTO public.patents (title, inventors, application_number, status, country, is_visible) VALUES
  ('Patent application (sample)', 'B. Mahalakshmi et al.', NULL, 'filed', 'India', true);

INSERT INTO public.copyrights (title, authors, registration_number, work_type, year, is_visible) VALUES
  ('Copyright / IP (sample)', 'B. Mahalakshmi', NULL, 'software', NULL, true);

INSERT INTO public.subjects_taught (subject_name, level, year_from, is_visible) VALUES
  ('System Programming', 'UG', 2005, true),
  ('Data Analytics',     'UG', NULL, true),
  ('Data Science',       'UG', NULL, true);

-- Programs & courses (academic catalog)
INSERT INTO public.programs (name, level, sort_order, is_visible) VALUES
  ('B.Tech Computer Engineering', 'UG', 1, true),
  ('M.E. Computer Engineering',  'PG', 2, true);

INSERT INTO public.courses (program_id, code, name, credits, sort_order, is_visible)
SELECT p.id, '310501', 'Data Science', 3, 1, true
FROM public.programs p WHERE p.name = 'B.Tech Computer Engineering' LIMIT 1;

INSERT INTO public.courses (program_id, code, name, credits, sort_order, is_visible)
SELECT p.id, '410602', 'Machine Learning', 4, 2, true
FROM public.programs p WHERE p.name = 'M.E. Computer Engineering' LIMIT 1;

INSERT INTO public.study_materials (
  title, subject, description, material_type, year, sort_order, file_url, external_url, academic_term, is_visible
) VALUES
  (
    'Data Structures – Notes (sample)',
    'Data Structures',
    'Core concepts and problem sets for the UG course.',
    'notes',
    2024,
    1,
    NULL,
    NULL,
    'Semester I — 2024–25',
    true
  ),
  (
    'ML Lab manual (sample)',
    'Machine Learning',
    'Hands-on exercises; upload file_url in admin when ready.',
    'lab',
    2024,
    2,
    NULL,
    NULL,
    'Semester II — 2024–25',
    true
  ),
  (
    'Course overview slides (sample)',
    'Data Science',
    'Intro deck — link out or host PDF in Storage.',
    'slides',
    2024,
    3,
    NULL,
    'https://example.edu/data-science-overview',
    'Semester I — 2024–25',
    true
  );

INSERT INTO public.projects_guided (title, students, level, year, description, technologies, is_visible) VALUES
  ('Smart attendance using CV (sample)', 'Student A, Student B', 'UG', 2024, 'Capstone-style project; edit in admin.', 'Python, OpenCV', true),
  ('Healthcare analytics dashboard (sample)', 'Student C', 'PG', 2023, 'PG project sample row.', 'React, Supabase', true);

INSERT INTO public.project_artifacts (project_id, title, artifact_type, sort_order, is_visible)
SELECT id, 'Presentation deck (sample)', 'slides', 1, true FROM public.projects_guided ORDER BY created_at DESC LIMIT 1;

INSERT INTO public.project_artifacts (project_id, title, artifact_type, sort_order, is_visible)
SELECT id, 'Source repository (sample)', 'code', 2, true FROM public.projects_guided ORDER BY created_at ASC LIMIT 1;

INSERT INTO public.assessments (title, assessment_type, subject_hint, description, year, sort_order, is_visible) VALUES
  ('In-semester assessment — Data Structures (sample)', 'quiz', 'Data Structures', 'Short answer + MCQ; attach file in admin when ready.', 2024, 1, true),
  ('Mini-project — ML pipeline (sample)', 'project', 'Machine Learning', 'End-to-end data prep and model evaluation.', 2024, 2, true);

INSERT INTO public.assessments (title, assessment_type, course_id, description, year, sort_order, is_visible)
SELECT
  'Term work — Data Science module (sample)',
  'assignment',
  c.id,
  'Linked to catalog course row; add rubric URL as needed.',
  2024,
  3,
  true
FROM public.courses c WHERE c.code = '310501' LIMIT 1;

INSERT INTO public.activities (activity_type, title, organizer, venue, year, role, is_visible) VALUES
  ('workshop_organized', 'Seminar on Overseas Education Awareness', 'PCCOE', 'PCCOE, Pune', 2012, 'Coordinator', true),
  ('workshop_organized', 'Seminar on TOEFL Scholarship Program & Knowledge Sharing Session', 'PCCOE', 'PCCOE, Pune', 2012, 'Co-coordinator', true),
  ('guest_lecture', 'ICCUBEA-2017 – Paper Presentation', 'PCCOE', 'PCCOE, Pune', 2017, 'Author/Presenter', true);

INSERT INTO public.memberships (organization, membership_type, membership_id, year_joined, is_visible) VALUES
  ('IEEE / ACM (sample)', 'Professional member', NULL, 2010, true);

INSERT INTO public.admin_roles (role, scope, institution, year_from, is_visible) VALUES
  ('Internal Member, Board of Studies (BoS) – Computer Engineering', 'Department', 'PCCOE', 2022, true),
  ('Higher Studies Cell Coordinator', 'Department', 'PCCOE', 2012, true),
  ('Member, Faculty Development Wing (FDW) Activities', 'Institute', 'PCCOE', NULL, true),
  ('Examiner / Paper Setter', 'University', 'SPPU', NULL, true);

-- Optional: set logo when you have a URL
-- UPDATE public.profile SET institution_logo_url = 'https://…/logo.png' WHERE id = (SELECT id FROM public.profile LIMIT 1);
