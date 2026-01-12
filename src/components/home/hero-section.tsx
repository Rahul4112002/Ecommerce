import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, MessageCircle, Glasses, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Main Hero Banner - Luxury Black & Gold */}
      <div className="relative bg-black overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gold">Premium Collection 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Find Your Perfect
                <span className="block text-gold mt-1 sm:mt-2">Frames</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-md">
                Premium quality frames for every style and budget.
                Shop from our wide collection of designer eyewear.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gold hover:bg-gold-light text-black font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 hover:border-gold" asChild>
                  <Link href="/products?sort=newest">
                    New Arrivals
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 pt-4">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gold">500+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Frame Styles</p>
                </div>
                <div className="border-l border-gray-700 pl-4 sm:pl-6 md:pl-8 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gold">10K+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Happy Customers</p>
                </div>
                <div className="border-l border-gray-700 pl-4 sm:pl-6 md:pl-8 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gold">4.8★</p>
                  <p className="text-xs sm:text-sm text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image - Clean Premium Glasses */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                {/* Very subtle outer glow */}
                <div className="absolute inset-0 w-64 h-64 rounded-full bg-gold/10 blur-2xl" />

                {/* Glasses with floating animation */}
                <div className="relative animate-[float_6s_ease-in-out_infinite]">
                  {/* Subtle background glow */}
                  <div className="absolute inset-0 blur-xl bg-gold/5 rounded-full scale-110" />

                  {/* The glasses icon - larger, with gold outline */}
                  <Glasses
                    className="relative h-48 w-48 lg:h-56 lg:w-56 text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    strokeWidth={0.8}
                  />

                  {/* Sparkles around glasses */}
                  <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-gold animate-pulse" />
                  <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-gold animate-pulse" />
                  <Sparkles className="absolute -bottom-2 -left-6 h-5 w-5 text-gold/80 animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
                  <Sparkles className="absolute top-1/2 -right-8 h-4 w-4 text-gold/60 animate-[pulse_2.5s_ease-in-out_infinite_1s]" />
                  <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-gold animate-pulse" />
                  <Sparkles className="absolute -top-2 left-0 h-3 w-3 text-gold/70 animate-[pulse_3s_ease-in-out_infinite_0.3s]" />
                  <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-gold animate-pulse" />
                  <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-gold animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-secondary border-y border-gold/10 py-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-gold" />
              </div>
              <span className="text-sm font-medium text-gray-300">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-gold" />
              </div>
              <span className="text-sm font-medium text-gray-300">Easy Returns</span>
            </div>
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-gold" />
              </div>
              <span className="text-sm font-medium text-gray-300">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-gold" />
              </div>
              <span className="text-sm font-medium text-gray-300">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
