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
    default: "Leehit Eyewear - Premium Eyeglasses & Sunglasses Online",
    template: "%s | Leehit Eyewear",
  },
  description: "Shop premium eyeglasses and sunglasses at Leehit Eyewear. Discover stylish frames for men and women with the latest designs. Free shipping across India.",
  keywords: [
    "Leehit Eyewear",
    "Leehit",
    "eyeglasses online",
    "sunglasses",
    "premium eyewear",
    "eyeframes",
    "glasses online India",
    "spectacles",
    "designer frames",
    "men eyeglasses",
    "women sunglasses"
  ],
  authors: [{ name: "Leehit Eyewear" }],
  creator: "Leehit Eyewear",
  publisher: "Leehit Eyewear",
  metadataBase: new URL("https://leehiteyewear.live"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://leehiteyewear.live",
    siteName: "Leehit Eyewear",
    title: "Leehit Eyewear - Premium Eyeglasses & Sunglasses",
    description: "Shop premium eyeglasses and sunglasses at Leehit Eyewear. Discover stylish frames for men and women.",
    images: [
      {
        url: "/leehit-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Leehit Eyewear Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leehit Eyewear - Premium Eyeglasses & Sunglasses",
    description: "Shop premium eyeglasses and sunglasses at Leehit Eyewear.",
    images: ["/leehit-logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "5yyzdU0NBlNDN3h3neqYvgQEJI3AS8C-y7Y2UCHnnco",
  },
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
