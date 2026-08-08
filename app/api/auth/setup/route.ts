import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createOwnerToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const setupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Works only once — refuses if an Owner already exists.
export async function POST(req: NextRequest) {
  const existingCount = await prisma.owner.count();
  if (existingCount > 0) {
    return NextResponse.json(
      { error: "Setup already completed. Use /login instead." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  const owner = await prisma.owner.create({ data: { email, passwordHash } });
  const token = await createOwnerToken(owner.id);

  const cookieStore = await cookies();
  cookieStore.set(env.OWNER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ success: true, owner: { id: owner.id, email: owner.email } });
}

export async function GET() {
  const existingCount = await prisma.owner.count();
  return NextResponse.json({ setupRequired: existingCount === 0 });
}
