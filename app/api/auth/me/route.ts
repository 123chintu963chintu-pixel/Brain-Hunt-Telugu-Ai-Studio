import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyOwnerToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.OWNER_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const payload = await verifyOwnerToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false });
  }

  const owner = await prisma.owner.findUnique({
    where: { id: payload.ownerId },
    select: { id: true, email: true, createdAt: true },
  });

  if (!owner) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, owner });
}
