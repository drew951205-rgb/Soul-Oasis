import Link from "next/link";
import { RotateCcw, Save, X } from "lucide-react";
import type { ConversationSummary, Me } from "@/hooks/useChatSession";

export function SummaryModal({
  summary,
  sessionId,
  user,
  onClose,
  onReset,
}: {
  summary: ConversationSummary;
  sessionId: string;
  user: Me;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#26332d]/30 px-4 py-4 backdrop-blur-sm sm:items-center">
      <section
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] border border-[#e6dfd3] bg-[#fffdf7] p-5 shadow-2xl sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-[#51685a]">Conversation Summary</p>
            <h2 id="summary-title" className="mt-2 text-2xl font-semibold text-[#26332d]">
              {summary.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f8f5ee] text-[#51685a] hover:bg-[#eef2ea]"
            aria-label="關閉小結"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 border-l-2 border-[#e6dfd3] pl-5">
          {summary.timeline.map((item, index) => (
            <section key={`${item.label}-${index}`} className="relative">
              <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-[#8da892]" />
              <h3 className="font-semibold text-[#26332d]">{item.label}</h3>
              <p className="mt-1 text-sm leading-6 text-[#6c756d]">{item.text}</p>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-4">
          <h3 className="font-semibold text-[#26332d]">這次主要卡點</h3>
          <p className="mt-2 text-sm leading-6 text-[#6c756d]">{summary.focus}</p>
        </section>

        <section className="mt-4 rounded-lg border border-[#e6dfd3] bg-[#eef2ea] p-4">
          <h3 className="font-semibold text-[#26332d]">下一步</h3>
          <p className="mt-2 text-sm leading-6 text-[#6c756d]">{summary.next_step}</p>
        </section>

        <p className="mt-4 text-xs leading-5 text-[#6c756d]">
          小結只協助整理本次對話，不代表診斷、治療建議或結果保證。
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
          >
            回到聊天
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
          >
            <RotateCcw size={17} aria-hidden="true" />
            重新開始
          </button>
          <Link
            href={user ? `/records/${sessionId}` : `/auth?mode=register&redirect=/records/${sessionId}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b]"
          >
            <Save size={17} aria-hidden="true" />
            {user ? "查看紀錄" : "註冊保存"}
          </Link>
        </div>
      </section>
    </div>
  );
}
