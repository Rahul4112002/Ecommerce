import { HomeContent } from "@/components/home/home-content";
import { FeaturedProducts } from "@/components/home";

export default function HomePage() {
  return (
    <HomeContent
      bestsellersSection={
        <FeaturedProducts
          title="Bestsellers"
          subtitle="Our most popular frames loved by customers"
          viewAllLink="/products?sort=popular"
        />
      }
      newArrivalsSection={
        <FeaturedProducts
          title="New Arrivals"
          subtitle="Check out our latest frame collections"
          viewAllLink="/products?sort=newest"
        />
      }
    />
  );
}
