import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().max(200).nullable().optional(),
  image: z.string().url().nullable().optional(),
  link: z.string().url().nullable().optional(),
  position: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const banner = await db.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Get banner error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const data = bannerSchema.parse(body);

    const banner = await db.banner.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image || "",
        link: data.link,
        position: data.position,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Update banner error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await db.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}

