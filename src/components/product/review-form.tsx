"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema, ReviewFormData } from "@/lib/review-validations";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            productId,
            rating: 0,
            title: "",
            comment: "",
        },
    });

    const onSubmit = async (data: ReviewFormData) => {
        if (data.rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed decrease submit review");
            }

            toast.success(result.message);
            form.reset();
            setRating(0);
            onReviewSubmitted();

            // Reload page to refresh reviews list
            window.location.reload();

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Write a Review</h3>
                <p className="text-muted-foreground mb-4">
                    Please log in to share your experience with this product.
                </p>
                <Button asChild variant="outline">
                    <Link href={`/login?callbackUrl=/products/${productId}`}>Log In to Review</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-lg p-6 mb-8">
            <h3 className="item-lg font-bold mb-4">Write a Review</h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Star Rating Input */}
                    <div className="space-y-2">
                        <FormLabel>Rating</FormLabel>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => {
                                        setRating(star);
                                        form.setValue("rating", star);
                                    }}
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {form.formState.errors.rating && (
                            <p className="text-sm font-medium text-destructive">
                                {form.formState.errors.rating.message}
                            </p>
                        )}
                    </div>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Summary of your experience" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Review</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us what you liked or disliked..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Review
                    </Button>
                </form>
            </Form>
        </div>
    );
}
