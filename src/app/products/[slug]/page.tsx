import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductCard } from "@/components/product/product-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";

interface ProductPageProps {
  params: Promise & lt;{ slug: string }& gt;;
}

async function getProduct(slug: string) {
  try {
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
      return null;
    }

    // Calculate average rating
    const avgRating = product.reviews.length & gt; 0
      ? product.reviews.reduce((sum, r) =& gt; sum + r.rating, 0) / product.reviews.length
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

    // Format product
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      sku: product.sku,
      stock: product.stock,
      images: product.images.map((img) =& gt; ({
        id: img.id,
        url: img.url,
        alt: img.alt,
      })),
      attributes: product.attributes ?{
        shape: product.attributes.shape,
        material: product.attributes.material,
        gender: product.attributes.gender,
        frameSize: product.attributes.frameSize,
        frameWidth: product.attributes.frameWidth,
        bridgeWidth: product.attributes.bridgeWidth,
        templeLength: product.attributes.templeLength,
        weight: product.attributes.weight,
      }: null,
      variants: product.variants.map((v) =& gt; ({
        id: v.id,
        color: v.color,
        colorCode: v.colorCode,
        stock: v.stock,
        price: v.price ? Number(v.price) : null,
        images: v.images,
      })),
    category: product.category,
      brand: product.brand,
        reviews: product.reviews.map((r) =& gt; ({
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

  const formattedRelated = relatedProducts.map((p) =& gt; ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    image: p.images[0]?.url || null,
    shape: p.attributes?.shape,
    colors: p.variants.map((v) =& gt; ({ color: v.color, code: v.colorCode })),
    }));

return {
  product: formattedProduct,
  relatedProducts: formattedRelated,
};
  } catch (error) {
  console.error("Error fetching product:", error);
  return null;
}
}

