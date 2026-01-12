"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, X, ImagePlus } from "lucide-react";
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().positive().optional().or(z.literal("")),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Please select a category"),
  brandId: z.string().optional(),
  gender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]),
  frameShape: z.string().optional(),
  frameMaterial: z.string().optional(),
  frameColor: z.string().optional(),
  lensType: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  brands: Brand[];
  initialData?: ProductFormValues & { id: string };
}

export function ProductForm({ categories, brands, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: 0,
      comparePrice: "",
      sku: "",
      stock: 0,
      categoryId: "",
      brandId: "",
      gender: "UNISEX",
      frameShape: "",
      frameMaterial: "",
      frameColor: "",
      lensType: "",
      isActive: true,
      isFeatured: false,
      images: [],
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const addImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        comparePrice: data.comparePrice || null,
        images,
      };

      const url = initialData
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      
      const res = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save product");
      }

      toast.success(initialData ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Classic Aviator Gold Frame"
                          onChange={(e) => {
                            field.onChange(e);
                            if (!initialData) {
                              form.setValue("slug", generateSlug(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="classic-aviator-gold-frame" />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier (auto-generated from name)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Detailed product description..."
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brief description for product cards" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comparePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compare Price (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" placeholder="Original price" />
                        </FormControl>
                        <FormDescription>Shows as crossed out</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="EF-AV-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Frame Details */}
            <Card>
              <CardHeader>
                <CardTitle>Frame Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="frameShape"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frame Shape</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shape" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Aviator">Aviator</SelectItem>
                            <SelectItem value="Round">Round</SelectItem>
                            <SelectItem value="Rectangle">Rectangle</SelectItem>
                            <SelectItem value="Square">Square</SelectItem>
                            <SelectItem value="Cat Eye">Cat Eye</SelectItem>
                            <SelectItem value="Wayfarer">Wayfarer</SelectItem>
                            <SelectItem value="Oval">Oval</SelectItem>
                            <SelectItem value="Clubmaster">Clubmaster</SelectItem>
                            <SelectItem value="Geometric">Geometric</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="frameMaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frame Material</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Metal">Metal</SelectItem>
                            <SelectItem value="Plastic">Plastic</SelectItem>
                            <SelectItem value="Acetate">Acetate</SelectItem>
                            <SelectItem value="Titanium">Titanium</SelectItem>
                            <SelectItem value="Wood">Wood</SelectItem>
                            <SelectItem value="TR90">TR90</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="frameColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frame Color</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Gold, Black, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lensType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lens Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lens type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single Vision">Single Vision</SelectItem>
                            <SelectItem value="Bifocal">Bifocal</SelectItem>
                            <SelectItem value="Progressive">Progressive</SelectItem>
                            <SelectItem value="Blue Light">Blue Light</SelectItem>
                            <SelectItem value="Photochromic">Photochromic</SelectItem>
                            <SelectItem value="Polarized">Polarized</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <Button type="button" onClick={addImage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-lg overflow-hidden border">
                          <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add image URLs to showcase your product
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MEN">Men</SelectItem>
                          <SelectItem value="WOMEN">Women</SelectItem>
                          <SelectItem value="KIDS">Kids</SelectItem>
                          <SelectItem value="UNISEX">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Product is visible in store
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Show on homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
