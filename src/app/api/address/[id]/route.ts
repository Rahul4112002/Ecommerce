import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addressSchema } from "@/lib/validations";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single address
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const address = await db.address.findFirst({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!address) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ address });
    } catch (error) {
        console.error("Address GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch address" },
            { status: 500 }
        );
    }
}

// PUT - Update address
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check ownership
        const existingAddress = await db.address.findFirst({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!existingAddress) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = addressSchema.parse(body);

        // If setting as default, unset other defaults
        if (validatedData.isDefault && !existingAddress.isDefault) {
            await db.address.updateMany({
                where: { userId: session.user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await db.address.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json({ address });
    } catch (error) {
        console.error("Address PUT Error:", error);
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Invalid input data" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update address" },
            { status: 500 }
        );
    }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check ownership
        const existingAddress = await db.address.findFirst({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!existingAddress) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        await db.address.delete({
            where: { id },
        });

        // If deleted address was default, make another one default
        if (existingAddress.isDefault) {
            const firstAddress = await db.address.findFirst({
                where: { userId: session.user.id },
                orderBy: { createdAt: "desc" },
            });

            if (firstAddress) {
                await db.address.update({
                    where: { id: firstAddress.id },
                    data: { isDefault: true },
                });
            }
        }

        return NextResponse.json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Address DELETE Error:", error);
        return NextResponse.json(
            { error: "Failed to delete address" },
            { status: 500 }
        );
    }
}
