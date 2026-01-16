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
            <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
                {/* Background Glow */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Animated Logo with Spinning Circle */}
                    <div className="relative">
                        {/* Outer Spinning Circle - Main */}
                        <div className="absolute inset-[-12px] w-[136px] h-[136px] sm:w-[168px] sm:h-[168px] rounded-full border-4 border-transparent border-t-gold border-r-gold/50 animate-[spin_1s_linear_infinite]" />

                        {/* Second Spinning Circle - Counter */}
                        <div className="absolute inset-[-6px] w-[124px] h-[124px] sm:w-[156px] sm:h-[156px] rounded-full border-2 border-transparent border-b-gold/60 border-l-gold/30 animate-[spin_1.5s_linear_infinite_reverse]" />

                        {/* Static Outer Ring */}
                        <div className="absolute inset-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-gold/20" />

                        {/* Logo Container */}
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-gold/10 to-transparent flex items-center justify-center backdrop-blur-sm">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold flex items-center justify-center shadow-xl shadow-gold/40">
                                <Glasses className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                            </div>
                        </div>
                    </div>

                    {/* Brand Name */}
                    <div className="mt-10 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent tracking-wide">
                            LeeHit
                        </h1>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gray-500 mt-1">
                            Premium Eyewear
                        </p>
                    </div>

                    {/* Circular Progress Spinner */}
                    <div className="mt-10 relative">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
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
                        {/* Percentage Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gold font-semibold text-sm sm:text-base">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <p className="mt-4 text-gray-500 text-xs tracking-wider">
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
