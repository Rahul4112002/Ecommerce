import Link from "next/link";
import { ArrowRight, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { db } from "@/lib/db";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

async function getProducts(sort: string) {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        attributes: true,
        variants: { take: 5 },
      },
      orderBy: sort === "newest" ? { createdAt: "desc" } : { createdAt: "desc" },
      take: 4,
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      image: product.images[0]?.url || null,
      shape: product.attributes?.shape || "",
      colors: product.variants.map((v) => v.colorCode),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function FeaturedProducts({
  title = "Bestsellers",
  subtitle = "Our most popular frames loved by customers",
  viewAllLink = "/products?sort=popular"
}: FeaturedProductsProps) {
  const sort = viewAllLink.includes("newest") ? "newest" : "popular";
  const products = await getProducts(sort);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-950 to-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              {title.split(' ')[0]} <span className="text-gold">{title.split(' ').slice(1).join(' ') || title}</span>
            </h2>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          {products.length > 0 && (
            <Button variant="outline" className="hidden md:flex border-gold/50 text-gold hover:bg-gold/10 hover:border-gold" asChild>
              <Link href={viewAllLink}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Products Grid or Empty State */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  originalPrice={product.comparePrice}
                  image={product.image || "/placeholder-product.jpg"}
                  shape={product.shape}
                  colors={product.colors}
                />
              ))}
            </div>

            {/* Mobile View All */}
            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" className="w-full border-gold/50 text-gold hover:bg-gold/10 hover:border-gold" asChild>
                <Link href={viewAllLink}>
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          /* Empty State - No Products Added */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center">
                <Package className="w-12 h-12 text-gold/60" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-gold animate-pulse" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 text-center">
              Coming Soon!
            </h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Our premium collection is being curated. Products will appear here once added by the admin.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold">Stay tuned for amazing eyewear</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
