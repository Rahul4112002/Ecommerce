"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FRAME_SHAPES, FRAME_MATERIALS, FRAME_COLORS } from "@/lib/constants";
import { SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
  className?: string;
}

interface Filters {
  gender: string[];
  shape: string[];
  material: string[];
  color: string[];
  priceRange: [number, number];
}

const GENDERS = [
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "KIDS", label: "Kids" },
  { value: "UNISEX", label: "Unisex" },
];

export function FilterSidebar({ className }: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<Filters>({
    gender: searchParams.get("gender")?.split(",") || [],
    shape: searchParams.get("shape")?.split(",") || [],
    material: searchParams.get("material")?.split(",") || [],
    color: searchParams.get("color")?.split(",") || [],
    priceRange: [
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "10000"),
    ],
  });

  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange);

  // Update URL with filters
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Gender
    if (filters.gender.length > 0) {
      params.set("gender", filters.gender.join(","));
    } else {
      params.delete("gender");
    }

    // Shape
    if (filters.shape.length > 0) {
      params.set("shape", filters.shape.join(","));
    } else {
      params.delete("shape");
    }

    // Material
    if (filters.material.length > 0) {
      params.set("material", filters.material.join(","));
    } else {
      params.delete("material");
    }

    // Color
    if (filters.color.length > 0) {
      params.set("color", filters.color.join(","));
    } else {
      params.delete("color");
    }

    // Price Range
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }

    if (priceRange[1] < 10000) {
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }, [filters, priceRange, pathname, router, searchParams]);

  // Toggle filter value
  const toggleFilter = (category: keyof Omit<Filters, "priceRange">, value: string) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      gender: [],
      shape: [],
      material: [],
      color: [],
      priceRange: [0, 10000],
    });
    setPriceRange([0, 10000]);
    router.push(pathname);
  };

  // Active filter count
  const activeFilterCount =
    filters.gender.length +
    filters.shape.length +
    filters.material.length +
    filters.color.length +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Active Filters Count & Clear */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
          </span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gold hover:text-gold-light hover:bg-gold/10">
            Clear All
          </Button>
        </div>
      )}

      {/* Gender Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gold">Gender</h3>
        <div className="space-y-2">
          {GENDERS.map((gender) => (
            <div key={gender.value} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender.value}`}
                checked={filters.gender.includes(gender.value)}
                onCheckedChange={() => toggleFilter("gender", gender.value)}
              />
              <Label
                htmlFor={`gender-${gender.value}`}
                className="cursor-pointer text-sm text-gray-300"
              >
                {gender.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Shape Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gold">Frame Shape</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {FRAME_SHAPES.map((shape) => (
            <div key={shape.value} className="flex items-center space-x-2">
              <Checkbox
                id={`shape-${shape.value}`}
                checked={filters.shape.includes(shape.value)}
                onCheckedChange={() => toggleFilter("shape", shape.value)}
              />
              <Label
                htmlFor={`shape-${shape.value}`}
                className="cursor-pointer text-sm text-gray-300"
              >
                {shape.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Material Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gold">Frame Material</h3>
        <div className="space-y-2">
          {FRAME_MATERIALS.map((material) => (
            <div key={material.value} className="flex items-center space-x-2">
              <Checkbox
                id={`material-${material.value}`}
                checked={filters.material.includes(material.value)}
                onCheckedChange={() => toggleFilter("material", material.value)}
              />
              <Label
                htmlFor={`material-${material.value}`}
                className="cursor-pointer text-sm text-gray-300"
              >
                {material.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Color Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gold">Frame Color</h3>
        <div className="flex flex-wrap gap-2">
          {FRAME_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => toggleFilter("color", color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${filters.color.includes(color.value)
                  ? "border-gold scale-110 ring-2 ring-gold/50"
                  : "border-gray-600 hover:border-gray-400"
                }`}
              style={{ backgroundColor: color.code }}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gold">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={10000}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Apply Filters Button */}
      <Button onClick={updateFilters} className="w-full bg-gold hover:bg-gold-light text-black font-semibold">
        Apply Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block w-64 shrink-0 ${className}`}>
        <div className="sticky top-24 bg-card rounded-lg border border-gold/20 p-4">
          <h2 className="font-bold text-lg mb-4 text-gold">Filters</h2>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-gold/30 text-gray-300">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-gold text-black text-xs rounded-full px-1.5 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto bg-card border-gold/20">
            <SheetHeader>
              <SheetTitle className="text-gold">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