export async function generateMetadata({ params }: ProductPageProps): Promise & lt; Metadata & gt; {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data?.product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${data.product.name} - LeeHit Eyewear`,
    description: data.product.description || `Buy ${data.product.name} at the best price`,
    openGraph: {
      images: data.product.images[0]?.url ? [data.product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data?.product) {
    notFound();
  }

  const { product, relatedProducts } = data;

  return (
    & lt;div className = "min-h-screen bg-gray-50" & gt;
      & lt;div className = "container mx-auto px-4 py-8" & gt;
  {/* Product Main Section */ }
        & lt;div className = "bg-white rounded-lg shadow-sm p-6 md:p-8" & gt;
          & lt;div className = "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" & gt;
  {/* Gallery */ }
            & lt; ProductGallery
  images = { product.images }
  productName = { product.name }
    /& gt;

  {/* Info */ }
            & lt;ProductInfo product = { product } /& gt;
          & lt;/div&gt;
        & lt;/div&gt;

  {/* Product Details Tabs */ }
        & lt;div className = "bg-white rounded-lg shadow-sm p-6 md:p-8 mt-8" & gt;
          & lt;Tabs defaultValue = "description" className = "w-full" & gt;
            & lt;TabsList className = "w-full justify-start border-b rounded-none h-auto p-0 bg-transparent" & gt;
              & lt; TabsTrigger
  value = "description"
  className = "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
    & gt;
  Description
    & lt;/TabsTrigger&gt;
              & lt; TabsTrigger
  value = "reviews"
  className = "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
    & gt;
  Reviews({ product.reviewCount })
    & lt;/TabsTrigger&gt;
              & lt; TabsTrigger
  value = "shipping"
  className = "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
    & gt;
  Shipping & amp; Returns
    & lt;/TabsTrigger&gt;
            & lt;/TabsList&gt;

            & lt;TabsContent value = "description" className = "mt-6" & gt;
  {
    product.description ? (
                & lt;div className = "prose max-w-none" & gt;
                  & lt; p & gt; { product.description }& lt;/p&gt;
                & lt;/div&gt;
              ) : (
                & lt;p className = "text-muted-foreground" & gt;No description available.& lt;/p&gt;
              )
  }
            & lt;/TabsContent&gt;

            & lt;TabsContent value = "reviews" className = "mt-6" & gt;
              & lt; ProductReviews
  productId = { product.id }
  reviews = { product.reviews }
  avgRating = { product.avgRating }
  reviewCount = { product.reviewCount }
    /& gt;
            & lt;/TabsContent&gt;

            & lt;TabsContent value = "shipping" className = "mt-6" & gt;
              & lt;div className = "space-y-6" & gt;
                & lt; div & gt;
                  & lt;h3 className = "font-semibold text-lg mb-2" & gt;Shipping Information & lt;/h3&gt;
                  & lt;ul className = "list-disc list-inside text-muted-foreground space-y-1" & gt;
                    & lt; li & gt;Free shipping on orders above ₹999 & lt;/li&gt;
                    & lt; li & gt;Standard delivery: 5 - 7 business days & lt;/li&gt;
                    & lt; li & gt;Express delivery: 2 - 3 business days(additional charges apply) & lt;/li&gt;
                    & lt; li & gt;Cash on Delivery(COD) available & lt;/li&gt;
                    & lt; li & gt;We ship to all major cities in India & lt;/li&gt;
                  & lt;/ul&gt;
                & lt;/div&gt;

                & lt; Separator /& gt;

                & lt; div & gt;
                  & lt;h3 className = "font-semibold text-lg mb-2" & gt;Return Policy & lt;/h3&gt;
                  & lt;ul className = "list-disc list-inside text-muted-foreground space-y-1" & gt;
                    & lt; li & gt; 7 days easy return policy & lt;/li&gt;
                    & lt; li & gt;Product must be unused and in original packaging & lt;/li&gt;
                    & lt; li & gt;Full refund will be processed within 5 - 7 business days & lt;/li&gt;
                    & lt; li & gt;For defective products, contact us within 24 hours of delivery & lt;/li&gt;
                  & lt;/ul&gt;
                & lt;/div&gt;

                & lt; Separator /& gt;

                & lt; div & gt;
                  & lt;h3 className = "font-semibold text-lg mb-2" & gt; Warranty & lt;/h3&gt;
                  & lt;ul className = "list-disc list-inside text-muted-foreground space-y-1" & gt;
                    & lt; li & gt; 1 year warranty on manufacturing defects & lt;/li&gt;
                    & lt; li & gt;Warranty does not cover accidental damage & lt;/li&gt;
                    & lt; li & gt;Keep your invoice for warranty claims & lt;/li&gt;
                  & lt;/ul&gt;
                & lt;/div&gt;
              & lt;/div&gt;
            & lt;/TabsContent&gt;
          & lt;/Tabs&gt;
        & lt;/div&gt;

  {/* Related Products */ }
  {
    relatedProducts.length & gt; 0 & amp;& amp; (
          & lt;div className = "mt-12" & gt;
            & lt;h2 className = "text-2xl font-bold mb-6" & gt;You May Also Like & lt;/h2&gt;
            & lt;div className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" & gt;
    {
      relatedProducts.map((relatedProduct: { id: string; name: string; slug: string; price: number; comparePrice: number | null; image: string | null; colors?: { code: string }[]; shape: string }) =& gt; (
                & lt; ProductCard
      key = { relatedProduct.id }
      id = { relatedProduct.id }
      name = { relatedProduct.name }
      slug = { relatedProduct.slug }
      price = { relatedProduct.price }
      originalPrice = { relatedProduct.comparePrice }
      image = { relatedProduct.image || "/placeholder-product.jpg" }
      colors = { relatedProduct.colors?.map((c) =& gt; c.code) || []
    }
    shape = { relatedProduct.shape }
      /& gt;
              ))
  }
            & lt;/div&gt;
          & lt;/div&gt;
        )
}
      & lt;/div&gt;
    & lt;/div&gt;
  );
}
