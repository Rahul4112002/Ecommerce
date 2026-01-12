import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await db.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                to: email,
                subject: "Reset your password",
                html: `
            <p>You requested a password reset.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link expires in 1 hour.</p>
        `,
            });
        } else {
            console.log("RESEND_API_KEY not found. Reset Link:", resetUrl);
        }

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
