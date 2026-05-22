import type { AuthUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export type UsageState = {
  limit: number;
  used: number;
  remaining: number;
  limit_reached: boolean;
};

function todayInTaipei() {
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function getDailyLimit(user: AuthUser | null) {
  if (!user) return 5;
  return user.planType === "plus" ? 50 : 10;
}

export async function getUsageState({
  user,
  guestToken,
}: {
  user: AuthUser | null;
  guestToken: string;
}): Promise<UsageState> {
  const date = todayInTaipei();
  const limit = getDailyLimit(user);
  const usage = await getDb().usageLimit.findFirst({
    where: user ? { userId: user.id, date } : { guestToken, date },
  });
  const used = usage?.messageCount ?? 0;

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    limit_reached: used >= limit,
  };
}

export async function incrementUsage({
  user,
  guestToken,
}: {
  user: AuthUser | null;
  guestToken: string;
}) {
  const db = getDb();
  const date = todayInTaipei();
  const where = user ? { userId: user.id, date } : { guestToken, date };
  const existing = await db.usageLimit.findFirst({ where });

  if (existing) {
    await db.usageLimit.update({
      where: { id: existing.id },
      data: { messageCount: existing.messageCount + 1 },
    });
  } else {
    await db.usageLimit.create({
      data: {
        userId: user?.id,
        guestToken: user ? null : guestToken,
        date,
        messageCount: 1,
      },
    });
  }

  return getUsageState({ user, guestToken });
}
