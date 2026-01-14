import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { SortSelect } from "@/components/product/sort-select";
import { Pagination } from "@/components/product/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ClearFiltersButton } from "@/components/product/clear-filters-button";
import { db } from "@/lib/db";
import { Prisma, FrameShape, FrameMaterial, Gender } from "@prisma/client";

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
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "12");
  const skip = (page - 1) * limit;

  const search = searchParams.search;
  const category = searchParams.category;
  const gender = searchParams.gender;
  const shape = searchParams.shape;
  const material = searchParams.material;
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const sort = searchParams.sort || "newest";

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
      orderBy = { createdAt: "desc" };
      break;
    case "rating":
      orderBy = { createdAt: "desc" };
      break;
  }

  try {
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

    // Format products
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

    return {
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], pagination: { page: 1, totalPages: 1, total: 0 } };
  }
}

function ProductsLoading() {
  return (
    & lt;div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" & gt;
  {
    Array.from({ length: 9 }).map((_, i) =& gt; (
        & lt;div key = { i } className = "space-y-3" & gt;
          & lt;Skeleton className = "h-64 w-full rounded-lg" /& gt;
          & lt;Skeleton className = "h-4 w-3/4" /& gt;
          & lt;Skeleton className = "h-4 w-1/2" /& gt;
          & lt;Skeleton className = "h-6 w-1/4" /& gt;
        & lt;/div&gt;
      ))
  }
    & lt;/div&gt;
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise & lt;SearchParams&gt;;
}) {
  const params = await searchParams;
  const { products, pagination } = await getProducts(params);

  return (
    & lt;div className = "min-h-screen bg-gray-50" & gt;
      & lt;div className = "container mx-auto px-4 py-8" & gt;
        & lt;div className = "flex items-center justify-between mb-6" & gt;
          & lt;h1 className = "text-2xl font-bold" & gt;All Eyeglasses & lt;/h1&gt;
          & lt;p className = "text-muted-foreground" & gt;
  { pagination.total } products found
    & lt;/p&gt;
        & lt;/div&gt;

        & lt;div className = "flex gap-8" & gt;
  {/* Filter Sidebar */ }
          & lt;div className = "hidden md:block w-64 shrink-0" & gt;
            & lt;Suspense fallback = {& lt;Skeleton className = "w-64 h-[500px]" /& gt;
}& gt;
              & lt; FilterSidebar /& gt;
            & lt;/Suspense&gt;
          & lt;/div&gt;

{/* Products Grid */ }
          & lt;div className = "flex-1" & gt;
{/* Sort */ }
            & lt;div className = "flex justify-between items-center mb-6" & gt;
              & lt; div /& gt;
              & lt;Suspense fallback = {& lt;Skeleton className = "w-40 h-10" /& gt;}& gt;
                & lt; SortSelect /& gt;
              & lt;/Suspense&gt;
            & lt;/div&gt;

            & lt;Suspense fallback = {& lt; ProductsLoading /& gt;}& gt;
{
  products.length & gt; 0 ? (
                & lt;& gt;
                  & lt;div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" & gt;
  {
    products.map((product) =& gt; (
                      & lt; ProductCard
    key = { product.id }
    id = { product.id }
    name = { product.name }
    slug = { product.slug }
    price = { product.price }
    originalPrice = { product.comparePrice }
    image = { product.image || "/placeholder-product.jpg" }
    colors = { product.colors?.map((c) =& gt; c.code) || []
  }
  shape = { product.shape || "" }
    /& gt;
                    ))
}
                  & lt;/div&gt;
                  & lt; Pagination
currentPage = { pagination.page }
totalPages = { pagination.totalPages }
total = { pagination.total }
  /& gt;
                & lt;/&gt;
              ) : (
                & lt;div className = "text-center py-16" & gt;
                  & lt;div className = "text-6xl mb-4" & gt;👓& lt;/div&gt;
                  & lt;h3 className = "text-xl font-semibold mb-2" & gt;No products found & lt;/h3&gt;
                  & lt;p className = "text-muted-foreground mb-4" & gt;
                    Try adjusting your filters or search terms
  & lt;/p&gt;
                  & lt; ClearFiltersButton /& gt;
                & lt;/div&gt;
              )}
            & lt;/Suspense&gt;
          & lt;/div&gt;
        & lt;/div&gt;
      & lt;/div&gt;
    & lt;/div&gt;
  );
}
