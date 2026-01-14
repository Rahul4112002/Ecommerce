"use client";

import { Button } from "@/components/ui/button";

export function ClearFiltersButton() {
    return (
    & lt; Button
    variant = "outline"
    onClick = {() =& gt; window.location.href = "/products"
}
    & gt;
      Clear All Filters
    & lt;/Button&gt;
  );
}
