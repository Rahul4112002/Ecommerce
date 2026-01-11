import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "New Collection 2026",
    subtitle: "Discover the latest trends in eyewear",
    cta: "Shop Now",
    href: "/products?sort=newest",
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-600",
  },
  {
    id: 2,
    title: "Flat 30% Off",
    subtitle: "On all premium frames this weekend",
    cta: "Grab the Deal",
    href: "/products?sale=true",
    bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    id: 3,
    title: "Free Shipping",
    subtitle: "On orders above ₹999",
    cta: "Start Shopping",
    href: "/products",
    bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
  },
];

export function HeroSection() {
  return (
    <section className="relative">
      {/* Main Hero Banner */}
      <div className={`${slides[0].bgColor} text-white`}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect
                <span className="block">Eyeframes</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-md">
                Premium quality frames for every style and budget. 
                Shop from our wide collection of designer eyewear.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="text-primary">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products?sort=newest">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    New Arrivals
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm opacity-80">Frame Styles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-sm opacity-80">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">4.8★</p>
                  <p className="text-sm opacity-80">Average Rating</p>
                </div>
              </div>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-9xl">👓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-2xl">🚚</span>
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-2xl">↩️</span>
              <span className="text-sm font-medium">Easy Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-2xl">🔒</span>
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-2xl">💬</span>
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
