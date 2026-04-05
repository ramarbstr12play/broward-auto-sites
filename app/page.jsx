import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ServicesGrid from "./components/ServicesGrid";
import config from "../data/example-plumber.json";

export default function Home() {
  const {
    business_name,
    city,
    service_category,
    services_list,
    phone,
    brand_colors,
    current_year
  } = config;

  return (
    <>
      <Header business_name={business_name} />
      <Hero
        service_category={service_category}
        city={city}
        phone={phone}
        primaryColor={brand_colors.primary}
        accentColor={brand_colors.accent}
      />
      <ServicesGrid services_list={services_list} city={city} />
      <Footer business_name={business_name} year={current_year} />
    </>
  );
}
