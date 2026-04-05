export default function Hero({ service_category, city, phone, primaryColor, accentColor }) {
  return (
    <section className="hero" style={{ background: primaryColor || "#004AAD" }}>
      <div className="container">
        <h1>Professional {service_category} in {city}</h1>
        <p style={{ fontSize: "1.2rem", margin: "16px 0 24px" }}>
          Trusted local {service_category.toLowerCase()} experts serving {city} and surrounding areas.
        </p>
        <a
          href={`tel:${phone.replace(/\D/g, "")}`}
          className="btn-primary"
          style={{ background: accentColor || "#FF7A00", color: "#fff" }}
        >
          Call Now &mdash; {phone}
        </a>
      </div>
    </section>
  );
}
