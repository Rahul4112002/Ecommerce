import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Main Hero Banner - Video Background */}
      <div className="relative bg-black overflow-hidden min-h-[500px] sm:min-h-[550px] md:min-h-[650px] lg:min-h-[700px]">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/A_premium_matteblack_1080p_202601151252.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay to ensure text is visible - reduced for brighter video */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        {/* Watermark cover - bottom right corner */}
        <div className="absolute bottom-0 right-0 w-32 h-16 bg-gradient-to-tl from-black via-black/80 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20 lg:py-28 relative z-10 flex items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[600px]">
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl px-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold/30 bg-gold/5">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-gold" />
              <span className="text-xs sm:text-sm font-medium text-gold">Premium Collection 2026</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
              Find Your Perfect <span className="text-gold">Frames</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto italic font-light tracking-wide animate-[fadeInUp_1s_ease-out_forwards] opacity-0 px-2 sm:px-0" style={{ animationDelay: '0.3s' }}>
              <span className="bg-gradient-to-r from-amber-200 via-gold to-amber-300 bg-clip-text text-transparent">
                Premium quality frames for every style and budget.
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-gray-300/90">
                Shop from our wide collection of designer eyewear.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
              <Button size="lg" className="w-full sm:w-auto bg-gold hover:bg-gold-light text-black font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all text-sm sm:text-base" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-gold/50 text-gold hover:bg-gold/10 hover:border-gold text-sm sm:text-base" asChild>
                <Link href="/products?sort=newest">
                  New Arrivals
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 lg:gap-8 pt-2 sm:pt-4 justify-center">
              <div className="text-center px-2 sm:px-0">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gold">500+</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Frame Styles</p>
              </div>
              <div className="border-l border-gray-700 pl-3 sm:pl-4 md:pl-6 lg:pl-8 text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gold">10K+</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="border-l border-gray-700 pl-3 sm:pl-4 md:pl-6 lg:pl-8 text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gold">4.8★</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-secondary border-y border-gold/10 py-3 sm:py-4 md:py-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 sm:py-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-300">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 sm:py-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-300">Easy Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 sm:py-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-300">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 sm:py-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-300">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
