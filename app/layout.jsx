import config from '../data/example-plumber.json';
import Footer from './components/Footer';
import Header from './components/Header';
import './globals.css';

export const metadata = {
  title: `${config.business_name} | ${config.service_category} in ${config.city}`,
  description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}. Call ${config.phone} for fast, reliable service.`,
  keywords: `${config.service_category.toLowerCase()}, ${config.city}, ${config.service_area}, ${config.services_list.join(', ').toLowerCase()}`,
  openGraph: {
    title: `${config.business_name} | ${config.service_category} in ${config.city}`,
    description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}. Call ${config.phone}.`,
    type: 'website',
    locale: 'en_US'
  },
  robots: { index: true, follow: true }
};

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: config.business_name,
  telephone: config.phone,
  email: config.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: config.address,
    addressLocality: config.city,
    addressRegion: 'FL',
    addressCountry: 'US'
  },
  areaServed: config.service_area,
  description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}.`
};

export default function RootLayout({ children }) {
  const cssVars = {
    '--color-primary': config.brand_colors.primary,
    '--color-primary-dd': `${config.brand_colors.primary}dd`,
    '--color-primary-light': `${config.brand_colors.primary}11`,
    '--color-accent': config.brand_colors.accent,
    '--color-accent-light': `${config.brand_colors.accent}12`
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body style={cssVars}>
        <Header
          business_name={config.business_name}
          phone={config.phone}
          service_category={config.service_category}
          services_list={config.services_list}
          service_area={config.service_area}
          address={config.address}
          email={config.email}
          year={config.current_year}
        />
        <main>{children}</main>
        <Footer
          business_name={config.business_name}
          year={config.current_year}
          service_category={config.service_category}
          service_area={config.service_area}
          services_list={config.services_list}
          phone={config.phone}
          email={config.email}
          address={config.address}
        />
      </body>
    </html>
  );
}
