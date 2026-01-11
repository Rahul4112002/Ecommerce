import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Men's Frames",
    description: "Bold & sophisticated styles",
    href: "/products?gender=MEN",
    image: "👔",
    color: "bg-blue-100 hover:bg-blue-200",
    count: "150+ styles",
  },
  {
    id: 2,
    name: "Women's Frames",
    description: "Elegant & trendy designs",
    href: "/products?gender=WOMEN",
    image: "👗",
    color: "bg-pink-100 hover:bg-pink-200",
    count: "200+ styles",
  },
  {
    id: 3,
    name: "Kids' Frames",
    description: "Fun & durable for kids",
    href: "/products?gender=KIDS",
    image: "🧒",
    color: "bg-yellow-100 hover:bg-yellow-200",
    count: "80+ styles",
  },
  {
    id: 4,
    name: "Sunglasses",
    description: "UV protection in style",
    href: "/products?category=sunglasses",
    image: "🕶️",
    color: "bg-gray-100 hover:bg-gray-200",
    count: "100+ styles",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect frames for everyone in your family
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`${category.color} rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
            >
              <div className="text-5xl md:text-6xl mb-4">{category.image}</div>
              <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <span className="text-xs text-gray-500">{category.count}</span>
              <div className="mt-3 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Shop Now</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
