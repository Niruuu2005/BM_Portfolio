const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    {subtitle && <span className="section-subtitle">{subtitle}</span>}
    <h2 className="section-title">{title}</h2>
  </div>
)

export default SectionHeader
