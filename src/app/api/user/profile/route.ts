import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional().or(z.literal("")),
});

// GET - Get current user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                        wishlist: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                ...user,
                orderCount: user._count.orders,
                reviewCount: user._count.reviews,
                wishlistCount: user._count.wishlist,
            },
        });
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        // Filter out empty values
        const updateData: { name?: string; phone?: string } = {};
        if (validatedData.name) updateData.name = validatedData.name;
        if (validatedData.phone) updateData.phone = validatedData.phone;

        const user = await db.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
            },
        });

        return NextResponse.json({ user, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Profile PUT Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input data", details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
