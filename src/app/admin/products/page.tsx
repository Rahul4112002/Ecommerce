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
import { Plus, MoreHorizontal, Pencil, Eye, Package } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400">
            Manage your product inventory
          </p>
        </div>
        <Button className="bg-gold text-black hover:bg-gold/90" asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products Table */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Products ({products.length})</CardTitle>
          <CardDescription className="text-gray-400">
            A list of all products in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 w-[80px]">Image</TableHead>
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Brand</TableHead>
                  <TableHead className="text-gray-400">Price</TableHead>
                  <TableHead className="text-gray-400">Stock</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Reviews</TableHead>
                  <TableHead className="text-gray-400 w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-4">
                        <Package className="h-12 w-12 text-gray-600" />
                        <p className="text-gray-400">No products found</p>
                        <Button className="bg-gold text-black hover:bg-gold/90" asChild>
                          <Link href="/admin/products/new">Add your first product</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-800">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{product.category?.name || "-"}</TableCell>
                      <TableCell className="text-gray-300">{product.brand?.name || "-"}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gold">
                            ₹{product.price.toNumber().toLocaleString("en-IN")}
                          </p>
                          {product.comparePrice && (
                            <p className="text-xs text-gray-500 line-through">
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
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : product.stock <= 20
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-green-500/20 text-green-400 border-green-500/30"
                          }
                        >
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.isActive
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {product.isActive ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{product._count.reviews}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                            <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
                              <Link href={`/products/${product.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
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
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Package className="h-12 w-12 text-gray-600" />
                <p className="text-gray-400">No products found</p>
                <Button className="bg-gold text-black hover:bg-gold/90" asChild>
                  <Link href="/admin/products/new">Add your first product</Link>
                </Button>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{product.name}</p>
                    <p className="text-gold font-medium">
                      ₹{product.price.toNumber().toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={
                          product.stock <= 5
                            ? "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                            : product.stock <= 20
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
                              : "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                        }
                      >
                        Stock: {product.stock}
                      </Badge>
                      <Badge
                        className={
                          product.isActive
                            ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs"
                        }
                      >
                        {product.isActive ? "Active" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                      <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
