"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  Crown,
  RotateCcw,
  Send,
  Sparkle,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { ShuffleDeck } from "@/components/card-visual";

const modes = [
  ["daily_guidance", "今日指引"],
  ["emotion_question", "情緒提問"],
  ["card_draw", "抽卡互動"],
];

const categories = [
  ["relationship", "關係"],
  ["stress", "壓力"],
  ["career", "方向"],
  ["self_doubt", "自我懷疑"],
  ["sleep", "睡眠"],
];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  safety_flag?: boolean;
};

type UsageState = {
  limit: number;
  used: number;
  remaining: number;
  limit_reached: boolean;
};

function getGuestToken() {
  const existing = localStorage.getItem("soul_guest_token");
  if (existing) return existing;

  const next = crypto.randomUUID();
  localStorage.setItem("soul_guest_token", next);
  return next;
}

export default function ExperiencePage() {
  const [mode, setMode] = useState("emotion_question");
  const [category, setCategory] = useState("stress");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [cardName, setCardName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "我在這裡。你可以慢慢說，不需要一次整理好。",
    },
  ]);
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribePrompt, setSubscribePrompt] = useState(false);
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, subscribePrompt, crisisVisible]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    if (loading) return;
    if (mode === "emotion_question" && !input.trim()) {
      setError("可以先輸入一點想說的話。");
      return;
    }

    const content = input.trim();
    const guestToken = getGuestToken();
    const tempUserId = crypto.randomUUID();

    setError("");
    setInput("");
    setSubscribePrompt(false);
    setLoading(true);

    if (content) {
      setMessages((items) => [...items, { id: tempUserId, role: "user", content }]);
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId || undefined,
        mode,
        category,
        content,
        guest_token: guestToken,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setMessages((items) => items.filter((message) => message.id !== tempUserId));
      setError(data.error ?? "回應暫時沒有送出，請稍後再試。");
      if (data.usage) setUsage(data.usage);
      setSubscribePrompt(Boolean(data.subscribe_prompt));
      if (content) setInput(content);
      return;
    }

    if (data.guest_token) {
      localStorage.setItem("soul_guest_token", data.guest_token);
    }

    setSessionId(data.session_id);
    setCardName(data.card?.name ?? cardName);
    setUsage(data.usage ?? null);
    setSubscribePrompt(Boolean(data.subscribe_prompt));
    setCrisisVisible(Boolean(data.safety?.flagged));
    setMessages((items) => [
      ...items,
      {
        id: data.message.id,
        role: "assistant",
        content: data.message.content,
        safety_flag: Boolean(data.message.safety_flag),
      },
    ]);
  }

  async function sendFeedback(messageId: string, rating: number, reason: string) {
    if (!sessionId || feedbackSent[messageId]) return;

    setFeedbackSent((items) => ({ ...items, [messageId]: reason }));
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        message_id: messageId,
        rating,
        reason,
      }),
    }).catch(() => {
      setFeedbackSent((items) => {
        const next = { ...items };
        delete next[messageId];
        return next;
      });
    });
  }

  function resetChat() {
    setInput("");
    setSessionId("");
    setCardName(null);
    setUsage(null);
    setError("");
    setSubscribePrompt(false);
    setCrisisVisible(false);
    setFeedbackSent({});
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "我在這裡。你可以慢慢說，不需要一次整理好。",
      },
    ]);
  }

  const usageText = usage
    ? `今日剩餘 ${usage.remaining}/${usage.limit} 則`
    : "訪客每日 5 則，登入後每日 10 則";

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_340px]">
      <section className="flex min-h-[calc(100vh-9rem)] flex-col rounded-lg border border-[#e6dfd3] bg-[#fffdf7]">
        <div className="border-b border-[#e6dfd3] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-[#51685a]">AI Companion</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#26332d]">開始 AI 陪伴</h1>
            </div>
            <span className="rounded-lg border border-[#d8c8b2] bg-white px-3 py-2 text-sm font-semibold text-[#51685a]">
              {usageText}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#6c756d]">
            這不是諮商或診斷，而是一段低壓力的情緒整理對話。你可以停在任何地方。
          </p>
          {cardName && (
            <p className="mt-3 inline-flex rounded-lg bg-[#eef2ea] px-3 py-2 text-sm font-semibold text-[#51685a]">
              本次抽到：{cardName}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {crisisVisible && (
            <div className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 shrink-0 text-[#8a3e37]" size={20} aria-hidden="true" />
                <div className="text-sm leading-6 text-[#8a3e37]">
                  <p className="font-semibold">如果你現在可能傷害自己或處在立即危險中，請先離開螢幕尋求現場協助。</p>
                  <p className="mt-1">台灣可撥打 119、110 或 1925 安心專線，也可以請身邊可信任的人陪你前往急診。</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
                    <Bot size={20} aria-hidden="true" />
                  </span>
                )}
                <div
                  className={`max-w-[82%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-[#51685a] text-white"
                      : message.safety_flag
                        ? "border border-[#d9a6a0] bg-[#fff6f3] text-[#8a3e37]"
                        : "bg-[#f8f5ee] text-[#26332d]"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eef2ea] text-[#51685a]">
                    <UserRound size={19} aria-hidden="true" />
                  </span>
                )}
              </div>

              {message.role === "assistant" && message.id !== "welcome" && !message.safety_flag && (
                <div className="ml-[52px] flex flex-wrap items-center gap-2 text-xs text-[#6c756d]">
                  <span>{feedbackSent[message.id] ? "已收到回饋" : "這段回覆有幫助嗎？"}</span>
                  <button
                    type="button"
                    disabled={Boolean(feedbackSent[message.id])}
                    onClick={() => void sendFeedback(message.id, 5, "helpful")}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e6dfd3] bg-white px-2 py-1 font-semibold text-[#51685a] disabled:opacity-60"
                  >
                    <ThumbsUp size={14} aria-hidden="true" />
                    有幫助
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(feedbackSent[message.id])}
                    onClick={() => void sendFeedback(message.id, 2, "not_gentle_enough")}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e6dfd3] bg-white px-2 py-1 font-semibold text-[#51685a] disabled:opacity-60"
                  >
                    <ThumbsDown size={14} aria-hidden="true" />
                    不夠貼近
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && mode === "card_draw" && !sessionId && (
            <div className="rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-5 text-center">
              <ShuffleDeck />
              <p className="font-semibold text-[#26332d]">正在抽取一張反思卡</p>
            </div>
          )}

          {loading && !(mode === "card_draw" && !sessionId) && (
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
                <Bot size={20} aria-hidden="true" />
              </span>
              <div className="rounded-lg bg-[#f8f5ee] px-4 py-3 text-sm text-[#6c756d]">
                正在整理你的訊息...
              </div>
            </div>
          )}

          {subscribePrompt && (
            <div className="rounded-lg border border-[#8da892] bg-[#eef2ea] p-4">
              <div className="flex items-start gap-3">
                <Crown className="mt-1 shrink-0 text-[#51685a]" size={20} aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-[#26332d]">這段對話可以被好好保存</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6c756d]">
                    註冊後可以保存紀錄。Plus 訂閱目前只做方案展示，下一版再接付款與更長期的陪伴功能。
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href="/auth?mode=register&redirect=/records"
                      className="rounded-lg bg-[#51685a] px-4 py-2 text-sm font-semibold text-white"
                    >
                      註冊保存
                    </Link>
                    <Link
                      href="/plans"
                      className="rounded-lg border border-[#d8c8b2] bg-white px-4 py-2 text-sm font-semibold text-[#51685a]"
                    >
                      查看方案
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="border-t border-[#e6dfd3] p-4">
          {error && (
            <p className="mb-3 rounded-lg border border-[#d9a6a0] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a3e37]">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 500))}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              rows={2}
              maxLength={500}
              placeholder={mode === "daily_guidance" ? "可以留白，直接開始今日指引" : "把現在卡住的一小段感受寫下來"}
              className="min-h-14 flex-1 resize-none rounded-lg border border-[#d8c8b2] bg-white px-4 py-3 text-sm leading-6 text-[#26332d] placeholder:text-[#9aa39c]"
            />
            <button
              type="submit"
              disabled={loading}
              className="grid size-14 shrink-0 place-items-center rounded-lg bg-[#51685a] text-white hover:bg-[#43574b] disabled:opacity-60"
              aria-label="送出訊息"
              title="送出訊息"
            >
              <Send size={20} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-right text-xs text-[#6c756d]">{input.length}/500</p>
        </form>
      </section>

      <aside className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 lg:sticky lg:top-24 lg:h-fit">
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
                    resetChat();
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
              <p className="text-sm leading-6 text-[#6c756d]">
                卡片只作為自我反思的提示，不做命運預測。送出後系統會隨機抽一張。
              </p>
            </section>
          )}

          <fieldset>
            <legend className="mb-3 font-semibold text-[#26332d]">這次比較接近哪一類？</legend>
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

          <div className="rounded-lg bg-[#f8f5ee] p-4 text-sm leading-6 text-[#6c756d]">
            <p className="font-semibold text-[#26332d]">使用界線</p>
            <p className="mt-1">AI 回覆只用於陪伴與整理，不提供醫療診斷、法律、投資或危機處理。</p>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
          >
            <RotateCcw size={18} aria-hidden="true" />
            重新開始
          </button>

          {sessionId && (
            <Link
              href={`/result/${sessionId}`}
              className="rounded-lg bg-[#51685a] px-5 py-3 text-center font-semibold text-white hover:bg-[#43574b]"
            >
              查看本次整理
            </Link>
          )}
        </div>
      </aside>
    </main>
  );
}
