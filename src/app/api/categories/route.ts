import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
