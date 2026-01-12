import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User, Package, MapPin, Settings, LogOut } from "lucide-react";

interface AccountLayoutProps {
    children: React.ReactNode;
}

const sidebarLinks = [
    {
        href: "/account",
        label: "Profile",
        icon: User,
    },
    {
        href: "/account/orders",
        label: "My Orders",
        icon: Package,
    },
    {
        href: "/account/addresses",
        label: "Addresses",
        icon: MapPin,
    },
    {
        href: "/account/settings",
        label: "Settings",
        icon: Settings,
    },
];

export default async function AccountLayout({ children }: AccountLayoutProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/account");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    {session.user.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-primary">
                                            {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{session.user.name || "User"}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-1">
                                {sidebarLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
                                    >
                                        <link.icon className="w-5 h-5 text-muted-foreground" />
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t">
                                    <Link
                                        href="/api/auth/signout"
                                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">{children}</main>
                </div>
            </div>
        </div>
    );
}
