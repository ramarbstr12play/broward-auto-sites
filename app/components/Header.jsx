import Link from "next/link";
import siteData from "@/data/example-plumber.json";

export default function Header() {
  const { business } = siteData;

  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {business.name}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <Link
            href="/services"
            className="hover:text-accent transition-colors"
          >
            Services
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            Contact
          </Link>
        </nav>
        <a
          href={`tel:${business.phone.replace(/\D/g, "")}`}
          className="bg-accent text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors"
        >
          {business.phone}
        </a>
      </div>
    </header>
  );
}
