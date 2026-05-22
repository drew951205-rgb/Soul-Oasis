"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, RotateCcw, Send, Sparkle, UserRound } from "lucide-react";
import { ShuffleDeck } from "@/components/card-visual";

const modes = [
  ["daily_guidance", "今日指引"],
  ["emotion_question", "情緒提問"],
  ["card_draw", "抽卡互動"],
];

const categories = [
  ["relationship", "感情"],
  ["stress", "壓力"],
  ["career", "人生方向"],
  ["self_doubt", "自我懷疑"],
  ["sleep", "睡眠"],
];

function getGuestToken() {
  const existing = localStorage.getItem("soul_guest_token");
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem("soul_guest_token", next);
  return next;
}

type CompanionDraft = {
  sessionId: string;
  cardName?: string | null;
  result: {
    title: string;
    empathy: string;
    reflection: string;
    action: string;
    safety_flag: boolean;
  };
};

export default function ExperiencePage() {
  const router = useRouter();
  const [mode, setMode] = useState("daily_guidance");
  const [category, setCategory] = useState("stress");
  const [userInput, setUserInput] = useState("");
  const [moodScore, setMoodScore] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<CompanionDraft | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setDraft(null);
    setLoading(true);
    const startedAt = Date.now();

    const guestToken = getGuestToken();
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        category,
        user_input: userInput,
        mood_score: moodScore || undefined,
        guest_token: guestToken,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(data.error ?? "送出失敗，請再試一次。");
      return;
    }

    if (data.guest_token) {
      localStorage.setItem("soul_guest_token", data.guest_token);
    }

    if (mode === "card_draw") {
      await new Promise((resolve) =>
        window.setTimeout(resolve, Math.max(0, 1500 - (Date.now() - startedAt))),
      );
    }

    setDraft({
      sessionId: data.session_id,
      cardName: data.card?.name ?? null,
      result: data.result,
    });
    setLoading(false);
  }

  const companionLines = draft
    ? [draft.result.empathy, draft.result.reflection, draft.result.action]
    : [];

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-[#51685a]">AI Companion</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#26332d]">想說什麼，都可以先放在這裡。</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#6c756d]">
          這裡不是要立刻解決問題，而是陪你把感受慢慢說清楚。回覆會保持簡短、溫和，不說教。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 sm:p-7">
          <div className="mb-6 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
              <Bot size={20} aria-hidden="true" />
            </span>
            <div className="rounded-lg bg-[#f8f5ee] px-4 py-3">
              <p className="text-sm leading-6 text-[#6c756d]">
                我會陪你慢慢整理。可以只說一點點，也可以先選一種模式開始。
              </p>
            </div>
          </div>

          {userInput.trim() && (
            <div className="mb-6 flex items-start justify-end gap-3">
              <div className="max-w-[82%] rounded-lg bg-[#51685a] px-4 py-3 text-white">
                <p className="whitespace-pre-wrap text-sm leading-6">{userInput}</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eef2ea] text-[#51685a]">
                <UserRound size={19} aria-hidden="true" />
              </span>
            </div>
          )}

          {loading && mode !== "card_draw" && (
            <div className="mb-6 flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
                <Bot size={20} aria-hidden="true" />
              </span>
              <div className="rounded-lg bg-[#f8f5ee] px-4 py-3">
                <p className="text-sm leading-6 text-[#6c756d]">我正在讀你剛剛說的話...</p>
              </div>
            </div>
          )}

          {draft && (
            <div className="mb-6 flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
                <Bot size={20} aria-hidden="true" />
              </span>
              <div className="max-w-[88%] rounded-lg bg-[#f8f5ee] px-4 py-3">
                <p className="font-semibold text-[#26332d]">{draft.result.title}</p>
                <div className="mt-2 space-y-2 text-sm leading-6 text-[#6c756d]">
                  {companionLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {draft.cardName && (
                  <p className="mt-3 text-xs font-semibold text-[#51685a]">
                    這次抽到：{draft.cardName}
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="grid gap-6 border-t border-[#e6dfd3] pt-6">
            <label className="grid gap-3">
              <span className="font-semibold text-[#26332d]">你現在想說的話</span>
              <textarea
                value={userInput}
                onChange={(event) => setUserInput(event.target.value.slice(0, 300))}
                rows={5}
                maxLength={300}
                placeholder="例如：我最近好累，不太知道自己怎麼了。"
                className="resize-none rounded-lg border border-[#d8c8b2] bg-white px-4 py-3 leading-7 text-[#26332d] placeholder:text-[#9aa39c]"
              />
              <span className="text-right text-xs text-[#6c756d]">{userInput.length}/300</span>
            </label>

            {error && (
              <p className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a3e37]">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b] disabled:opacity-60"
              >
                {mode === "card_draw" ? <Sparkle size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                {loading ? (mode === "card_draw" ? "抽卡中..." : "陪伴中...") : mode === "card_draw" ? "開始抽卡" : "開始 AI 陪伴"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserInput("");
                  setMoodScore("");
                  setError("");
                  setDraft(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
              >
                <RotateCcw size={18} aria-hidden="true" />
                清空重來
              </button>
              {draft && (
                <button
                  type="button"
                  onClick={() => router.push(`/result/${draft.sessionId}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-[#f8f5ee] px-5 py-3 font-semibold text-[#51685a] hover:bg-white"
                >
                  查看整理結果
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </form>
        </section>

        <aside className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5">
          <div className="grid gap-6">
            <fieldset>
              <legend className="mb-3 font-semibold text-[#26332d]">陪伴模式</legend>
              <div className="grid gap-3">
                {modes.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setMode(value);
                      setDraft(null);
                    }}
                    className={`rounded-lg border px-4 py-3 text-left font-medium ${
                      mode === value
                        ? "border-[#51685a] bg-[#d8e2d5] text-[#26332d]"
                        : "border-[#e6dfd3] bg-white text-[#51685a]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            {mode === "card_draw" && (
              <section className="rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-5">
                <div className="relative h-32">
                  <div className="absolute left-1/2 top-1/2 h-28 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-lg border border-[#d8c8b2] bg-[#fffdf7]" />
                  <div className="absolute left-1/2 top-1/2 h-28 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[7deg] rounded-lg border border-[#d8c8b2] bg-[#fffdf7]" />
                  <div className="soul-card-idle absolute left-1/2 top-1/2 grid h-28 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-[#d8c8b2] bg-[#fffdf7] text-[#51685a]">
                    <Sparkle size={22} aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-[#26332d]">送出後會抽一張整理卡</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6c756d]">
                    卡片只作為自我反思與情緒投射，不代表命運預測。
                  </p>
                </div>
              </section>
            )}

            <fieldset>
              <legend className="mb-3 font-semibold text-[#26332d]">現在比較像哪一類</legend>
              <div className="flex flex-wrap gap-2">
                {categories.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                      category === value
                        ? "border-[#51685a] bg-[#51685a] text-white"
                        : "border-[#e6dfd3] bg-white text-[#51685a]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 font-semibold text-[#26332d]">此刻心情分數</legend>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setMoodScore(String(score))}
                    className={`grid size-10 place-items-center rounded-lg border font-semibold ${
                      moodScore === String(score)
                        ? "border-[#51685a] bg-[#d8e2d5] text-[#26332d]"
                        : "border-[#e6dfd3] bg-white text-[#51685a]"
                    }`}
                    aria-label={`心情 ${score} 分`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </aside>
      </div>

      {loading && mode === "card_draw" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#26332d]/35 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-6 text-center shadow-xl">
            <ShuffleDeck />
            <h2 className="mt-2 text-xl font-semibold text-[#26332d]">正在為你抽一張卡</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c756d]">
              先深呼吸一下，讓這次回應成為整理思緒的入口。
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
