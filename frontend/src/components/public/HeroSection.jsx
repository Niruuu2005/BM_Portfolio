import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'

const StatCard = ({ number, label }) => (
  <div className="stat-card">
    <span className="stat-number">{number}</span>
    <span className="stat-label">{label}</span>
  </div>
)

const HeroSection = () => {
  const { data: profile, isLoading } = useProfile()

  return (
    <section id="home" className="hero-section">
      <div className="container hero__inner">
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero__greeting">Hello, I&apos;m</span>
          <h1 className="hero__name">
            {isLoading ? 'Loading...' : (profile?.name || 'Mrs. B. Mahalakshmi')}
          </h1>
          <p className="hero__title">
            {profile?.designation || 'Assistant Professor'} · {profile?.department || 'Computer Engineering'}
          </p>
          <p className="hero__institution">{profile?.institution || 'PCCOE, Pune'}</p>
          <p className="hero__tagline">
            {profile?.tagline || 'Empowering learners through Data Science, AI, and over two decades of academic excellence.'}
          </p>

          <div className="hero__actions">
            {profile?.cv_url && (
              <a href={profile.cv_url} target="_blank" rel="noreferrer" className="btn btn-primary">
                📄 Download CV
              </a>
            )}
            <a
              href="#contact"
              className="btn btn-outline"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              📬 Contact Me
            </a>
          </div>

          <div className="hero__links">
            {profile?.scholar_url  && <a href={profile.scholar_url}  target="_blank" rel="noreferrer" className="profile-badge">Scholar</a>}
            {profile?.scopus_url   && <a href={profile.scopus_url}   target="_blank" rel="noreferrer" className="profile-badge">Scopus</a>}
            {profile?.orcid_url    && <a href={profile.orcid_url}    target="_blank" rel="noreferrer" className="profile-badge">ORCID</a>}
            {profile?.wos_url      && <a href={profile.wos_url}      target="_blank" rel="noreferrer" className="profile-badge">Web of Science</a>}
            {profile?.researchgate_url && <a href={profile.researchgate_url} target="_blank" rel="noreferrer" className="profile-badge">ResearchGate</a>}
            {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="profile-badge">LinkedIn</a>}
          </div>
        </motion.div>

        <motion.div
          className="hero__photo-wrap"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt={profile.name} className="hero__photo" />
          ) : (
            <div className="hero__photo-placeholder">👩‍🏫</div>
          )}
        </motion.div>
      </div>

      <div className="container hero__stats">
        <StatCard number="20+" label="Years Experience" />
        <StatCard number="10+"  label="Publications" />
        <StatCard number="5+"   label="Patents" />
        <StatCard number="100+" label="Projects Guided" />
      </div>
    </section>
  )
}

export default HeroSection
