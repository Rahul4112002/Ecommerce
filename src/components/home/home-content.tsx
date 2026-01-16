"use client";

import { HomePageLoader } from "@/components/home/home-page-loader";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

interface HomeContentProps {
    bestsellersSection: React.ReactNode;
    newArrivalsSection: React.ReactNode;
}

export function HomeContent({ bestsellersSection, newArrivalsSection }: HomeContentProps) {
    return (
        <HomePageLoader>
            {/* Hero Section with Banner */}
            <HeroSection />

            {/* Shop by Category */}
            <CategoriesSection />

            {/* Bestsellers - Server Component passed as prop */}
            {bestsellersSection}

            {/* New Arrivals - Server Component passed as prop */}
            {newArrivalsSection}

            {/* Customer Testimonials */}
            <TestimonialsSection />
        </HomePageLoader>
    );
}
