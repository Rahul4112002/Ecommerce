import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        const user = await db.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 12);

        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
