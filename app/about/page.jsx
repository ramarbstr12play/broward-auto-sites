import config from "../../data/example-plumber.json";

export const metadata = {
  title: `About | ${config.business_name}`,
  description: `Learn about ${config.business_name}, your trusted ${config.service_category.toLowerCase()} professionals in ${config.service_area}.`,
};

export default function AboutPage() {
  const { business_name, city, service_category, service_area, brand_colors, phone } = config;

  return (
    <>
      <section className="hero" style={{ backgroundColor: brand_colors.primary }}>
        <div className="container">
          <h2>About {business_name}</h2>
        </div>
      </section>

      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "2rem" }}>
            {business_name} has been proudly serving {city} and the greater {service_area} area
            with professional {service_category.toLowerCase()} services. Our team of licensed
            professionals is committed to delivering quality workmanship and outstanding customer
            service on every job.
          </p>

          <h3>Why Choose Us</h3>
          <ul className="highlights-list">
            <li>Licensed &amp; Insured Professionals</li>
            <li>Upfront Pricing — No Hidden Fees</li>
            <li>Fast Response Times</li>
            <li>Satisfaction Guaranteed</li>
            <li>Locally Owned &amp; Operated</li>
          </ul>

          <h3 style={{ marginTop: "2rem" }}>Service Area</h3>
          <p>We serve {city} and communities throughout {service_area}.</p>
        </div>
      </section>

      <section className="cta-section" style={{ backgroundColor: brand_colors.accent }}>
        <div className="container" style={{ textAlign: "center", padding: "48px 0" }}>
          <h3>Ready to Get Started?</h3>
          <a href={`tel:${phone}`} className="btn-primary" style={{ backgroundColor: brand_colors.primary }}>
            Call {phone}
          </a>
        </div>
      </section>
    </>
  );
}
