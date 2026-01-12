import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ suggestions: [] });
        }

        // Search products by name, category, or brand
        const products = await db.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { brand: { name: { contains: query, mode: "insensitive" } } },
                    { category: { name: { contains: query, mode: "insensitive" } } },
                ],
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: {
                    take: 1,
                    select: { url: true },
                    orderBy: { position: "asc" },
                },
                category: {
                    select: { name: true }
                }
            },
            take: 5,
        });

        const suggestions = products.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            image: product.images[0]?.url || "/placeholder-product.jpg",
            category: product.category?.name
        }));

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch suggestions" },
            { status: 500 }
        );
    }
}
