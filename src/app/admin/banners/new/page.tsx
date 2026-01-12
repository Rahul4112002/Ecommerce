import { BannerForm } from "../banner-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/banners"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Banner</h1>
          <p className="text-gray-600 mt-1">
            Create a new promotional banner for the homepage
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <BannerForm />
      </div>
    </div>
  );
}
