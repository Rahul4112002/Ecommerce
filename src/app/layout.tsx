import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "EyeFrames - Premium Eyewear Store",
    template: "%s | EyeFrames",
  },
  description: "Shop premium quality eyeframes for men, women, and kids. Wide collection of stylish frames at affordable prices with free shipping.",
  keywords: ["eyeframes", "glasses", "eyewear", "spectacles", "sunglasses", "frames"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
