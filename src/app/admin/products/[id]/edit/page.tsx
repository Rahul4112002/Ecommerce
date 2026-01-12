import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "../../product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getData(productId: string) {
  const [product, categories, brands] = await Promise.all([
    db.product.findUnique({
      where: { id: productId },
      include: { images: true },
    }),
    db.category.findMany({ select: { id: true, name: true } }),
    db.brand.findMany({ select: { id: true, name: true } }),
  ]);

  return { product, categories, brands };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, categories, brands } = await getData(id);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    shortDescription: product.shortDescription || "",
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() || "",
    sku: product.sku || "",
    stock: product.stock,
    categoryId: product.categoryId || "",
    brandId: product.brandId || "",
    gender: product.gender as "MEN" | "WOMEN" | "KIDS" | "UNISEX",
    frameShape: product.frameShape || "",
    frameMaterial: product.frameMaterial || "",
    frameColor: product.frameColor || "",
    lensType: product.lensType || "",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    images: product.images.map((img) => img.url),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            Update product details for {product.name}
          </p>
        </div>
      </div>

      <ProductForm
        categories={categories}
        brands={brands}
        initialData={initialData}
      />
    </div>
  );
}
