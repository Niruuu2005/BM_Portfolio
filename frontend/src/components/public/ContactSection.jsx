import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import SectionHeader from '@/components/shared/SectionHeader'

const ContactSection = () => {
  const { data: profile } = useProfile()

  const cards = [
    { icon: Mail,     label: 'Email',        value: profile?.email,        href: profile?.email ? `mailto:${profile.email}` : null },
    { icon: Phone,    label: 'Phone',        value: profile?.phone,        href: profile?.phone ? `tel:${profile.phone}` : null },
    { icon: MapPin,   label: 'Address',      value: profile?.address,      href: null },
    { icon: ExternalLink, label: 'Institution', value: profile?.institution, href: profile?.institution_url || null },
  ].filter((c) => c.value)

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader title="Contact" subtitle="Get in Touch" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
          {cards.map(({ icon: Icon, label, value, href }, idx) => (
            <motion.div
              key={label}
              className="contact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="contact-card__icon">
                <Icon size={24} color="var(--color-accent)" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-2)' }}>{label}</h4>
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                   style={{ color: 'var(--color-accent)', wordBreak: 'break-word' }}>
                  {value}
                </a>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', wordBreak: 'break-word' }}>{value}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
          <p style={{ marginBottom: 'var(--space-2)' }}>
            {profile?.department && <><strong style={{ color: 'var(--color-text)' }}>{profile.department}</strong><br /></>}
            {profile?.institution}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
