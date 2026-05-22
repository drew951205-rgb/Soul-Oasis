"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Crown, RotateCcw, Send, Sparkle, UserRound } from "lucide-react";
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

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
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
      content: "我在。你可以慢慢說，不需要整理得很完整。",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribePrompt, setSubscribePrompt] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, subscribePrompt]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    if (loading) return;
    if (mode === "emotion_question" && !input.trim()) {
      setError("可以先輸入一點想說的話。");
      return;
    }

    const content = input.trim();
    const guestToken = getGuestToken();
    setError("");
    setInput("");
    setSubscribePrompt(false);
    setLoading(true);

    if (content) {
      setMessages((items) => [
        ...items,
        { id: crypto.randomUUID(), role: "user", content },
      ]);
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
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "訊息送出失敗，請再試一次。");
      if (content) {
        setInput(content);
      }
      return;
    }

    if (data.guest_token) {
      localStorage.setItem("soul_guest_token", data.guest_token);
    }

    setSessionId(data.session_id);
    setCardName(data.card?.name ?? cardName);
    setSubscribePrompt(Boolean(data.subscribe_prompt));
    setMessages((items) => [
      ...items,
      {
        id: data.message.id,
        role: "assistant",
        content: data.message.content,
      },
    ]);
  }

  function resetChat() {
    setInput("");
    setSessionId("");
    setCardName(null);
    setError("");
    setSubscribePrompt(false);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "我在。你可以慢慢說，不需要整理得很完整。",
      },
    ]);
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_340px]">
      <section className="flex min-h-[calc(100vh-9rem)] flex-col rounded-lg border border-[#e6dfd3] bg-[#fffdf7]">
        <div className="border-b border-[#e6dfd3] p-5">
          <p className="text-sm font-semibold uppercase text-[#51685a]">AI Companion</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#26332d]">開始 AI 陪伴</h1>
          <p className="mt-2 text-sm leading-6 text-[#6c756d]">
            這裡不是要立刻解決問題，而是陪你把感受慢慢說下去。
          </p>
          {cardName && (
            <p className="mt-3 inline-flex rounded-lg bg-[#eef2ea] px-3 py-2 text-sm font-semibold text-[#51685a]">
              本次抽到：{cardName}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.map((message) => (
            <div
              key={message.id}
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
          ))}

          {loading && mode === "card_draw" && !sessionId && (
            <div className="rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-5 text-center">
              <ShuffleDeck />
              <p className="font-semibold text-[#26332d]">正在為你抽一張整理卡</p>
            </div>
          )}

          {loading && !(mode === "card_draw" && !sessionId) && (
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
                <Bot size={20} aria-hidden="true" />
              </span>
              <div className="rounded-lg bg-[#f8f5ee] px-4 py-3 text-sm text-[#6c756d]">
                陪伴師正在回應...
              </div>
            </div>
          )}

          {subscribePrompt && (
            <div className="rounded-lg border border-[#8da892] bg-[#eef2ea] p-4">
              <div className="flex items-start gap-3">
                <Crown className="mt-1 shrink-0 text-[#51685a]" size={20} aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-[#26332d]">這段對話已經有一點深度了</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6c756d]">
                    若你想保留完整陪伴紀錄，可以註冊保存。Plus 訂閱會在下一版開放更多長期陪伴功能。
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
              placeholder={
                mode === "daily_guidance"
                  ? "也可以不輸入，直接送出。"
                  : "慢慢說，想到什麼都可以。"
              }
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
                卡片只作為自我反思與情緒投射，不代表命運預測。
              </p>
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

          <button
            type="button"
            onClick={resetChat}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
          >
            <RotateCcw size={18} aria-hidden="true" />
            開始新的陪伴
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
