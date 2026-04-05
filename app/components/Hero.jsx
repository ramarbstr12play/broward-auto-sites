export default function Hero({ service_category, city, phone, primaryColor, accentColor }) {
  return (
    <section className="hero" style={{ backgroundColor: primaryColor }}>
      <div className="container">
        <h2>Reliable {service_category} in {city}</h2>
        <p>Trusted by homeowners and businesses across Broward County.</p>
        <div>
          <a href={`tel:${phone}`} className="btn-primary" style={{ backgroundColor: accentColor }}>
            Call Now
          </a>
          <a href="/contact" className="btn-secondary" style={{ border: "2px solid #fff", color: "#fff" }}>
            Get a Free Quote
          </a>
        </div>
      </div>
    </section>
  );
}
