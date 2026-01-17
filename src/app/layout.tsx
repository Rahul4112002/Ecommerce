import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { NavigationLoader } from "@/components/ui/navigation-loader";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "LeeHit Eyewear - Premium Eyewear Store",
    template: "%s | LeeHit Eyewear",
  },
  description: "Shop premium quality eyeframes for men, women, and kids. Wide collection of stylish frames at affordable prices with free shipping.",
  keywords: ["eyeframes", "glasses", "eyewear", "spectacles", "sunglasses", "frames", "leehit"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <Suspense fallback={null}>
            <NavigationLoader />
          </Suspense>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
