"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Heart, ShoppingCart } from "lucide-react";
import { WishlistButton } from "@/components/wishlist-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/helpers";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  hoverImage?: string;
  badge?: string;
  shape?: string;
  colors?: string[];
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  image,
  hoverImage,
  badge,
  shape,
  colors,
}: ProductCardProps) {
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const discount = originalPrice ? calculateDiscount(price, originalPrice) : 0;
  const isAdmin = session?.user?.role === "ADMIN";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: slug,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="group bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-gold/40 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold/10">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square bg-gray-900 overflow-hidden">
          {/* Product Image */}
          {image && image !== "/placeholder-product.jpg" ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-800 to-gray-900">
              👓
            </div>
          )}

          {/* Hover Image */}
          {hoverImage && hoverImage !== image && (
            <Image
              src={hoverImage}
              alt={`${name} - alternate view`}
              fill
              className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Badge */}
          {(badge || discount > 0) && (
            <Badge className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-[10px] sm:text-xs ${discount > 0 ? "bg-red-500 text-white" : "bg-gold text-black font-semibold"}`}>
              {discount > 0 ? `${discount}% OFF` : badge}
            </Badge>
          )}

          {/* Wishlist Button - Hidden for admin */}
          {!isAdmin && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <WishlistButton
                productId={slug}
                variant="icon"
                className="bg-gray-900/80 hover:bg-gray-800 text-white border border-gray-700 shadow-lg"
              />
            </div>
          )}

          {/* Quick Add Button - Hidden for admin */}
          {!isAdmin && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                className="w-full bg-gold hover:bg-gold-light text-black font-semibold"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4">
          {/* Product Info */}
          <div className="space-y-1 sm:space-y-2">
            {/* Shape */}
            {shape && (
              <p className="text-[10px] sm:text-xs text-gold/70 font-medium uppercase tracking-wider">{shape}</p>
            )}

            {/* Name */}
            <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-gold transition-colors line-clamp-2">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base md:text-lg text-gold">{formatPrice(price)}</span>
              {originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Color Options */}
            {colors && colors.length > 0 && (
              <div className="flex gap-1 sm:gap-1.5 pt-1">
                {colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-gray-700"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-xs text-gray-500">+{colors.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
