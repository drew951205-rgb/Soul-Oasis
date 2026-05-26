import { NextRequest, NextResponse } from "next/server";
import { createConversationSummary } from "@/lib/conversation-summary";
import { getUserFromRequest } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const limited = rateLimit(request, 20);

  if (!limited.ok) {
    return NextResponse.json({ error: "請稍後再試，總結產生太頻繁了。" }, { status: 429 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const guestToken = String(body?.guest_token ?? "").trim();
  const user = await getUserFromRequest(request);
  const db = getDb();

  const session = await db.session.findFirst({
    where: user ? { id, userId: user.id } : { id, guestToken },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: { role: true, content: true, safetyFlag: true },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "找不到這段對話。" }, { status: 404 });
  }

  const userMessageCount = session.messages.filter((message) => message.role === "user").length;
  if (userMessageCount < 5 && !session.safetyFlag) {
    return NextResponse.json(
      { error: "再多聊幾句後，就可以整理本次對話。" },
      { status: 400 },
    );
  }

  const summary = await createConversationSummary(session.messages);

  await db.session.update({
    where: { id: session.id },
    data: {
      responseTitle: summary.title,
      title: summary.title,
      responseEmpathy: summary.focus,
      responseReflection: summary.timeline.map((item) => `${item.label}：${item.text}`).join("\n"),
      responseAction: summary.next_step,
      safetyFlag: session.safetyFlag || summary.safety_flag,
    },
  });

  return NextResponse.json({ summary });
}
