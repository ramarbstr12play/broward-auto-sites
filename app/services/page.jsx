import config from '../../data/example-plumber.json';
import CTA from '../components/CTA';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';

export const metadata = {
  title: `Services | ${config.business_name}`,
  description: `Professional ${config.service_category.toLowerCase()} services in ${config.service_area}: ${config.services_list.join(', ')}.`
};

export default function ServicesPage() {
  const { services_list, city, service_category, phone, service_area } = config;

  return (
    <>
      <Hero
        badge="Our Expertise"
        title={`Our ${service_category} Services`}
        subtitle={`Comprehensive ${service_category.toLowerCase()} solutions for residential and commercial properties across ${service_area}.`}
        showActions={false}
      />

      <ServicesGrid services_list={services_list} city={city} />

      <CTA
        headline="Ready to Get Started?"
        subtitle={`Contact us today for a free estimate on any of our ${service_category.toLowerCase()} services.`}
        phone={phone}
      />
    </>
  );
}
