import SectionHeader from '@/components/shared/SectionHeader'
import PatentsCopyrightsPanel from '@/components/public/PatentsCopyrightsPanel'

const PatentsSection = () => (
  <section id="patents" className="section section--alt">
    <div className="container">
      <SectionHeader title="Patents & Copyrights" subtitle="Intellectual Property" />
      <PatentsCopyrightsPanel />
    </div>
  </section>
)

export default PatentsSection
