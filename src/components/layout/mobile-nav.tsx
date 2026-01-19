"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { X, ChevronRight, User, Heart, Package, LogOut, Glasses, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { name: string; href: string }[];
}

export function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b border-gold/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              {/* Icon Mark */}
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-gold via-gold-light to-gold border border-gold/50">
                <Glasses className="w-5 h-5 text-black" />
              </div>
              {/* Brand Text */}
              <div className="flex flex-col">
                <span className="text-xl font-bold font-heading tracking-wide bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                  LeeHit
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 -mt-0.5">
                  Eyewear
                </span>
              </div>
            </SheetTitle>
            <button onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User Section */}
          <div className="p-4 bg-secondary">
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Login for best experience</p>
                <div className="flex space-x-2">
                  <Button size="sm" asChild>
                    <Link href="/login" onClick={onClose}>
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/register" onClick={onClose}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">CATEGORIES</h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">{category.name}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </nav>
            </div>

            <Separator />

            {/* Quick Links */}
            {session && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">MY ACCOUNT</h3>
                <nav className="space-y-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 bg-gold/10 border border-gold/30"
                    >
                      <Settings className="h-5 w-5 text-gold" />
                      <span className="font-medium text-gold">Admin Panel</span>
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <Package className="h-5 w-5 text-gray-500" />
                    <span>My Orders</span>
                  </Link>
                  {!isAdmin && (
                    <Link
                      href="/wishlist"
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                    >
                      <Heart className="h-5 w-5 text-gray-500" />
                      <span>Wishlist</span>
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {session && (
            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  signOut();
                  onClose();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
