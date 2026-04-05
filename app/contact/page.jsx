import config from '../../data/example-plumber.json';
import Hero from '../components/Hero';

export const metadata = {
  title: `Contact | ${config.business_name}`,
  description: `Contact ${config.business_name} for ${config.service_category.toLowerCase()} services in ${config.service_area}. Call ${config.phone}.`
};

export default function ContactPage() {
  const {
    business_name,
    phone,
    email,
    address,
    service_category,
    service_area,
    services_list
  } = config;

  return (
    <>
      <Hero
        badge="Get In Touch"
        title={`Contact ${business_name}`}
        subtitle="Ready to schedule service? We'd love to hear from you. Reach out today for a free estimate."
        showActions={false}
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info-card">
            <h3>Let&apos;s Talk</h3>
            <p>
              We&apos;re here to help with all your{' '}
              {service_category.toLowerCase()} needs in {service_area}.
            </p>
            <div className="contact-detail">
              <div className="contact-detail-icon">📞</div>
              <div>
                <p>Phone</p>
                <p>
                  <a href={`tel:${phone}`}>{phone}</a>
                </p>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">✉️</div>
              <div>
                <p>Email</p>
                <p>
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">📍</div>
              <div>
                <p>Address</p>
                <p>{address}</p>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">🗺️</div>
              <div>
                <p>Service Area</p>
                <p>{service_area}</p>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h3>Send Us a Message</h3>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(954) 555-0000"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="service">Service Needed</label>
                <input
                  type="text"
                  id="service"
                  name="service"
                  placeholder={`e.g. ${services_list[0]}`}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your project..."
                  required
                />
              </div>
              <button type="submit" className="form-submit">
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
