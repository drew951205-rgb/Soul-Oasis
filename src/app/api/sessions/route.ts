import { NextRequest, NextResponse } from "next/server";
import {
  generateCompanionResult,
  isSessionCategory,
  isSessionMode,
} from "@/lib/companion";
import { getUserFromRequest } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

function serializeSession(session: {
  id: string;
  mode: string;
  category: string;
  userInput: string;
  moodScore: number | null;
  responseTitle: string;
  responseEmpathy: string;
  responseReflection: string;
  responseAction: string;
  safetyFlag: boolean;
  createdAt: Date;
  card?: { name: string } | null;
}) {
  const summaryTimeline = session.responseReflection
    .split("\n")
    .map((line) => {
      const [label, ...rest] = line.split("：");
      return {
        label: label?.trim() ?? "",
        text: rest.join("：").trim(),
      };
    })
    .filter((item) => item.label && item.text);
  const hasSummary = summaryTimeline.length >= 2 && Boolean(session.responseAction.trim());

  return {
    id: session.id,
    created_at: session.createdAt,
    mode: session.mode,
    category: session.category,
    title: session.responseTitle,
    mood_score: session.moodScore,
    preview_text: session.responseEmpathy,
    has_summary: hasSummary,
    summary_preview: hasSummary ? session.responseEmpathy : "",
    summary_next_step: hasSummary ? session.responseAction : "",
    summary_timeline: hasSummary ? summaryTimeline : [],
    user_input: session.userInput,
    card_name: session.card?.name ?? null,
    result: {
      title: session.responseTitle,
      empathy: session.responseEmpathy,
      reflection: session.responseReflection,
      action: session.responseAction,
      safety_flag: session.safetyFlag,
    },
  };
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 30);

  if (!limited.ok) {
    return NextResponse.json({ error: "操作太頻繁，請稍後再試。" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const mode = String(body?.mode ?? "");
  const category = String(body?.category ?? "");
  const userInput = String(body?.user_input ?? "").trim();
  const rawMood = body?.mood_score;
  const moodScore =
    rawMood === undefined || rawMood === null || rawMood === "" ? null : Number(rawMood);
  const incomingGuestToken = String(body?.guest_token ?? "").trim();

  if (!isSessionMode(mode) || !isSessionCategory(category)) {
    return NextResponse.json({ error: "模式或分類不正確。" }, { status: 400 });
  }

  if (mode === "emotion_question" && userInput.length < 1) {
    return NextResponse.json({ error: "情緒提問請至少輸入 1 個字。" }, { status: 400 });
  }

  if (userInput.length > 300) {
    return NextResponse.json({ error: "文字最多 300 字。" }, { status: 400 });
  }

  if (moodScore !== null && (!Number.isInteger(moodScore) || moodScore < 1 || moodScore > 5)) {
    return NextResponse.json({ error: "心情分數需介於 1 到 5。" }, { status: 400 });
  }

  const db = getDb();
  const user = await getUserFromRequest(request);
  const guestToken = user ? null : incomingGuestToken || crypto.randomUUID();
  const cards = mode === "card_draw" ? await db.card.findMany() : [];
  const card = cards.length ? cards[Math.floor(Math.random() * cards.length)] : null;
  const result = generateCompanionResult({ mode, category, userInput, card });

  const session = await db.session.create({
    data: {
      userId: user?.id,
      guestToken,
      mode,
      category,
      userInput,
      moodScore,
      cardId: card?.id,
      responseTitle: result.title,
      responseEmpathy: result.empathy,
      responseReflection: result.reflection,
      responseAction: result.action,
      title: result.title,
      emotionScore: moodScore,
      metadata: { source: "fixed_result" },
      safetyFlag: result.safety_flag,
    },
  });

  return NextResponse.json({
    session_id: session.id,
    guest_token: guestToken,
    card: card ? { id: card.id, name: card.name } : null,
    result,
  });
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "請先登入。" }, { status: 401 });
  }

  const category = request.nextUrl.searchParams.get("category");
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const take = 20;

  const sessions = await getDb().session.findMany({
    where: {
      userId: user.id,
      ...(category && isSessionCategory(category) ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: Number.isInteger(page) && page > 1 ? (page - 1) * take : 0,
    take,
    include: { card: { select: { name: true } } },
  });

  return NextResponse.json({ sessions: sessions.map(serializeSession) });
}
