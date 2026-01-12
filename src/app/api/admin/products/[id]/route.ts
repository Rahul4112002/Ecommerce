import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().nullable().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string(),
  brandId: z.string().optional(),
  gender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]),
  frameShape: z.string().optional(),
  frameMaterial: z.string().optional(),
  frameColor: z.string().optional(),
  lensType: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = productSchema.parse(body);

    // Check if slug already exists for another product
    const existingProduct = await db.product.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    const { images, ...productData } = data;

    // Update product and images in a transaction
    const product = await db.$transaction(async (tx) => {
      // Delete existing images
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      // Update product with new images
      return tx.product.update({
        where: { id },
        data: {
          ...productData,
          brandId: data.brandId || null,
          images: images
            ? {
              create: images.map((url, index) => ({
                url,
                alt: data.name,
                position: index,
              })),
            }
            : undefined,
        },
        include: { images: true },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete product and related data
    await db.$transaction(async (tx) => {
      // Delete images
      await tx.productImage.deleteMany({ where: { productId: id } });
      // Delete variants
      await tx.productVariant.deleteMany({ where: { productId: id } });
      // Delete reviews
      await tx.review.deleteMany({ where: { productId: id } });
      // Delete product
      await tx.product.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
