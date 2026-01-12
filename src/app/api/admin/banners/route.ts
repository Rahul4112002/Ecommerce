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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banners = await db.banner.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = bannerSchema.parse(body);

    const banner = await db.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image || "",
        link: data.link,
        position: data.position,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Create banner error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}

