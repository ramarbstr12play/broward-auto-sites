export default function ServicesGrid({ services_list, city }) {
  return (
    <section>
      <div className="container">
        <h3>Our Services</h3>
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
  );
}
