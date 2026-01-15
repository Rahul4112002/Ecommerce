import {
  HeroSection,
  CategoriesSection,
  FeaturedProducts,
  TestimonialsSection
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Banner */}
      <HeroSection />

      {/* Shop by Category */}
      <CategoriesSection />

      {/* Bestsellers */}
      <FeaturedProducts
        title="Bestsellers"
        subtitle="Our most popular frames loved by customers"
        viewAllLink="/products?sort=popular"
      />

      {/* New Arrivals */}
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Check out our latest frame collections"
        viewAllLink="/products?sort=newest"
      />

      {/* Customer Testimonials */}
      <TestimonialsSection />
    </>
  );
}
