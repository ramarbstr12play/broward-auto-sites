import config from "../../data/example-plumber.json";

export const metadata = {
  title: `Services | ${config.business_name}`,
  description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}: ${config.services_list.join(", ")}.`,
};

export default function ServicesPage() {
  const { services_list, city, service_category, phone, brand_colors } = config;

  return (
    <>
      <section className="hero" style={{ backgroundColor: brand_colors.primary }}>
        <div className="container">
          <h2>Our {service_category} Services</h2>
          <p>Professional solutions for homes and businesses in {city} and across {config.service_area}.</p>
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

      <section className="cta-section" style={{ backgroundColor: brand_colors.accent }}>
        <div className="container" style={{ textAlign: "center", padding: "48px 0" }}>
          <h3>Need {service_category} Help?</h3>
          <p>Fast response times across {config.service_area}.</p>
          <a href={`tel:${phone}`} className="btn-primary" style={{ backgroundColor: brand_colors.primary }}>
            Call {phone}
          </a>
        </div>
      </section>
    </>
  );
}
