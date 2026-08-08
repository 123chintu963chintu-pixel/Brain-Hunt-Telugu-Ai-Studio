import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerSession } from "@/lib/auth";

export async function GET() {
  const tools = await prisma.aITool.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tools);
}

export async function POST(req: NextRequest) {
  const session = await getOwnerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug, description, category, icon, promptTemplate, provider } = body;

  if (!name || !slug || !category || !promptTemplate || !provider) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const tool = await prisma.aITool.create({
    data: { name, slug, description, category, icon, promptTemplate, provider },
  });

  return NextResponse.json(tool, { status: 201 });
}
