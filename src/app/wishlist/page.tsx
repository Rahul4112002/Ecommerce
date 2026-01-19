"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { WishlistButton } from "@/components/wishlist-button";

interface WishlistItem {
    id: string; // Wishlist entry ID
    addedAt: string;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        comparePrice?: number;
        stock: number;
        image: string | null;
    };
}

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCartStore();
    const { toggleWishlist, fetchWishlist } = useWishlistStore();

    // Redirect admin users to admin dashboard
    useEffect(() => {
        if (session?.user?.role === "ADMIN") {
            toast.error("Admin users cannot access the wishlist");
            router.push("/admin");
        }
    }, [session, router]);

    useEffect(() => {
        if (status === "authenticated") {
            loadWishlist();
            fetchWishlist(); // Sync store
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    const loadWishlist = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/wishlist");
            if (res.ok) {
                const data = await res.json();
                setItems(data.items);
            }
        } catch (error) {
            console.error("Failed to load wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        await toggleWishlist(productId);
        // Optimistic UI removing
        setItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const handleAddToCart = (product: any) => {
        if (product.stock <= 0) {
            toast.error("Product is out of stock");
            return;
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
            quantity: 1,
        });
        toast.success("Added to cart");
    };

    if (status === "loading" || loading) {
        return (
            <div className="container py-20 text-center">
                <p>Loading your wishlist...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="container py-20 text-center space-y-4">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold">Please log in</h1>
                <p className="text-muted-foreground">
                    You need to be logged in to view your wishlist.
                </p>
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-10 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Heart className="fill-red-500 text-red-500" /> My Wishlist
            </h1>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-lg border border-border">
                    <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-6">
                        Explore our collection and save your favorite items!
                    </p>
                    <Button asChild>
                        <Link href="/products">
                            Explore Products <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden group">
                            <div className="relative aspect-[4/3] bg-gray-100">
                                {item.product.image ? (
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white/80 hover:bg-white hover:text-red-500 text-gray-500"
                                        onClick={() => handleRemove(item.product.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="block hover:underline"
                                >
                                    <h3 className="font-semibold truncate">{item.product.name}</h3>
                                </Link>

                                <div className="flex items-center gap-2 mt-2 mb-4">
                                    <span className="font-bold">
                                        ₹{item.product.price.toLocaleString("en-IN")}
                                    </span>
                                    {item.product.comparePrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{item.product.comparePrice.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={() => handleAddToCart(item.product)}
                                    disabled={item.product.stock <= 0}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {item.product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
