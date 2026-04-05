const SERVICE_ICONS = [
  '🔧',
  '🔍',
  '🔥',
  '🛠️',
  '🚨',
  '💧',
  '⚡',
  '🏠',
  '🪛',
  '✅'
];

export default function ServicesGrid({
  services_list,
  city,
  sectionLabel,
  sectionTitle,
  sectionSubtitle,
  alt
}) {
  return (
    <section className={`section${alt ? ' section-alt' : ''}`}>
      <div className="container">
        {sectionTitle && (
          <div className="section-header">
            {sectionLabel && (
              <span className="section-label">{sectionLabel}</span>
            )}
            <h2 className="section-title">{sectionTitle}</h2>
            {sectionSubtitle && (
              <p className="section-subtitle">{sectionSubtitle}</p>
            )}
          </div>
        )}
        <div className="service-grid">
          {services_list.map((service, i) => (
            <div key={service} className="service-card">
              <div className="service-icon">
                {SERVICE_ICONS[i % SERVICE_ICONS.length]}
              </div>
              <h4>{service}</h4>
              <p>
                Professional {service.toLowerCase()} services for homes and
                businesses in {city}.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
