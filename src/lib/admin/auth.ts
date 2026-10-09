import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET ?? "mobilekade-dev-secret-change-me"
);
const COOKIE = "mk_admin";

export async function signAdmin() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return token;
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const c = await cookies();
  const t = c.get(COOKIE)?.value;
  if (!t) return false;
  return verifyAdminToken(t);
}

export const ADMIN_COOKIE = COOKIE;

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "admin1234";
}
