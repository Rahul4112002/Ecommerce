import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductCard } from "@/components/product/product-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
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
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
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
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
      })),
      attributes: product.attributes ? {
        shape: product.attributes.shape,
        material: product.attributes.material,
        gender: product.attributes.gender,
        frameSize: product.attributes.frameSize,
        frameWidth: product.attributes.frameWidth,
        bridgeWidth: product.attributes.bridgeWidth,
        templeLength: product.attributes.templeLength,
        weight: product.attributes.weight,
      } : null,
      variants: product.variants.map((v) => ({
        id: v.id,
        color: v.color,
        colorCode: v.colorCode,
        stock: v.stock,
        price: v.price ? Number(v.price) : null,
        images: v.images,
      })),
      category: product.category,
      brand: product.brand,
      reviews: product.reviews.map((r) => ({
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

    const formattedRelated = relatedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      image: p.images[0]?.url || null,
      shape: p.attributes?.shape,
      colors: p.variants.map((v) => ({ color: v.color, code: v.colorCode })),
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

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data?.product) {
    return { title: "Product Not Found" };
  }

  const { product } = data;
  const productUrl = `/products/${product.slug}`;
  const imageUrl = product.images[0]?.url || "/leehit-logo.jpeg";

  return {
    title: `${product.name} - Leehit Eyewear`,
    description: product.description || `Buy ${product.name} at Leehit Eyewear. Premium quality eyewear with free shipping across India.`,
    keywords: [
      product.name,
      "Leehit Eyewear",
      product.brand?.name || "Leehit",
      product.category?.name || "eyewear",
      product.attributes?.gender || "",
      "eyeglasses",
      "sunglasses",
    ].filter(Boolean),
    alternates: {
      canonical: `https://leehiteyewear.live${productUrl}`,
    },
    openGraph: {
      type: "website",
      url: `https://leehiteyewear.live${productUrl}`,
      title: `${product.name} - Leehit Eyewear`,
      description: product.description || `Buy ${product.name} at Leehit Eyewear`,
      siteName: "Leehit Eyewear",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Leehit Eyewear`,
      description: product.description || `Buy ${product.name} at Leehit Eyewear`,
      images: [imageUrl],
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

  // Generate structured data for SEO
  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description || `Premium ${product.name}`,
    price: product.price,
    image: product.images[0]?.url || "/leehit-logo.jpeg",
    category: product.category?.name || "Eyewear",
    inStock: product.stock > 0,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.category?.name || "Eyewear", url: `/products?category=${product.category?.slug}` },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="bg-card rounded-lg shadow-sm p-6 md:p-8 border border-border">
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
        <div className="bg-card rounded-lg shadow-sm p-6 md:p-8 mt-8 border border-border">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent">
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
                <div className="prose prose-invert max-w-none">
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

                <Separator className="bg-border" />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Return Policy</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>7 days easy return policy</li>
                    <li>Product must be unused and in original packaging</li>
                    <li>Full refund will be processed within 5-7 business days</li>
                    <li>For defective products, contact us within 24 hours of delivery</li>
                  </ul>
                </div>

                <Separator className="bg-border" />

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
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  slug={relatedProduct.slug}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.comparePrice}
                  image={relatedProduct.image || "/placeholder-product.jpg"}
                  colors={relatedProduct.colors?.map((c) => c.code) || []}
                  shape={relatedProduct.shape || ""}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
