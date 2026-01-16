"use client";

import { useState, useEffect } from "react";
import { Glasses } from "lucide-react";

interface PageLoaderProps {
    children: React.ReactNode;
}

export function PageLoader({ children }: PageLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Wait for video and images to load
        const checkPageReady = async () => {
            // Give minimum time for loader to show
            const minLoadTime = new Promise(resolve => setTimeout(resolve, 1500));

            // Check if video is loaded
            const videoLoaded = new Promise(resolve => {
                const video = document.querySelector('video');
                if (video) {
                    if (video.readyState >= 3) {
                        resolve(true);
                    } else {
                        video.addEventListener('canplaythrough', () => resolve(true), { once: true });
                        // Fallback timeout
                        setTimeout(() => resolve(true), 3000);
                    }
                } else {
                    resolve(true);
                }
            });

            // Wait for both minimum time and video load
            await Promise.all([minLoadTime, videoLoaded]);

            // Start fade out
            setIsLoading(false);

            // Show content after fade out animation
            setTimeout(() => {
                setShowContent(true);
            }, 500);
        };

        checkPageReady();
    }, []);

    return (
        <>
            {/* Premium Loader */}
            <div
                className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Animated Logo */}
                <div className="relative animate-pulse">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 blur-2xl bg-gold/30 rounded-full scale-150" />

                    {/* Logo Container */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-gold via-gold-light to-gold flex items-center justify-center shadow-2xl shadow-gold/40">
                        <Glasses className="w-12 h-12 sm:w-16 sm:h-16 text-black" />
                    </div>
                </div>

                {/* Brand Name */}
                <div className="mt-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                        LeeHit
                    </h1>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-500 mt-1">
                        Eyewear
                    </p>
                </div>

                {/* Loading Animation */}
                <div className="mt-10 flex items-center gap-1">
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>

                {/* Loading Text */}
                <p className="mt-4 text-gray-600 text-sm tracking-wide">
                    Loading premium experience...
                </p>
            </div>

            {/* Page Content */}
            <div
                className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {children}
            </div>
        </>
    );
}
