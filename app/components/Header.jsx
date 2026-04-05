import Link from "next/link";

export default function Header({ business_name }) {
  return (
    <header>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontWeight: "bold", fontSize: "1.25rem", textDecoration: "none", color: "inherit" }}>
          {business_name}
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
