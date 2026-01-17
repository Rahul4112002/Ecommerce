import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Main Hero Banner - Video Background */}
      <div className="relative bg-black overflow-hidden aspect-[9/16] sm:aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9] max-h-[85vh]">
        {/* Video Background - properly contained */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        >
          <source src="/A_premium_matteblack_1080p_202601151252.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay to ensure text is visible */}
        <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />

        {/* Gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center h-full py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl px-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-gold/30 bg-black/50 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold" />
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gold">Premium Collection 2026</span>
            </div>

            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white drop-shadow-lg">
              Find Your Perfect <span className="text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">Frames</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-[280px] sm:max-w-md md:max-w-lg mx-auto font-light tracking-wide px-1 drop-shadow-md">
              <span className="bg-gradient-to-r from-amber-200 via-gold to-amber-300 bg-clip-text text-transparent font-medium">
                Premium quality frames for every style.
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-gray-200 sm:text-gray-300">
                Shop our wide collection of designer eyewear.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center items-center px-2 sm:px-0">
              <Button size="default" className="w-full sm:w-auto min-w-[140px] bg-gold hover:bg-gold-light text-black font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all text-xs sm:text-sm md:text-base h-10 sm:h-11" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
              <Button size="default" variant="outline" className="w-full sm:w-auto min-w-[140px] border-gold/50 text-gold hover:bg-gold/10 hover:border-gold text-xs sm:text-sm md:text-base h-10 sm:h-11 bg-black/30 backdrop-blur-sm" asChild>
                <Link href="/products?sort=newest">
                  New Arrivals
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-6 pt-2 sm:pt-3 justify-center">
              <div className="text-center px-2 bg-black/30 backdrop-blur-sm rounded-lg py-1.5 sm:py-2">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gold">500+</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-300">Frame Styles</p>
              </div>
              <div className="text-center px-2 bg-black/30 backdrop-blur-sm rounded-lg py-1.5 sm:py-2">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gold">10K+</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-300">Happy Customers</p>
              </div>
              <div className="text-center px-2 bg-black/30 backdrop-blur-sm rounded-lg py-1.5 sm:py-2">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gold">4.8★</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-300">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-secondary border-y border-gold/10 py-2.5 sm:py-3 md:py-4">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 text-center">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gold" />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-300">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gold" />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-300">Easy Returns</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gold" />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-300">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gold" />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-300">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
