export default function CTA({ headline, subtitle, phone }) {
  return (
    <section className="cta-banner">
      <div className="container">
        <h2>{headline}</h2>
        {subtitle && <p>{subtitle}</p>}
        <div className="hero-actions">
          <a href={`tel:${phone}`} className="btn btn-primary">
            📞 Call {phone}
          </a>
          <a href="/contact" className="btn btn-outline">
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}
