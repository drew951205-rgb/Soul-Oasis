import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { applyAuthCookie, signUserToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);

  if (!limited.ok) {
    return NextResponse.json({ error: "請稍後再試。" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "請輸入 Email 與密碼。" }, { status: 400 });
  }

  const db = getDb();
  const found = await db.user.findUnique({ where: { email } });

  if (!found || !(await bcrypt.compare(password, found.passwordHash))) {
    return NextResponse.json({ error: "Email 或密碼不正確。" }, { status: 401 });
  }

  const user = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    planType: found.planType,
  };
  const accessToken = await signUserToken(user);
  const response = NextResponse.json({ user, access_token: accessToken });
  applyAuthCookie(response, accessToken);

  return response;
}
