import config from "../../data/example-plumber.json";

export default function AboutPage() {
  const { business_name, city, service_category, service_area, brand_colors } = config;

  return (
    <>
      <section className="hero" style={{ backgroundColor: brand_colors.primary }}>
        <div className="container">
          <h2>About {business_name}</h2>
        </div>
      </section>
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <p>
            {business_name} has been proudly serving {city} and the greater {service_area} area
            with professional {service_category.toLowerCase()} services.
          </p>
        </div>
      </section>
    </>
  );
}
