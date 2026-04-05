import config from '../../data/example-plumber.json';
import CTA from '../components/CTA';
import Hero from '../components/Hero';

export const metadata = {
  title: `About | ${config.business_name}`,
  description: `Learn about ${config.business_name}, your trusted ${config.service_category.toLowerCase()} professionals in ${config.service_area}.`
};

export default function AboutPage() {
  const { business_name, city, service_category, service_area, phone } = config;

  return (
    <>
      <Hero
        badge="Our Story"
        title={`About ${business_name}`}
        subtitle={`Providing professional ${service_category.toLowerCase()} services that ${service_area} residents count on.`}
        showActions={false}
      />

      <section className="section">
        <div className="container">
          <div className="why-grid">
            <div>
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">
                Your Local {service_category} Experts
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 24 }}>
                {business_name} has been proudly serving {city} and the greater{' '}
                {service_area} area with professional{' '}
                {service_category.toLowerCase()} services. Our team is committed
                to quality workmanship, transparent pricing, and exceptional
                customer care.
              </p>
              <p className="section-subtitle">
                Whether it&apos;s a routine job or an urgent repair, we treat
                every project with the same dedication and expertise. Your
                satisfaction is our top priority.
              </p>
            </div>
            <div className="why-image-area">
              <div className="big-stat">15+</div>
              <div className="big-stat-label">
                Years of trusted service
                <br />
                in <strong>{service_area}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">What Sets Us Apart</h2>
            <p className="section-subtitle">
              We hold ourselves to the highest standards on every single job.
            </p>
          </div>
          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">🛡️</div>
              <h4>Licensed &amp; Insured</h4>
              <p>
                Fully licensed, bonded, and insured professionals for your
                complete peace of mind.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">💰</div>
              <h4>Upfront Pricing</h4>
              <p>
                Transparent quotes before work begins — no hidden fees, no
                surprises on your bill.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">⚡</div>
              <h4>Fast Response</h4>
              <p>
                Quick arrival times because we know your time is valuable and
                problems can&apos;t wait.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">⭐</div>
              <h4>Satisfaction Guaranteed</h4>
              <p>
                We stand behind every job with a 100% satisfaction guarantee.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏠</div>
              <h4>Locally Owned</h4>
              <p>
                A local business that cares about our {service_area} neighbors
                and community.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🕐</div>
              <h4>Emergency Service</h4>
              <p>
                Available when you need us most — 24/7 emergency{' '}
                {service_category.toLowerCase()} support.
              </p>
            </div>
          </div>
        </div>
      </section>

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
              <h3>100%</h3>
              <p>Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      <CTA
        headline="Ready to Work With the Best?"
        subtitle={`Join hundreds of satisfied customers in ${service_area}.`}
        phone={phone}
      />
    </>
  );
}
