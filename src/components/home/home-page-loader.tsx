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
                    {/* Animated Logo */}
                    <div className="relative">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-gold/20 animate-[spin_3s_linear_infinite]" />
                        <div className="absolute inset-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-t-2 border-gold animate-[spin_1.5s_linear_infinite]" />

                        {/* Logo Container */}
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-gold via-gold-light to-gold flex items-center justify-center shadow-xl shadow-gold/30 animate-pulse">
                                <Glasses className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
                            </div>
                        </div>
                    </div>

                    {/* Brand Name */}
                    <div className="mt-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent tracking-wide">
                            LeeHit
                        </h1>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gray-500 mt-1">
                            Premium Eyewear
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-10 w-48 sm:w-64">
                        <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-center text-gray-600 text-xs mt-3 tracking-wide">
                            {progress < 100 ? 'Loading experience...' : 'Welcome!'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Hidden content (preloading) */}
            <div className="opacity-0 pointer-events-none">
                {children}
            </div>
        </>
    );
}
