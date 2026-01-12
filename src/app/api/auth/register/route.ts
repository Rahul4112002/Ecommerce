import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validatedData.data;

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: email },
          ...(phone ? [{ phone: phone }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or phone already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
      },
    });

    // Create empty cart for user
    await db.cart.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
