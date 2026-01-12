import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { SortSelect } from "@/components/product/sort-select";
import { Pagination } from "@/components/product/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  gender?: string;
  shape?: string;
  material?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

async function getProducts(searchParams: SearchParams) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], pagination: { page: 1, totalPages: 1, total: 0 } };
  }
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const data = await getProducts(params);
  const { products, pagination } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">
            {params.category
              ? params.category.charAt(0).toUpperCase() + params.category.slice(1).replace(/-/g, " ")
              : params.search
                ? `Search results for "${params.search}"`
                : "All Eyeframes"
            }
          </h1>
          <p className="text-muted-foreground mt-2">
            {pagination.total} product{pagination.total !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <Suspense fallback={<Skeleton className="w-64 h-150" />}>
            <FilterSidebar />
          </Suspense>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 lg:hidden">
                <Suspense fallback={<Skeleton className="w-24 h-10" />}>
                  <FilterSidebar />
                </Suspense>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <Suspense fallback={<Skeleton className="w-45 h-10" />}>
                  <SortSelect />
                </Suspense>
              </div>
            </div>

            {/* Products */}
            <Suspense fallback={<ProductsLoading />}>
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: { id: string; name: string; slug: string; price: number; comparePrice: number | null; image: string | null; images?: string[]; isFeatured: boolean; colors?: { code: string }[]; shape: string }) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        slug={product.slug}
                        price={product.price}
                        originalPrice={product.comparePrice}
                        image={product.image || "/placeholder-product.jpg"}
                        hoverImage={product.images?.[1] || product.image || undefined}
                        badge={product.comparePrice ? "Sale" : product.isFeatured ? "Featured" : undefined}
                        colors={product.colors?.map((c) => c.code) || []}
                        shape={product.shape}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                  />
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">👓</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = "/products"}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
