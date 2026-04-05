import config from '../data/example-plumber.json';
import CTA from './components/CTA';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';

export default function Home() {
  const { city, service_category, services_list, phone, service_area } = config;

  return (
    <>
      <Hero
        badge={`Trusted ${service_category} Professionals`}
        title={
          <>
            Reliable {service_category} Services
            <br />
            in {city}
          </>
        }
        subtitle={`Trusted by homeowners and businesses across ${service_area} for fast, professional, and affordable ${service_category.toLowerCase()} solutions.`}
        phone={phone}
      />

      <section className="section">
        <div className="container">
          <div className="stats-bar">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Jobs Completed</p>
            </div>
            <div className="stat-item">
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <h3>4.9★</h3>
              <p>Customer Rating</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Emergency Service</p>
            </div>
          </div>
        </div>
      </section>

      <ServicesGrid
        services_list={services_list}
        city={city}
        sectionLabel="What We Do"
        sectionTitle={`Our ${service_category} Services`}
        sectionSubtitle={`From routine maintenance to emergency repairs, we deliver professional ${service_category.toLowerCase()} solutions you can count on.`}
        alt
      />

      <section className="section">
        <div className="container">
          <div className="why-grid">
            <div>
              <span className="section-label">Why Choose Us</span>
              <h2 className="section-title">
                The {service_area} Team You Can Trust
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 32 }}>
                We combine years of experience with genuine care for every
                customer.
              </p>
              <ul className="why-list">
                <li>
                  <span className="why-check">✓</span>
                  <div>
                    <h4>Licensed &amp; Insured</h4>
                    <p>Fully certified professionals for your peace of mind.</p>
                  </div>
                </li>
                <li>
                  <span className="why-check">✓</span>
                  <div>
                    <h4>Upfront Pricing</h4>
                    <p>Transparent quotes with no hidden fees or surprises.</p>
                  </div>
                </li>
                <li>
                  <span className="why-check">✓</span>
                  <div>
                    <h4>Fast Response Times</h4>
                    <p>We arrive quickly because your time matters.</p>
                  </div>
                </li>
                <li>
                  <span className="why-check">✓</span>
                  <div>
                    <h4>Satisfaction Guaranteed</h4>
                    <p>We stand behind every job we complete.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="why-image-area">
              <div className="big-stat">15+</div>
              <div className="big-stat-label">
                Years proudly serving
                <br />
                <strong>{service_area}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA
        headline={`Need ${service_category} Help Today?`}
        subtitle={`Don't wait — call now for fast, reliable service across ${service_area}.`}
        phone={phone}
      />
    </>
  );
}
