import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 30);

  if (!limited.ok) {
    return NextResponse.json({ error: "操作太頻繁，請稍後再試。" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = String(body?.session_id ?? body?.conversation_id ?? "").trim();
  const messageId = String(body?.message_id ?? "").trim();
  const rating = Number(body?.rating);
  const reason = String(body?.reason ?? "").trim().slice(0, 120);

  if (!sessionId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "回饋資料不完整。" }, { status: 400 });
  }

  const user = await getUserFromRequest(request);
  const db = getDb();
  const session = await db.session.findFirst({
    where: user ? { id: sessionId, userId: user.id } : { id: sessionId },
    select: { id: true },
  });

  if (!session) {
    return NextResponse.json({ error: "找不到這段對話。" }, { status: 404 });
  }

  if (messageId) {
    const message = await db.chatMessage.findFirst({
      where: { id: messageId, sessionId, role: "assistant" },
      select: { id: true },
    });

    if (!message) {
      return NextResponse.json({ error: "找不到這則 AI 回覆。" }, { status: 404 });
    }
  }

  await db.feedback.create({
    data: {
      userId: user?.id,
      sessionId,
      messageId: messageId || null,
      rating,
      reason: reason || null,
    },
  });

  return NextResponse.json({ ok: true });
}
