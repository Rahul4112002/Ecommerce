import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const [wishlistItems, total] = await Promise.all([
            db.wishlist.findMany({
                where: { userId: session.user.id },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            price: true,
                            comparePrice: true,
                            stock: true,
                            images: { take: 1, select: { url: true } },
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            db.wishlist.count({ where: { userId: session.user.id } }),
        ]);

        const formattedItems = wishlistItems.map(item => ({
            id: item.id,
            addedAt: item.createdAt,
            product: {
                ...item.product,
                price: Number(item.product.price),
                comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
                image: item.product.images[0]?.url || null,
            }
        }));

        return NextResponse.json({
            items: formattedItems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error("Wishlist GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 }
        );
    }
}

const addToWishlistSchema = z.object({
    productId: z.string().min(1)
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = addToWishlistSchema.parse(body);

        // Check if exists
        const existing = await db.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId
                }
            }
        });

        if (existing) {
            // Remove
            await db.wishlist.delete({ where: { id: existing.id } });
            return NextResponse.json({ action: 'removed', message: "Removed from wishlist" });
        } else {
            // Add
            await db.wishlist.create({
                data: {
                    userId: session.user.id,
                    productId
                }
            });
            return NextResponse.json({ action: 'added', message: "Added to wishlist" });
        }

    } catch (error) {
        console.error("Wishlist POST Error:", error);
        return NextResponse.json(
            { error: "Failed to update wishlist" },
            { status: 500 }
        );
    }
}
