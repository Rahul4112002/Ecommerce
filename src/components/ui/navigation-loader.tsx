"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Reset loading when navigation completes
        setIsLoading(false);
        setProgress(100);
        const timeout = setTimeout(() => setProgress(0), 200);
        return () => clearTimeout(timeout);
    }, [pathname, searchParams]);

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        if (isLoading) {
            setProgress(0);
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 10;
                });
            }, 200);
        }

        return () => {
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [isLoading]);

    // Listen for clicks on links
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href) {
                const url = new URL(anchor.href);
                const currentUrl = new URL(window.location.href);

                // Only show loader for internal navigation (same origin, different path)
                if (
                    url.origin === currentUrl.origin &&
                    (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)
                ) {
                    setIsLoading(true);
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    if (progress === 0 && !isLoading) return null;

    return (
        <>
            {/* Top Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
                <div
                    className="h-full bg-gradient-to-r from-gold via-gold to-gold/70 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Full screen overlay for heavy pages */}
            {isLoading && (
                <div className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-4">
                        {/* Spinning loader */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
                            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-b-gold/50 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
