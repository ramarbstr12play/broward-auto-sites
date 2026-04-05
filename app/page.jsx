import Hero from "./components/Hero";
import ServicesGrid from "./components/ServicesGrid";
import config from "../data/example-plumber.json";

export default function Home() {
  const {
    city,
    service_category,
    services_list,
    phone,
    brand_colors,
  } = config;

  return (
    <>
      <Hero
        service_category={service_category}
        city={city}
        phone={phone}
        primaryColor={brand_colors.primary}
        accentColor={brand_colors.accent}
      />
      <ServicesGrid services_list={services_list} city={city} />
    </>
  );
}
