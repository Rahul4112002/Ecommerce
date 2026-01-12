import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: "asc" } },
        attributes: true,
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        reviews: {
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    // Get related products
    const relatedProducts = await db.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { attributes: { gender: product.attributes?.gender } },
        ],
      },
      include: {
        images: { take: 1 },
        attributes: true,
        variants: { take: 3 },
      },
      take: 4,
    });

    // Format response
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      sku: product.sku,
      stock: product.stock,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
      })),
      attributes: product.attributes ? {
        shape: product.attributes.shape,
        material: product.attributes.material,
        gender: product.attributes.gender,
        frameSize: product.attributes.frameSize,
        frameWidth: product.attributes.frameWidth,
        bridgeWidth: product.attributes.bridgeWidth,
        templeLength: product.attributes.templeLength,
        weight: product.attributes.weight,
      } : null,
      variants: product.variants.map((v) => ({
        id: v.id,
        color: v.color,
        colorCode: v.colorCode,
        stock: v.stock,
        price: v.price ? Number(v.price) : null,
        images: v.images,
      })),
      category: product.category,
      brand: product.brand,
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        userName: r.user.name,
        userImage: r.user.image,
        createdAt: r.createdAt,
        isVerified: r.isVerified,
      })),
      reviewCount: product._count.reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      isFeatured: product.isFeatured,
    };

    const formattedRelated = relatedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      image: p.images[0]?.url || null,
      shape: p.attributes?.shape,
      colors: p.variants.map((v) => ({ color: v.color, code: v.colorCode })),
    }));

    return NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelated,
    });
  } catch (error) {
    console.error("Product Detail API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
