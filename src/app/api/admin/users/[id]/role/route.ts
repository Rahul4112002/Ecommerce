import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const roleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { role } = roleSchema.parse(body);

    // Prevent admin from demoting themselves
    if (id === session.user.id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user role error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
