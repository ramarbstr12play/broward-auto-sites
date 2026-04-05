import Link from 'next/link';

export default function Footer({
  business_name,
  year,
  service_category,
  service_area,
  services_list,
  phone,
  email,
  address
}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo">{business_name}</span>
            <p>
              Professional {service_category?.toLowerCase()} services proudly
              serving {service_area}.
            </p>
          </div>
          <div className="footer-col">
            <h4>Pages</h4>
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            {services_list?.slice(0, 4).map((s) => (
              <Link href="/services" key={s}>
                {s}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href={`tel:${phone}`}>{phone}</a>
            <a href={`mailto:${email}`}>{email}</a>
            <span
              style={{ display: 'block', fontSize: '0.9rem', padding: '4px 0' }}
            >
              {address}
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            &copy; {year || new Date().getFullYear()} {business_name}. All
            rights reserved.
          </span>
          <span>Serving {service_area}</span>
        </div>
      </div>
    </footer>
  );
}
