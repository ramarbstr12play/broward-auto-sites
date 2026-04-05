export default function ServicesGrid({ services_list, city }) {
  return (
    <section style={{ padding: "48px 0" }}>
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Our Services in {city}</h2>
        <div className="service-grid">
          {services_list.map((service) => (
            <div key={service} className="service-card">
              <h3>{service}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
