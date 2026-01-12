"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportButton() {
    const handleExport = () => {
        window.location.href = "/api/admin/orders/export";
    };

    return (
        <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
        </Button>
    );
}
