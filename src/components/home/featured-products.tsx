import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";

// Sample products data (will be replaced with real data from API)
const sampleProducts = [
  {
    id: "1",
    name: "Classic Aviator Gold",
    slug: "classic-aviator-gold",
    price: 1499,
    comparePrice: 2499,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    shape: "AVIATOR",
    material: "METAL",
    colors: ["#FFD700", "#C0C0C0"],
  },
  {
    id: "2",
    name: "Modern Rectangle Black",
    slug: "modern-rectangle-black",
    price: 999,
    comparePrice: 1599,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400",
    shape: "RECTANGLE",
    material: "ACETATE",
    colors: ["#000000", "#8B4513"],
  },
  {
    id: "3",
    name: "Vintage Round Tortoise",
    slug: "vintage-round-tortoise",
    price: 1299,
    comparePrice: 1999,
    image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400",
    shape: "ROUND",
    material: "ACETATE",
    colors: ["#8B4513", "#000000"],
  },
  {
    id: "4",
    name: "Cat Eye Pink",
    slug: "cat-eye-pink",
    price: 1199,
    comparePrice: 1899,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400",
    shape: "CAT_EYE",
    material: "PLASTIC",
    colors: ["#FFC0CB", "#800080"],
  },
];

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export function FeaturedProducts({
  title = "Bestsellers",
  subtitle = "Our most popular frames loved by customers",
  viewAllLink = "/products?sort=popular"
}: FeaturedProductsProps) {
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
          <Button variant="outline" className="hidden md:flex border-gold/50 text-gold hover:bg-gold/10 hover:border-gold" asChild>
            <Link href={viewAllLink}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              originalPrice={product.comparePrice}
              image={product.image}
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
      </div>
    </section>
  );
}
