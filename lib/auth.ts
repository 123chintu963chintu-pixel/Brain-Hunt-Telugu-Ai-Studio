import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

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

export async function getOwnerSession() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(env.OWNER_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyOwnerToken(token);
}
