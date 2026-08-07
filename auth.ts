import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { env } from "./env";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const COOKIE_NAME = env.OWNER_SESSION_COOKIE_NAME;

// ---- JWT ----

export async function createOwnerToken(ownerId: string) {
  return await new SignJWT({ ownerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyOwnerToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { ownerId: string };
  } catch {
    return null;
  }
}

// ---- Password hashing ----

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// ---- Cookie helpers (server-only, App Router) ----

export async function setOwnerSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearOwnerSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getOwnerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyOwnerToken(token);
}
