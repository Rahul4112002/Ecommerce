import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductCard } from "@/components/product/product-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data?.product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${data.product.name} - EyeFrames Store`,
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            {/* Info */}
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              {product.description ? (
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No description available.</p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product.id}
                reviews={product.reviews}
                avgRating={product.avgRating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Free shipping on orders above ₹999</li>
                    <li>Standard delivery: 5-7 business days</li>
                    <li>Express delivery: 2-3 business days (additional charges apply)</li>
                    <li>Cash on Delivery (COD) available</li>
                    <li>We ship to all major cities in India</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Return Policy</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>7 days easy return policy</li>
                    <li>Product must be unused and in original packaging</li>
                    <li>Full refund will be processed within 5-7 business days</li>
                    <li>For defective products, contact us within 24 hours of delivery</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Warranty</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>1 year warranty on manufacturing defects</li>
                    <li>Warranty does not cover accidental damage</li>
                    <li>Keep your invoice for warranty claims</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: { id: string; name: string; slug: string; price: number; comparePrice: number | null; image: string | null; colors?: { code: string }[]; shape: string }) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  slug={relatedProduct.slug}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.comparePrice}
                  image={relatedProduct.image || "/placeholder-product.jpg"}
                  colors={relatedProduct.colors?.map((c) => c.code) || []}
                  shape={relatedProduct.shape}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
