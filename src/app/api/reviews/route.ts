import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/review-validations";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, rating, title, comment } = reviewSchema.parse(body);

        // Check if user has already reviewed this product
        const existingReview = await db.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        if (existingReview) {
            // Update existing review
            const updatedReview = await db.review.update({
                where: { id: existingReview.id },
                data: {
                    rating,
                    title,
                    comment,
                },
            });
            return NextResponse.json({ message: "Review updated successfully", review: updatedReview });
        }

        // Check if user has purchased the product (for verified tag)
        // We check if there is any DELIVERED order containing this product by this user
        const hasPurchased = await db.order.findFirst({
            where: {
                userId: session.user.id,
                status: "DELIVERED",
                items: {
                    some: {
                        productId,
                    },
                },
            },
        });

        // Create new review
        const newReview = await db.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating,
                title,
                comment,
                isVerified: !!hasPurchased,
            },
        });

        return NextResponse.json({ message: "Review submitted successfully", review: newReview }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error("Review POST Error:", error);
        return NextResponse.json(
            { error: "Failed to submit review" },
            { status: 500 }
        );
    }
}
