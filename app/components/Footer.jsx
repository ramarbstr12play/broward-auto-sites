import Link from "next/link";

export default function Footer({ business_name, year }) {
  return (
    <footer style={{ background: "#222", color: "#ccc", padding: "32px 0", marginTop: "48px" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <p><strong style={{ color: "#fff" }}>{business_name}</strong></p>
        <nav style={{ margin: "12px 0" }}>
          <Link href="/" style={{ color: "#ccc" }}>Home</Link>
          <Link href="/services" style={{ color: "#ccc" }}>Services</Link>
          <Link href="/about" style={{ color: "#ccc" }}>About</Link>
          <Link href="/contact" style={{ color: "#ccc" }}>Contact</Link>
        </nav>
        <p style={{ fontSize: "0.85rem" }}>&copy; {year || new Date().getFullYear()} {business_name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
