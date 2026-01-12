import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Optional: Check if user has active orders?
        // For now, we attempt delete. If constraints fail, we catch it.

        await db.user.delete({
            where: { id: session.user.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Account delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete account. Please contact support if you have active orders." },
            { status: 500 }
        );
    }
}
