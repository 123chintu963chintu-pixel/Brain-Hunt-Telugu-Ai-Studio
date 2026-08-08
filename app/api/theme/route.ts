import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEFAULTS: Record<string, string> = {
  appName: "Brain Hunt Telugu AI Studio",
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
};

export async function GET() {
  try {
    const rows = await prisma.themeSetting.findMany();
    const theme: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      theme[row.key] = row.value;
    }
    return NextResponse.json({ theme });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const keys = Object.keys(body);

    for (const key of keys) {
      await prisma.themeSetting.upsert({
        where: { key },
        update: { value: String(body[key]) },
        create: { key, value: String(body[key]) },
      });
    }

    const rows = await prisma.themeSetting.findMany();
    const theme: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      theme[row.key] = row.value;
    }

    return NextResponse.json({ success: true, theme });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
