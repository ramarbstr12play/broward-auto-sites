export default function Hero({
  badge,
  title,
  subtitle,
  phone,
  showActions = true
}) {
  return (
    <section className="hero">
      <div className="container">
        {badge && <span className="hero-badge">{badge}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {showActions && phone && (
          <div className="hero-actions">
            <a href={`tel:${phone}`} className="btn btn-primary">
              📞 {phone}
            </a>
            <a href="/contact" className="btn btn-outline">
              Get a Free Quote
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
