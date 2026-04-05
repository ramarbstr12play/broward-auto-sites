import config from "../../data/example-plumber.json";

export const metadata = {
  title: `Contact | ${config.business_name}`,
  description: `Contact ${config.business_name} for ${config.service_category.toLowerCase()} services in ${config.service_area}. Call ${config.phone}.`,
};

export default function ContactPage() {
  const { business_name, phone, email, address, brand_colors, service_category, service_area } = config;

  return (
    <>
      <section className="hero" style={{ backgroundColor: brand_colors.primary }}>
        <div className="container">
          <h2>Contact {business_name}</h2>
          <p>Ready to schedule service? Get in touch today.</p>
        </div>
      </section>

      <section style={{ padding: "48px 0" }}>
        <div className="container contact-grid">
          <div>
            <h3>Get In Touch</h3>
            <div className="contact-info">
              <div>
                <strong>Phone</strong>
                <p><a href={`tel:${phone}`}>{phone}</a></p>
              </div>
              <div>
                <strong>Email</strong>
                <p><a href={`mailto:${email}`}>{email}</a></p>
              </div>
              <div>
                <strong>Address</strong>
                <p>{address}</p>
              </div>
              <div>
                <strong>Service Area</strong>
                <p>{service_area}</p>
              </div>
            </div>
          </div>

          <div>
            <h3>Send a Message</h3>
            <form className="contact-form">
              <label>
                Name
                <input type="text" name="name" required />
              </label>
              <label>
                Phone
                <input type="tel" name="phone" required />
              </label>
              <label>
                Email
                <input type="email" name="email" />
              </label>
              <label>
                Message
                <textarea name="message" rows={4} required></textarea>
              </label>
              <button type="submit" className="btn-primary" style={{ backgroundColor: brand_colors.primary, color: "#fff", border: "none", cursor: "pointer" }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
