"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6">
      {/* Search */}
      <div className="flex-1 ml-12 lg:ml-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, orders, users..."
            className="pl-9 bg-gray-50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <p className="font-medium">New Order #1234</p>
              <p className="text-xs text-muted-foreground">
                Order worth ₹2,499 received from Rahul
              </p>
              <p className="text-xs text-muted-foreground">2 min ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <p className="font-medium">Low Stock Alert</p>
              <p className="text-xs text-muted-foreground">
                Classic Aviator Gold Frame is running low (5 left)
              </p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <p className="font-medium">New Review</p>
              <p className="text-xs text-muted-foreground">
                5-star review on Round Retro Black Frame
              </p>
              <p className="text-xs text-muted-foreground">3 hours ago</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
