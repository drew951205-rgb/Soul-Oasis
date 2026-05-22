import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const user = await getUserFromRequest(request);
  const guestToken = request.nextUrl.searchParams.get("guest_token") ?? "";

  const session = await getDb().session.findFirst({
    where: user ? { id, userId: user.id } : { id, guestToken },
    include: {
      card: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "找不到這段對話。" }, { status: 404 });
  }

  return NextResponse.json({
    session: {
      id: session.id,
      mode: session.mode,
      category: session.category,
      card_name: session.card?.name ?? null,
      messages: session.messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        created_at: message.createdAt,
      })),
    },
  });
}
