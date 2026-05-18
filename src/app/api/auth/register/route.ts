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
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const guestToken = String(body?.guest_token ?? "").trim();

  if (!name || !email || password.length < 8) {
    return NextResponse.json(
      { error: "請填寫姓名、有效 Email，且密碼至少 8 碼。" },
      { status: 400 },
    );
  }

  const db = getDb();
  const existing = await db.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ error: "這個 Email 已被註冊。" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true, planType: true },
  });

  if (guestToken) {
    await db.session.updateMany({
      where: { guestToken, userId: null },
      data: { userId: user.id },
    });
  }

  const accessToken = await signUserToken(user);
  const response = NextResponse.json({ user, access_token: accessToken });
  applyAuthCookie(response, accessToken);

  return response;
}
