import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    let theme = await prisma.themeSetting.findFirst();
    if (!theme) {
      theme = await prisma.themeSetting.create({
        data: {
          appName: "Brain Hunt Telugu AI Studio",
          primaryColor: "#000000",
          secondaryColor: "#ffffff",
        },
      });
    }
    return NextResponse.json({ theme });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let theme = await prisma.themeSetting.findFirst();

    if (!theme) {
      theme = await prisma.themeSetting.create({ data: body });
    } else {
      theme = await prisma.themeSetting.update({
        where: { id: theme.id },
        data: body,
      });
    }
    return NextResponse.json({ success: true, theme });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
