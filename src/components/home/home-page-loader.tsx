"use client";

import { useState, useEffect } from "react";
import { Glasses } from "lucide-react";

export function HomePageLoader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        const startLoading = async () => {
            // Animate progress bar
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 15;
                });
            }, 200);

            // Wait for video to be ready
            const videoReady = new Promise<void>((resolve) => {
                const checkVideo = () => {
                    const video = document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                        if (video.readyState >= 3) {
                            video.play().catch(() => { });
                            resolve();
                        } else {
                            video.addEventListener('canplaythrough', () => {
                                video.play().catch(() => { });
                                resolve();
                            }, { once: true });
                            // Fallback after 4 seconds
                            setTimeout(resolve, 4000);
                        }
                    } else {
                        // No video found, resolve after short delay
                        setTimeout(resolve, 1000);
                    }
                };

                // Check after a brief delay to ensure DOM is ready
                setTimeout(checkVideo, 100);
            });

            // Minimum display time for loader (for smooth UX)
            const minTime = new Promise(resolve => setTimeout(resolve, 2000));

            await Promise.all([videoReady, minTime]);

            // Complete progress bar
            setProgress(100);

            // Short delay then hide loader
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        };

        startLoading();

        return () => {
            if (progressInterval) clearInterval(progressInterval);
        };
    }, []);

    if (!isLoading) {
        return <div className="animate-fadeIn">{children}</div>;
    }

    return (
        <>
            {/* Loader Screen */}
            <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center px-4">
                {/* Background Glow - Responsive */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-gold/5 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Animated Logo with Spinning Circle - Fully Responsive */}
                    <div className="relative">
                        {/* Outer Spinning Circle - Main */}
                        <div className="absolute inset-[-8px] sm:inset-[-10px] md:inset-[-12px] w-[96px] h-[96px] sm:w-[120px] sm:h-[120px] md:w-[144px] md:h-[144px] lg:w-[168px] lg:h-[168px] rounded-full border-[3px] sm:border-4 border-transparent border-t-gold border-r-gold/50 animate-[spin_1s_linear_infinite]" />

                        {/* Second Spinning Circle - Counter */}
                        <div className="absolute inset-[-4px] sm:inset-[-5px] md:inset-[-6px] w-[88px] h-[88px] sm:w-[110px] sm:h-[110px] md:w-[132px] md:h-[132px] lg:w-[156px] lg:h-[156px] rounded-full border-2 border-transparent border-b-gold/60 border-l-gold/30 animate-[spin_1.5s_linear_infinite_reverse]" />

                        {/* Static Outer Ring */}
                        <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full border border-gold/20" />

                        {/* Logo Container */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-gold/10 to-transparent flex items-center justify-center backdrop-blur-sm">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold flex items-center justify-center shadow-xl shadow-gold/40">
                                <Glasses className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-black" />
                            </div>
                        </div>
                    </div>

                    {/* Brand Name - Responsive */}
                    <div className="mt-6 sm:mt-8 md:mt-10 text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent tracking-wide">
                            LeeHit
                        </h1>
                        <p className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.35em] text-gray-500 mt-0.5 sm:mt-1">
                            Premium Eyewear
                        </p>
                    </div>

                    {/* Circular Progress Spinner - Responsive */}
                    <div className="mt-6 sm:mt-8 md:mt-10 relative">
                        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#1a1a1a"
                                strokeWidth="4"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${progress * 2.83} 283`}
                                transform="rotate(-90 50 50)"
                                className="transition-all duration-300 ease-out"
                            />
                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D4AF37" />
                                    <stop offset="100%" stopColor="#F4D03F" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* Percentage Text - Responsive */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gold font-semibold text-xs sm:text-sm md:text-base">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Loading Text - Responsive */}
                    <p className="mt-3 sm:mt-4 text-gray-500 text-[10px] sm:text-xs tracking-wider">
                        {progress < 100 ? 'Loading experience...' : 'Welcome!'}
                    </p>
                </div>
            </div>

            {/* Hidden content (preloading) */}
            <div className="opacity-0 pointer-events-none absolute">
                {children}
            </div>
        </>
    );
}
