import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { usePublications } from '@/hooks/usePublications'
import { usePatents, useProjects, useExperience } from '@/hooks/useData'
import { profileImageSrc } from '@/lib/driveImageUrl'

const StatCard = ({ number, label, isLoading }) => (
  <div className="stat-card">
    <span className="stat-number">{isLoading ? '—' : number}</span>
    <span className="stat-label">{label}</span>
  </div>
)

const HeroSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
    <div className="skeleton skeleton-line" style={{ width: '45%', height: '2em' }} />
    <div className="skeleton skeleton-line" style={{ width: '70%', height: '1.4em' }} />
    <div className="skeleton skeleton-line" style={{ width: '55%', height: '1em' }} />
    <div className="skeleton skeleton-line" style={{ width: '80%', height: '1em', marginTop: 'var(--space-2)' }} />
  </div>
)

const HeroSection = () => {
  const { data: profile, isLoading: loadingProfile, isError: errorProfile } = useProfile()
  const { data: publications = [], isLoading: loadingPubs }     = usePublications()
  const { data: patents = [],      isLoading: loadingPatents }  = usePatents()
  const { data: projects = [],     isLoading: loadingProjects } = useProjects()
  const { data: experience = [],   isLoading: loadingExp }      = useExperience()

  const yearsExp = (() => {
    if (!experience.length) return null
    const earliest = experience.reduce((min, e) => {
      const yr = e.start_date ? new Date(e.start_date).getFullYear() : null
      return yr && (!min || yr < min) ? yr : min
    }, null)
    if (!earliest) return null
    return new Date().getFullYear() - earliest
  })()

  const statsLoading = loadingPubs || loadingPatents || loadingProjects || loadingExp
  const bioText = profile?.bio || profile?.career_obj || null

  return (
    <section id="home" className="hero-section">
      <div className="container hero__inner">

        {/* ── Left: professor info panel ── */}
        <motion.div
          className="hero__text glass-panel"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Institution badge — logo + college name */}
          {!loadingProfile && (profile?.institution || profile?.institution_logo_url) && (
            <a
              href={profile?.institution_url || '#'}
              target={profile?.institution_url ? '_blank' : undefined}
              rel="noreferrer"
              className="hero__institution-badge"
            >
              {profile?.institution_logo_url && (
                <img
                  src={profile.institution_logo_url}
                  alt={profile.institution || 'Institution logo'}
                  className="hero__college-logo"
                />
              )}
              <span className="hero__college-name-text">
                {profile?.institution || ''}
              </span>
            </a>
          )}

          {/* Profile fetch error */}
          {errorProfile && (
            <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(214,69,69,0.08)', borderRadius: 'var(--radius-md)' }}>
              Could not load profile data. Please try refreshing.
            </p>
          )}

          {loadingProfile ? (
            <HeroSkeleton />
          ) : (
            <>
              <span className="hero__greeting">Hello, I&apos;m</span>
              <h1 className="hero__name">
                {profile?.name || 'Mrs. B. Mahalakshmi'}
              </h1>
              <p className="hero__title">
                {profile?.designation || 'Assistant Professor'}
                {profile?.department ? ` · ${profile.department}` : ''}
              </p>
              <p className="hero__tagline">
                {profile?.tagline || 'Empowering learners through Data Science, AI, and over two decades of academic excellence.'}
              </p>
            </>
          )}

          <div className="hero__actions">
            {profile?.cv_url && (
              <a href={profile.cv_url} target="_blank" rel="noreferrer" className="btn btn-primary">
                📄 Download CV
              </a>
            )}
            <Link to="/contact" className="btn btn-outline">
              📬 Contact Me
            </Link>
          </div>

          <div className="hero__links">
            {profile?.scholar_url      && <a href={profile.scholar_url}      target="_blank" rel="noreferrer" className="profile-badge">Scholar</a>}
            {profile?.scopus_url       && <a href={profile.scopus_url}       target="_blank" rel="noreferrer" className="profile-badge">Scopus</a>}
            {profile?.orcid_url        && <a href={profile.orcid_url}        target="_blank" rel="noreferrer" className="profile-badge">ORCID</a>}
            {profile?.wos_url          && <a href={profile.wos_url}          target="_blank" rel="noreferrer" className="profile-badge">Web of Science</a>}
            {profile?.researchgate_url && <a href={profile.researchgate_url} target="_blank" rel="noreferrer" className="profile-badge">ResearchGate</a>}
            {profile?.linkedin_url     && <a href={profile.linkedin_url}     target="_blank" rel="noreferrer" className="profile-badge">LinkedIn</a>}
          </div>

          {/* Bio / Career Objective — shown when available */}
          {bioText && (
            <div style={{
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-5)',
              borderTop: '1px solid var(--color-border)',
            }}>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.75,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {bioText}
              </p>
            </div>
          )}
        </motion.div>

        {/* ── Right: professor photo with college logo watermark ── */}
        <motion.div
          className="hero__photo-wrap"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {profile?.institution_logo_url && (
            <div className="hero__college-watermark">
              <img src={profileImageSrc(profile.institution_logo_url) || profile.institution_logo_url} alt="" aria-hidden="true" />
            </div>
          )}

          {profile?.photo_url ? (
            <img
              src={profileImageSrc(profile.photo_url) || profile.photo_url}
              alt={profile?.name || 'Profile photo'}
              className="hero__photo"
              loading="lazy"
            />
          ) : (
            <div className="hero__photo-placeholder">👩‍🏫</div>
          )}
        </motion.div>
      </div>

      {/* ── Stat cards ── */}
      <div className="container hero__stats">
        <StatCard
          number={yearsExp ? `${yearsExp}+` : '20+'}
          label="Years Experience"
          isLoading={statsLoading}
        />
        <StatCard
          number={publications.length > 0 ? `${publications.length}+` : '10+'}
          label="Publications"
          isLoading={statsLoading}
        />
        <StatCard
          number={patents.length > 0 ? `${patents.length}+` : '5+'}
          label="Patents"
          isLoading={statsLoading}
        />
        <StatCard
          number={projects.length > 0 ? `${projects.length}+` : '100+'}
          label="Projects Guided"
          isLoading={statsLoading}
        />
      </div>
    </section>
  )
}

export default HeroSection
