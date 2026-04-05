import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import config from "../data/example-plumber.json";

export const metadata = {
  title: `${config.business_name} | ${config.service_category} in ${config.city}`,
  description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}. Call ${config.phone} for fast, reliable service.`,
  keywords: `${config.service_category.toLowerCase()}, ${config.city}, ${config.service_area}, ${config.services_list.join(", ").toLowerCase()}`,
  openGraph: {
    title: `${config.business_name} | ${config.service_category} in ${config.city}`,
    description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}. Call ${config.phone}.`,
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: config.business_name,
  telephone: config.phone,
  email: config.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: config.address,
    addressLocality: config.city,
    addressRegion: "FL",
    addressCountry: "US",
  },
  areaServed: config.service_area,
  description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body>
        <Header business_name={config.business_name} />
        <main>{children}</main>
        <Footer business_name={config.business_name} year={config.current_year} />
      </body>
    </html>
  );
}
