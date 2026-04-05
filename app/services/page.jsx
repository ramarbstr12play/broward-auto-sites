import config from "../../data/example-plumber.json";

export default function ServicesPage() {
  const { services_list, city, service_category, brand_colors } = config;

  return (
    <>
      <section className="hero" style={{ backgroundColor: brand_colors.primary }}>
        <div className="container">
          <h2>Our {service_category} Services</h2>
          <p>Professional solutions for homes and businesses in {city}.</p>
        </div>
      </section>
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <div className="service-grid">
            {services_list.map((service) => (
              <div className="service-card" key={service}>
                <h4>{service}</h4>
                <p>Professional {service.toLowerCase()} services in {city} and surrounding areas.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
