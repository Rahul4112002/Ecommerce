"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show Header/Footer for admin routes
    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
