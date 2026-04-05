import config from "../../data/example-plumber.json";

export default function ContactPage() {
  const { business_name, phone, email, address, brand_colors } = config;

  return (
    <>
      <section className="hero" style={{ backgroundColor: brand_colors.primary }}>
        <div className="container">
          <h2>Contact {business_name}</h2>
        </div>
      </section>
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <p><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></p>
          <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
          <p><strong>Address:</strong> {address}</p>
        </div>
      </section>
    </>
  );
}
