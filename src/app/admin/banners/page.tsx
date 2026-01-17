import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, ImageIcon } from "lucide-react";
import { DeleteButton } from "./delete-button";

export default async function BannersPage() {
  const banners = await db.banner.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Banners</h1>
          <p className="text-gray-400 mt-1">
            Manage homepage promotional banners
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="inline-flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Banner
        </Link>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No banners yet
            </h3>
            <p className="text-gray-400 mb-4">
              Create your first promotional banner
            </p>
            <Link
              href="/admin/banners/new"
              className="inline-flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Add Banner
            </Link>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 overflow-hidden"
            >
              {/* Banner Image */}
              <div className="relative h-48 bg-gray-800">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-600" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${banner.isActive
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {/* Position Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gold/20 text-gold border border-gold/30">
                    Position: {banner.position}
                  </span>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-sm text-gray-400 mb-2">{banner.subtitle}</p>
                )}
                {banner.link && (
                  <p className="text-xs text-gold truncate mb-3">
                    Link: {banner.link}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/banners/${banner.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <DeleteButton bannerId={banner.id} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
