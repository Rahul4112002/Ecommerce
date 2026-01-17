"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Share2, Truck, Shield, RotateCcw, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { formatPrice } from "@/lib/helpers";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    sku: string | null;
    stock: number;
    attributes: {
      shape: string;
      material: string;
      gender: string;
      frameSize: string;
      frameWidth: number | null;
      bridgeWidth: number | null;
      templeLength: number | null;
      weight: number | null;
    } | null;
    variants: {
      id: string;
      color: string;
      colorCode: string;
      stock: number;
      price: number | null;
    }[];
    category: { name: string; slug: string } | null;
    brand: { name: string; slug: string } | null;
    avgRating: number;
    reviewCount: number;
    images: { url: string }[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);


  const addItem = useCartStore((state) => state.addItem);

  const currentPrice = selectedVariant?.price || product.price;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - currentPrice) / product.comparePrice) * 100)
    : 0;

  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0;
  const stockCount = selectedVariant?.stock || product.stock;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: currentPrice,
      image: product.images[0]?.url || "/placeholder-product.jpg",
      color: selectedVariant?.color,
      quantity: quantity,
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/cart";
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ordering:\n\n` +
      `*${product.name}*\n` +
      `${selectedVariant ? `Color: ${selectedVariant.color}\n` : ""}` +
      `Price: ${formatPrice(currentPrice)}\n` +
      `Quantity: ${quantity}\n\n` +
      `Please provide more details about this product.`
    );
    window.open(`https://wa.me/918828489397?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        {" / "}
        <Link href="/products" className="hover:text-primary">Products</Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
          </>
        )}
      </div>

      {/* Title & Brand */}
      <div>
        {product.brand && (
          <p className="text-sm text-muted-foreground mb-1">{product.brand.name}</p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(product.avgRating) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.avgRating}) · {product.reviewCount} reviews
            </span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(currentPrice)}
        </span>
        {product.comparePrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
            <Badge variant="destructive">{discount}% OFF</Badge>
          </>
        )}
      </div>

      {/* Color Variants */}
      {product.variants.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">
            Color: {selectedVariant?.color || "Select a color"}
          </h3>
          <div className="flex gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock === 0}
                className={`relative w-10 h-10 rounded-full border-2 transition-all ${selectedVariant?.id === variant.id
                  ? "border-primary scale-110"
                  : "border-gray-300 hover:border-gray-400"
                  } ${variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: variant.colorCode }}
                title={`${variant.color}${variant.stock === 0 ? " (Out of Stock)" : ""}`}
              >
                {variant.stock === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white bg-black/50 rounded-full">
                    ✕
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-semibold mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 border-x min-w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
              className="px-3 py-2 hover:bg-gray-100"
              disabled={quantity >= stockCount}
            >
              +
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {inStock ? `${stockCount} in stock` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={!inStock}
        >
          Buy Now
        </Button>
      </div>

      {/* WhatsApp Order */}
      <Button
        size="lg"
        variant="outline"
        className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50"
        onClick={handleWhatsAppOrder}
      >
        <MessageCircle className="w-5 h-5" />
        Order via WhatsApp
      </Button>

      {/* Wishlist & Share */}
      <div className="flex gap-3">
        <WishlistButton
          productId={product.id}
          variant="full"
          className="flex-1"
        />
        <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      <Separator />

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Free Delivery</p>
            <p className="text-muted-foreground">On orders above ₹999</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">1 Year Warranty</p>
            <p className="text-muted-foreground">Manufacturing defects</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Easy Returns</p>
            <p className="text-muted-foreground">7 days return policy</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Frame Specifications */}
      {product.attributes && (
        <div>
          <h3 className="font-semibold mb-4">Frame Specifications</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Shape</span>
              <span className="font-medium">{product.attributes.shape}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Material</span>
              <span className="font-medium">{product.attributes.material}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Gender</span>
              <span className="font-medium">{product.attributes.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Frame Size</span>
              <span className="font-medium">{product.attributes.frameSize}</span>
            </div>
            {product.attributes.frameWidth && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Frame Width</span>
                <span className="font-medium">{product.attributes.frameWidth}mm</span>
              </div>
            )}
            {product.attributes.bridgeWidth && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Bridge Width</span>
                <span className="font-medium">{product.attributes.bridgeWidth}mm</span>
              </div>
            )}
            {product.attributes.templeLength && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Temple Length</span>
                <span className="font-medium">{product.attributes.templeLength}mm</span>
              </div>
            )}
            {product.attributes.weight && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-medium">{product.attributes.weight}g</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SKU */}
      {product.sku && (
        <p className="text-sm text-muted-foreground">
          SKU: {product.sku}
        </p>
      )}
    </div>
  );
}
