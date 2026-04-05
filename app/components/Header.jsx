import Link from 'next/link';

export default function Header({ business_name, phone }) {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          {business_name}
        </Link>
        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a href={`tel:${phone}`} className="nav-cta">
            {phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
