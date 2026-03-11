import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { useResearchAreas } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'

const AboutSection = () => {
  const { data: profile }       = useProfile()
  const { data: areas = [] }    = useResearchAreas()

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader title="About Me" subtitle="Introduction" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'start' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {profile?.bio && (
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                {profile.bio}
              </p>
            )}
            {profile?.career_obj && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-3)' }}>Career Objective</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                  {profile.career_obj}
                </p>
              </>
            )}

            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-4)' }}>Academic Profiles</h3>
            <div className="hero__links">
              {profile?.scholar_url  && <a href={profile.scholar_url}  target="_blank" rel="noreferrer" className="profile-badge">Google Scholar</a>}
              {profile?.scopus_url   && <a href={profile.scopus_url}   target="_blank" rel="noreferrer" className="profile-badge">Scopus</a>}
              {profile?.orcid_url    && <a href={profile.orcid_url}    target="_blank" rel="noreferrer" className="profile-badge">ORCID</a>}
              {profile?.wos_url      && <a href={profile.wos_url}      target="_blank" rel="noreferrer" className="profile-badge">Web of Science</a>}
              {profile?.researchgate_url && <a href={profile.researchgate_url} target="_blank" rel="noreferrer" className="profile-badge">ResearchGate</a>}
              {profile?.publons_url  && <a href={profile.publons_url}  target="_blank" rel="noreferrer" className="profile-badge">Publons</a>}
              {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="profile-badge">LinkedIn</a>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-6)' }}>Research Interests</h3>
            <div className="research-areas-grid">
              {areas.map((area) => (
                <div key={area.id} className="research-area-card">
                  <div className="research-area-icon">{area.icon || '🔬'}</div>
                  <div className="research-area-name">{area.name}</div>
                </div>
              ))}
              {areas.length === 0 && (
                <>
                  {['📊 Data Analytics','🤖 Machine Learning','💓 Biomedical Signal Processing','🏥 Medical Image Analysis','👁️ Computer Vision','💻 System Programming'].map((a) => (
                    <div key={a} className="research-area-card">
                      <div className="research-area-icon">{a.split(' ')[0]}</div>
                      <div className="research-area-name">{a.split(' ').slice(1).join(' ')}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
