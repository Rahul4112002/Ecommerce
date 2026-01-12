"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsLoading(false);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Mail className="h-10 w-10 text-gold" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-6">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">Exclusive Offer</span>
          </div>

          {/* Content */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Get <span className="text-gold">10% Off</span> Your First Order
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Subscribe to our newsletter and stay updated with new arrivals,
            exclusive offers, and style tips!
          </p>

          {/* Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gold focus:ring-gold/20 flex-1"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gold hover:bg-gold-light text-black font-semibold shadow-lg shadow-gold/25"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 max-w-md mx-auto">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-black" />
              </div>
              <p className="text-lg font-semibold text-white mb-2">
                Thanks for subscribing!
              </p>
              <p className="text-sm text-gray-400">Check your inbox for your discount code.</p>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-xs text-gray-600 mt-6">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
