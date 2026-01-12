import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BannerForm } from "../../banner-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditBannerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;

  const banner = await db.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Banner</h1>
          <p className="text-gray-600 mt-1">Update banner: {banner.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <BannerForm initialData={banner} />
      </div>
    </div>
  );
}
