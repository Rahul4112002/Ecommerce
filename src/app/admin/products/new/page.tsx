import { db } from "@/lib/db";
import { ProductForm } from "../product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getData() {
  const [categories, brands] = await Promise.all([
    db.category.findMany({ select: { id: true, name: true } }),
    db.brand.findMany({ select: { id: true, name: true } }),
  ]);
  return { categories, brands };
}

export default async function NewProductPage() {
  const { categories, brands } = await getData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your store
          </p>
        </div>
      </div>

      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
