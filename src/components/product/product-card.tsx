"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, calculateDiscount } from "@/lib/helpers";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

export interface ProductCardProps {
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
  const addItem = useCartStore((state) => state.addItem);
  const discount = originalPrice ? calculateDiscount(price, originalPrice) : 0;

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
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
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
            <div className="w-full h-full flex items-center justify-center text-6xl bg-linear-to-br from-gray-50 to-gray-100">
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
            <Badge className={`absolute top-2 left-2 ${discount > 0 ? "bg-red-500" : "bg-primary"}`}>
              {discount > 0 ? `${discount}% OFF` : badge}
            </Badge>
          )}

          {/* Wishlist Button */}
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Added to wishlist!");
            }}
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="sm" 
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-3">
          {/* Product Info */}
          <div className="space-y-1">
            {/* Shape */}
            {shape && (
              <p className="text-xs text-gray-500">{shape}</p>
            )}
            
            {/* Name */}
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatPrice(price)}</span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Color Options */}
            {colors && colors.length > 0 && (
              <div className="flex gap-1 pt-1">
                {colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-xs text-gray-500">+{colors.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
