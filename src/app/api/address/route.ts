import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addressSchema } from "@/lib/validations";

// GET - Fetch all addresses for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" }
      ],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Address GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = addressSchema.parse(body);

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if user has any addresses, if not, make this default
    const existingAddresses = await db.address.count({
      where: { userId: session.user.id }
    });

    const address = await db.address.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        isDefault: existingAddresses === 0 ? true : validatedData.isDefault,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Address POST Error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
