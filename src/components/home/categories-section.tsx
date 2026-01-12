import Link from "next/link";
import { ArrowRight, User, Sparkles, Baby, Sun } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Men's Frames",
    description: "Bold & sophisticated styles",
    href: "/products?gender=MEN",
    icon: User,
    count: "150+ styles",
  },
  {
    id: 2,
    name: "Women's Frames",
    description: "Elegant & trendy designs",
    href: "/products?gender=WOMEN",
    icon: Sparkles,
    count: "200+ styles",
  },
  {
    id: 3,
    name: "Kids' Frames",
    description: "Fun & durable for kids",
    href: "/products?gender=KIDS",
    icon: Baby,
    count: "80+ styles",
  },
  {
    id: 4,
    name: "Sunglasses",
    description: "UV protection in style",
    href: "/products?category=sunglasses",
    icon: Sun,
    count: "100+ styles",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="inline-block px-3 sm:px-4 py-1 rounded-full border border-gold/30 text-gold text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Browse Collection
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
            Shop by <span className="text-gold">Category</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
            Find the perfect frames for everyone in your family
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-gold/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-1 flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative mb-3 sm:mb-5 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 group-hover:border-gold/40 group-hover:shadow-lg group-hover:shadow-gold/20 transition-all duration-300">
                <category.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gold" />
              </div>

              {/* Content */}
              <h3 className="relative font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-white group-hover:text-gold transition-colors">
                {category.name}
              </h3>
              <p className="relative text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                {category.description}
              </p>
              <span className="relative text-[10px] sm:text-xs text-gray-500 font-medium">
                {category.count}
              </span>

              {/* Shop Now Link */}
              <div className="relative mt-4 flex items-center justify-center text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="text-sm font-semibold">Shop Now</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
