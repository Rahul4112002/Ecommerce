"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  User,
  Heart,
  Menu,
  LogOut,
  Package,
  Settings,
  Truck,
  Glasses
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "./mobile-nav";
import { useCartStore } from "@/lib/store/cart-store";

const categories = [
  { name: "Men", href: "/products?gender=MEN" },
  { name: "Women", href: "/products?gender=WOMEN" },
  { name: "Kids", href: "/products?gender=KIDS" },
  { name: "Sunglasses", href: "/products?category=sunglasses" },
  { name: "New Arrivals", href: "/products?sort=newest" },
  { name: "Sale", href: "/products?sale=true" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-gold/20">
      {/* Top Bar - Announcement */}
      <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-black text-center py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 px-2">
        <Truck className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        <span className="truncate">Free Shipping on orders above ₹999 | Use code: FIRST10 for 10% off</span>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-1.5 sm:p-2 -ml-1 touch-manipulation"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Logo - Always visible with proper sizing */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0">
            {/* Icon Mark */}
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-gold via-gold-light to-gold border border-gold/50 shadow-md shadow-gold/20 group-hover:shadow-gold/40 transition-all flex-shrink-0">
              <Glasses className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
            </div>
            {/* Brand Text - Always visible */}
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-heading tracking-wide bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent whitespace-nowrap">
                LeeHit
              </span>
              <span className="text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.15em] text-gray-400 -mt-0.5 whitespace-nowrap">
                Eyewear
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">

            {/* Wishlist - Hidden on very small screens */}
            <Link href="/wishlist" className="hidden sm:block">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 sm:w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 py-2.5 border-t border-border/50">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Search - Below header on mobile */}
      <div className="md:hidden px-3 pb-2">
        <SearchBar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
}
