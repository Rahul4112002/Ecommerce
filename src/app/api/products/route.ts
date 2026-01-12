import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma, FrameShape, FrameMaterial, Gender } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const shape = searchParams.get("shape");
    const material = searchParams.get("material");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const sale = searchParams.get("sale");

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    // Build attributes filter
    const attributesFilter: Prisma.FrameAttributeWhereInput = {};
    
    if (gender) {
      attributesFilter.gender = gender as Gender;
    }

    if (shape) {
      attributesFilter.shape = shape as FrameShape;
    }

    if (material) {
      attributesFilter.material = material as FrameMaterial;
    }

    if (Object.keys(attributesFilter).length > 0) {
      where.attributes = attributesFilter;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (sale === "true") {
      where.comparePrice = { not: null };
    }

    // Build orderBy
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { createdAt: "desc" }; // TODO: Add sales count
        break;
      case "rating":
        orderBy = { createdAt: "desc" }; // TODO: Add average rating
        break;
    }

    // Execute queries
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: { orderBy: { position: "asc" }, take: 2 },
          attributes: true,
          variants: { take: 5 },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    // Format response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      image: product.images[0]?.url || null,
      images: product.images.map((img) => img.url),
      shape: product.attributes?.shape,
      material: product.attributes?.material,
      gender: product.attributes?.gender,
      colors: product.variants.map((v) => ({ color: v.color, code: v.colorCode })),
      category: product.category?.name,
      brand: product.brand?.name,
      reviewCount: product._count.reviews,
      isFeatured: product.isFeatured,
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
