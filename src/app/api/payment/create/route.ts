import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";



export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { amount, orderData } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys are missing");
            return NextResponse.json(
                { error: "Payment configuration missing" },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: session.user.id,
                addressId: orderData.addressId,
            },
        });

        return NextResponse.json({
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Payment Create Error:", error);
        return NextResponse.json(
            { error: "Failed to create payment order" },
            { status: 500 }
        );
    }
}
