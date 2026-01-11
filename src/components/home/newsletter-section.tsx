"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
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
    <section className="py-12 md:py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8" />
          </div>

          {/* Content */}
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Get 10% Off Your First Order
          </h2>
          <p className="text-lg opacity-90 mb-8">
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
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-1"
                required
              />
              <Button 
                type="submit" 
                variant="secondary"
                disabled={isLoading}
                className="text-primary"
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
            <div className="bg-white/10 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-lg font-medium">🎉 Thanks for subscribing!</p>
              <p className="text-sm opacity-80">Check your inbox for your discount code.</p>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-xs opacity-60 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
