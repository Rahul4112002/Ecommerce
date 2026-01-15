"use client";

import { Button } from "@/components/ui/button";

export function ClearFiltersButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.location.href = "/products"}
    >
      Clear All Filters
    </Button>
  );
}
