import { jwtVerify, SignJWT } from "jose";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";

const cookieName = "soul_token";
const maxAge = 60 * 60 * 24 * 7;

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "soul-oasis-local-development-secret",
  );
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  planType: string;
};

export async function signUserToken(user: AuthUser) {
  return new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
    planType: user.planType,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSecret());
    const userId = verified.payload.sub;

    if (!userId) {
      return null;
    }

    return getDb().user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        planType: true,
      },
    });
  } catch {
    return null;
  }
}

export function applyAuthCookie(response: Response, token: string) {
  response.headers.append(
    "Set-Cookie",
    `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
  );
}

export function clearAuthCookie(response: Response) {
  response.headers.append(
    "Set-Cookie",
    `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
}
