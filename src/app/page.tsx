import { HomeContent } from "@/components/home/home-content";
import { FeaturedProducts } from "@/components/home";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

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
    </>
  );
}
