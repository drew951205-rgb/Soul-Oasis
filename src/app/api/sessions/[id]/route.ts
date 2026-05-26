import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getDb } from "@/lib/db";

function toDetail(session: {
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
  messages?: { id: string; role: string; content: string; safetyFlag: boolean; createdAt: Date }[];
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
    user_input: session.userInput,
    mood_score: session.moodScore,
    card_name: session.card?.name ?? null,
    result: {
      title: session.responseTitle,
      empathy: session.responseEmpathy,
      reflection: session.responseReflection,
      action: session.responseAction,
      safety_flag: session.safetyFlag,
    },
    summary: {
      has_summary: hasSummary,
      title: hasSummary ? session.responseTitle : "",
      timeline: hasSummary ? summaryTimeline : [],
      focus: hasSummary ? session.responseEmpathy : "",
      next_step: hasSummary ? session.responseAction : "",
    },
    messages: session.messages
      ? session.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          safety_flag: message.safetyFlag,
          created_at: message.createdAt,
        }))
      : [],
  };
}

async function findAuthorizedSession(request: NextRequest, id: string) {
  const user = await getUserFromRequest(request);
  const guestToken = request.nextUrl.searchParams.get("guest_token") ?? "";

  return getDb().session.findFirst({
    where: user ? { id, userId: user.id } : { id, guestToken },
    include: {
      card: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, role: true, content: true, safetyFlag: true, createdAt: true },
      },
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await findAuthorizedSession(request, id);

  if (!session) {
    return NextResponse.json({ error: "找不到這筆紀錄。" }, { status: 404 });
  }

  return NextResponse.json({ session: toDetail(session) });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "請先登入。" }, { status: 401 });
  }

  const { id } = await context.params;
  const session = await getDb().session.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });

  if (!session) {
    return NextResponse.json({ error: "找不到這筆紀錄。" }, { status: 404 });
  }

  await getDb().session.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
