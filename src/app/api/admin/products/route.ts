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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = productSchema.parse(body);

    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    const { images, ...productData } = data;

    const product = await db.product.create({
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        images: true,
        _count: { select: { reviews: true } },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
