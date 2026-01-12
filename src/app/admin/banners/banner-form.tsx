"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

type BannerFormData = {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: number;
  isActive: boolean;
};

interface BannerFormProps {
  initialData?: {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    link: string | null;
    position: number;
    isActive: boolean;
  };
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BannerFormData>({
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      image: initialData?.image || "",
      link: initialData?.link || "",
      position: initialData?.position ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const watchedImageUrl = watch("image");

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    setValue("image", url);
  };

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/admin/banners/${initialData.id}`
        : "/api/admin/banners";

      const response = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          image: data.image || null,
          link: data.link || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save banner");
      }

      toast.success(
        initialData
          ? "Banner updated successfully"
          : "Banner created successfully"
      );
      router.push("/admin/banners");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save banner"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Image
        </label>
        <ImageUpload
          value={watchedImageUrl ? [watchedImageUrl] : []}
          disabled={isSubmitting}
          onChange={(url) => handleImageUrlChange(url)}
          onRemove={() => handleImageUrlChange("")}
        />
        <input type="hidden" {...register("image")} />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            type="text"
            id="title"
            placeholder="Summer Sale"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label
            htmlFor="subtitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subtitle
          </label>
          <input
            {...register("subtitle")}
            type="text"
            id="subtitle"
            placeholder="Up to 50% off on all frames"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.subtitle.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Link */}
        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Link URL
          </label>
          <input
            {...register("link")}
            type="url"
            id="link"
            placeholder="https://example.com/sale"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Where users go when they click the banner
          </p>
        </div>

        {/* Position */}
        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Display Position
          </label>
          <input
            {...register("position", { valueAsNumber: true })}
            type="number"
            id="position"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Lower numbers appear first
          </p>
        </div>
      </div>



      {/* Active Status */ }
  <div className="flex items-center gap-3">
    <input
      {...register("isActive")}
      type="checkbox"
      id="isActive"
      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    />
    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
      Active (visible on website)
    </label>
  </div>

  {/* Form Actions */ }
  <div className="flex items-center justify-end gap-4 pt-4 border-t">
    <button
      type="button"
      onClick={() => router.back()}
      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
      {isSubmitting
        ? "Saving..."
        : initialData
          ? "Update Banner"
          : "Create Banner"}
    </button>
  </div>
    </form >
  );
}
