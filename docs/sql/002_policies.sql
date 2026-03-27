-- BM Portfolio — RLS policies (run after 001_schema.sql)
-- Writes allowed only for users listed in public.app_admins (see npm run create-admin).

CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_app_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_app_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_app_admin() TO anon;

-- Enable RLS
ALTER TABLE public.profile            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_areas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_grants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patents            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copyrights         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects_taught    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_guided    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_artifacts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_admins         ENABLE ROW LEVEL SECURITY;

-- app_admins: no direct client access (only service role / dashboard maintenance)
CREATE POLICY app_admins_service_only ON public.app_admins FOR ALL USING (false) WITH CHECK (false);

-- Helper macro pattern: public read visible + full access for app admins
-- PROFILE: full row public read (single-row site config)
CREATE POLICY profile_select ON public.profile FOR SELECT USING (true);
CREATE POLICY profile_write  ON public.profile FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY education_select ON public.education FOR SELECT USING (is_visible = true);
CREATE POLICY education_write  ON public.education FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY experience_select ON public.experience FOR SELECT USING (is_visible = true);
CREATE POLICY experience_write  ON public.experience FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY research_areas_select ON public.research_areas FOR SELECT USING (is_visible = true);
CREATE POLICY research_areas_write  ON public.research_areas FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY awards_select ON public.awards FOR SELECT USING (is_visible = true);
CREATE POLICY awards_write  ON public.awards FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY research_grants_select ON public.research_grants FOR SELECT USING (is_visible = true);
CREATE POLICY research_grants_write  ON public.research_grants FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY publications_select ON public.publications FOR SELECT USING (is_visible = true);
CREATE POLICY publications_write  ON public.publications FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY patents_select ON public.patents FOR SELECT USING (is_visible = true);
CREATE POLICY patents_write  ON public.patents FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY copyrights_select ON public.copyrights FOR SELECT USING (is_visible = true);
CREATE POLICY copyrights_write  ON public.copyrights FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY subjects_taught_select ON public.subjects_taught FOR SELECT USING (is_visible = true);
CREATE POLICY subjects_taught_write  ON public.subjects_taught FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY programs_select ON public.programs FOR SELECT USING (is_visible = true);
CREATE POLICY programs_write  ON public.programs FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY courses_select ON public.courses FOR SELECT USING (is_visible = true);
CREATE POLICY courses_write  ON public.courses FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY study_materials_select ON public.study_materials FOR SELECT USING (is_visible = true);
CREATE POLICY study_materials_write  ON public.study_materials FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY projects_guided_select ON public.projects_guided FOR SELECT USING (is_visible = true);
CREATE POLICY projects_guided_write  ON public.projects_guided FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY project_artifacts_select ON public.project_artifacts FOR SELECT USING (is_visible = true);
CREATE POLICY project_artifacts_write  ON public.project_artifacts FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY assessments_select ON public.assessments FOR SELECT USING (is_visible = true);
CREATE POLICY assessments_write  ON public.assessments FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY activities_select ON public.activities FOR SELECT USING (is_visible = true);
CREATE POLICY activities_write  ON public.activities FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY memberships_select ON public.memberships FOR SELECT USING (is_visible = true);
CREATE POLICY memberships_write  ON public.memberships FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE POLICY admin_roles_select ON public.admin_roles FOR SELECT USING (is_visible = true);
CREATE POLICY admin_roles_write  ON public.admin_roles FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
