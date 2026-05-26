import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createCompanionReply, shouldShowSubscriptionPrompt } from "@/lib/ai-companion";
import { getUserFromRequest } from "@/lib/auth";
import { hasSafetyRisk, isSessionCategory, isSessionMode } from "@/lib/companion";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getUsageState, incrementUsage } from "@/lib/usage";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 40);

  if (!limited.ok) {
    return NextResponse.json({ error: "請稍後再試，訊息送出太頻繁了。" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = String(body?.session_id ?? body?.conversation_id ?? "").trim();
  const mode = String(body?.mode ?? "emotion_question");
  const category = String(body?.category ?? "stress");
  const rawContent = String(body?.content ?? body?.message ?? "").trim();
  const content = rawContent.slice(0, 500);
  const guestToken = String(body?.guest_token ?? "").trim() || randomUUID();

  if (!isSessionMode(mode) || !isSessionCategory(category)) {
    return NextResponse.json({ error: "陪伴模式或分類不正確。" }, { status: 400 });
  }

  if (mode !== "daily_guidance" && mode !== "card_draw" && !content) {
    return NextResponse.json({ error: "可以先輸入一點想說的話。" }, { status: 400 });
  }

  if (rawContent.length > 500) {
    return NextResponse.json({ error: "訊息最多 500 字。" }, { status: 400 });
  }

  const db = getDb();
  const user = await getUserFromRequest(request);
  const safetyFlag = hasSafetyRisk(content);
  const usageBefore = await getUsageState({ user, guestToken });

  if (usageBefore.limit_reached && !safetyFlag) {
    return NextResponse.json(
      {
        error: user
          ? "今日可用訊息已用完。"
          : "訪客今日可用訊息已用完，註冊後可以獲得更多每日訊息數。",
        usage: {
          ...usageBefore,
          remaining_messages: usageBefore.remaining,
        },
        safety: { flagged: false, level: "normal" },
        subscribe_prompt: true,
      },
      { status: 402 },
    );
  }

  let session = sessionId
    ? await db.session.findFirst({
        where: user ? { id: sessionId, userId: user.id } : { id: sessionId, guestToken },
        include: { card: { select: { id: true, name: true } } },
      })
    : null;

  if (!session) {
    const cards = mode === "card_draw" ? await db.card.findMany() : [];
    const card = cards.length ? cards[Math.floor(Math.random() * cards.length)] : null;

    session = await db.session.create({
      data: {
        userId: user?.id,
        guestToken: user ? null : guestToken,
        mode,
        category,
        userInput: content,
        cardId: card?.id,
        responseTitle: "AI 陪伴對話",
        responseEmpathy: "",
        responseReflection: "",
        responseAction: "",
        title: "AI 陪伴對話",
        metadata: { source: "ai_chat" },
        safetyFlag: false,
      },
      include: { card: { select: { id: true, name: true } } },
    });
  }

  const userMessage = await db.chatMessage.create({
    data: {
      sessionId: session.id,
      role: "user",
      content: content || "我想先從今日指引開始。",
      safetyFlag,
    },
  });

  const previousMessages = await db.chatMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "asc" },
    take: 30,
  });

  const reply = await createCompanionReply({
    mode: session.mode,
    category: session.category,
    userInput: userMessage.content,
    messages: previousMessages,
    cardName: session.card?.name,
  });

  const assistantMessage = await db.chatMessage.create({
    data: {
      sessionId: session.id,
      role: "assistant",
      content: reply,
      safetyFlag,
    },
  });

  const usageAfter = safetyFlag ? usageBefore : await incrementUsage({ user, guestToken });
  const userMessageCount = await db.chatMessage.count({
    where: { sessionId: session.id, role: "user" },
  });

  await db.session.update({
    where: { id: session.id },
    data: {
      userInput: content || session.userInput,
      responseTitle: "AI 陪伴對話",
      title: "AI 陪伴對話",
      responseEmpathy: reply,
      responseReflection:
        userMessageCount >= 3 ? "你們已經聊了一小段，可以回頭看看自己反覆提到的感受。" : "",
      responseAction: shouldShowSubscriptionPrompt(userMessageCount, Boolean(user))
        ? "這段對話可以先保存下來，之後回看時會更容易看見自己的狀態變化。"
        : "",
      safetyFlag: session.safetyFlag || safetyFlag,
    },
  });

  return NextResponse.json({
    session_id: session.id,
    conversation_id: session.id,
    guest_token: user ? null : guestToken,
    card: session.card ? { id: session.card.id, name: session.card.name } : null,
    assistant_message: assistantMessage.content,
    message: {
      id: assistantMessage.id,
      role: assistantMessage.role,
      content: assistantMessage.content,
      safety_flag: assistantMessage.safetyFlag,
      created_at: assistantMessage.createdAt,
    },
    usage: {
      ...usageAfter,
      remaining_messages: usageAfter.remaining,
    },
    safety: {
      flagged: safetyFlag,
      level: safetyFlag ? "crisis" : "normal",
    },
    subscribe_prompt:
      shouldShowSubscriptionPrompt(userMessageCount, Boolean(user)) || usageAfter.remaining === 0,
  });
}
