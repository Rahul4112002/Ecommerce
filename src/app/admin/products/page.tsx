import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { DeleteProductButton } from "./delete-button";

async function getProducts() {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
      images: { take: 1 },
      _count: { select: { reviews: true } },
    },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
          <CardDescription>
            A list of all products in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">No products found</p>
                    <Button asChild className="mt-4">
                      <Link href="/admin/products/new">Add your first product</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || "-"}</TableCell>
                    <TableCell>{product.brand?.name || "-"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          ₹{product.price.toNumber().toLocaleString("en-IN")}
                        </p>
                        {product.comparePrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            ₹{product.comparePrice.toNumber().toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          product.stock <= 5
                            ? "bg-red-100 text-red-700"
                            : product.stock <= 20
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                      >
                        {product.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{product._count.reviews}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DeleteProductButton productId={product.id} productName={product.name} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
