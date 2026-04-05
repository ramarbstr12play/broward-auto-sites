import Link from "next/link";
import siteData from "@/data/example-plumber.json";

export default function Footer() {
  const { footer, business } = siteData;

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            {business.name}
          </h3>
          <p className="text-sm leading-relaxed">
            {business.address.street}
            <br />
            {business.address.city}, {business.address.state}{" "}
            {business.address.zip}
          </p>
          <p className="text-sm mt-2">License #{business.license}</p>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {footer.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Contact</h3>
          <p className="text-sm">
            <a
              href={`tel:${business.phone.replace(/\D/g, "")}`}
              className="hover:text-white transition-colors"
            >
              {business.phone}
            </a>
          </p>
          <p className="text-sm mt-1">
            <a
              href={`mailto:${business.email}`}
              className="hover:text-white transition-colors"
            >
              {business.email}
            </a>
          </p>
          <p className="text-sm mt-2">{business.hours}</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-sm">
        {footer.text}
      </div>
    </footer>
  );
}
