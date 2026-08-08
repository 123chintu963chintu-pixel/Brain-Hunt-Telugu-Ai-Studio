import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await prisma.owner.deleteMany({});
  return NextResponse.json({ success: true, message: "All owners deleted. Go to /setup now." });
}
