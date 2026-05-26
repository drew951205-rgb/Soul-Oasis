import type { UsageState } from "@/hooks/useChatSession";

export function UsageBar({ usage }: { usage: UsageState | null }) {
  const usageText = usage
    ? `今日剩餘 ${usage.remaining}/${usage.limit} 則`
    : "訪客每日 5 則，登入後每日 10 則";

  return (
    <span className="rounded-lg border border-[#d8c8b2] bg-white px-3 py-2 text-sm font-semibold text-[#51685a]">
      {usageText}
    </span>
  );
}
