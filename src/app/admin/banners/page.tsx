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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600 mt-1">
            Manage homepage promotional banners
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Banner
        </Link>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No banners yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first promotional banner
            </p>
            <Link
              href="/admin/banners/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Banner
            </Link>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Banner Image */}
              <div className="relative h-48 bg-gray-100">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${banner.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {/* Position Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    Position: {banner.position}
                  </span>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                )}
                {banner.link && (
                  <p className="text-xs text-indigo-600 truncate mb-3">
                    Link: {banner.link}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/banners/${banner.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
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

