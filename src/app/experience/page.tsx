"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  BriefcaseBusiness,
  Heart,
  Leaf,
  Moon,
  RotateCcw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  UserRound,
  Waves,
} from "lucide-react";
import { ShuffleDeck } from "@/components/card-visual";

type CompanionMode = "daily_guidance" | "emotion_question" | "card_draw";
type CompanionCategory = "relationship" | "stress" | "career" | "self_doubt" | "sleep";
type Stage = "setup" | "chat";

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

const modes: {
  value: CompanionMode;
  label: string;
  helper: string;
}[] = [
  {
    value: "daily_guidance",
    label: "今日指引",
    helper: "不用先整理好問題，也可以先獲得一段溫和的今日提醒。",
  },
  {
    value: "emotion_question",
    label: "情緒提問",
    helper: "適合把正在卡住的感受說出來，讓 AI 陪你慢慢釐清。",
  },
  {
    value: "card_draw",
    label: "抽卡互動",
    helper: "用一張反思卡當作入口，不做預言，只協助你整理想法。",
  },
];

const categories: {
  value: CompanionCategory;
  label: string;
  icon: typeof Heart;
}[] = [
  { value: "relationship", label: "關係", icon: Heart },
  { value: "stress", label: "壓力", icon: Waves },
  { value: "career", label: "方向", icon: BriefcaseBusiness },
  { value: "self_doubt", label: "自我懷疑", icon: Leaf },
  { value: "sleep", label: "睡眠", icon: Moon },
];

function getGuestToken() {
  const existing = localStorage.getItem("soul_guest_token");
  if (existing) return existing;

  const next = crypto.randomUUID();
  localStorage.setItem("soul_guest_token", next);
  return next;
}

function getWelcomeMessage(mode: CompanionMode) {
  if (mode === "daily_guidance") {
    return "我在這裡。你可以先不用說很多，也可以直接送出，讓我陪你整理今天的狀態。";
  }

  if (mode === "card_draw") {
    return "我在這裡。你可以說說現在心裡最在意的事，或直接送出，讓這張卡成為今天的反思入口。";
  }

  return "我在這裡。你可以慢慢說，不需要一次整理好。";
}

export default function ExperiencePage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [mode, setMode] = useState<CompanionMode>("emotion_question");
  const [category, setCategory] = useState<CompanionCategory>("stress");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [cardName, setCardName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: getWelcomeMessage("emotion_question"),
    },
  ]);
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribePrompt, setSubscribePrompt] = useState(false);
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedMode = useMemo(
    () => modes.find((item) => item.value === mode) ?? modes[1],
    [mode],
  );

  useEffect(() => {
    if (stage === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [stage, messages, loading, subscribePrompt, crisisVisible]);

  function resetConversation(nextStage: Stage = stage) {
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
        content: getWelcomeMessage(mode),
      },
    ]);
    setStage(nextStage);
  }

  function startCompanion() {
    resetConversation("chat");
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    if (loading) return;
    if (mode === "emotion_question" && !input.trim()) {
      setError("情緒提問需要先輸入一點內容，哪怕只有一句也可以。");
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
      setError(data.error ?? "剛剛沒有成功送出，請稍後再試一次。");
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

  const usageText = usage
    ? `今日剩餘 ${usage.remaining}/${usage.limit} 則`
    : "訪客每日 5 則，登入後每日 10 則";

  if (stage === "setup") {
    return (
      <main className="mx-auto max-w-3xl px-5 py-8 md:py-12">
        <section className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 shadow-sm md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-[#51685a]">Companion Setup</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#26332d]">先選一個陪伴模式</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6c756d]">
                這一步只是幫 AI 理解你想用哪種方式開始，選完後再進入陪伴對話。
              </p>
            </div>
            <span className="hidden rounded-full bg-[#eef2ea] px-3 py-1.5 text-xs font-semibold text-[#51685a] sm:inline-flex">
              低壓力開始
            </span>
          </div>

          <fieldset className="mt-7">
            <legend className="sr-only">陪伴模式</legend>
            <div className="grid gap-3">
              {modes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className={`rounded-lg border px-4 py-4 text-left transition ${
                    mode === item.value
                      ? "border-[#51685a] bg-[#d8e2d5] text-[#26332d]"
                      : "border-[#e6dfd3] bg-white text-[#51685a] hover:border-[#c6c8bb]"
                  }`}
                >
                  <span className="block font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-[#6c756d]">{item.helper}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="font-semibold text-[#26332d]">這次比較接近哪一類？</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCategory(item.value)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                      category === item.value
                        ? "border-[#51685a] bg-[#51685a] text-white"
                        : "border-[#e6dfd3] bg-white text-[#51685a] hover:border-[#c6c8bb]"
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {mode === "card_draw" && (
            <div className="mt-7 rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-5">
              <div className="relative mx-auto mb-3 h-24 w-28">
                <div className="absolute left-1/2 top-1/2 h-20 w-14 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-lg border border-[#d8c8b2] bg-[#fffdf7]" />
                <div className="absolute left-1/2 top-1/2 h-20 w-14 -translate-x-1/2 -translate-y-1/2 rotate-[7deg] rounded-lg border border-[#d8c8b2] bg-[#fffdf7]" />
                <div className="soul-card-idle absolute left-1/2 top-1/2 grid h-20 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-[#d8c8b2] bg-[#fffdf7] text-[#51685a]">
                  <Sparkles size={18} aria-hidden="true" />
                </div>
              </div>
              <p className="text-center text-sm leading-6 text-[#6c756d]">
                抽卡只作為自我反思入口，不代表命運預測。
              </p>
            </div>
          )}

          <div className="mt-7 rounded-lg bg-[#f8f5ee] p-4 text-sm leading-6 text-[#6c756d]">
            <p className="font-semibold text-[#26332d]">使用界線</p>
            <p className="mt-1">AI 回覆只用於陪伴與整理，不提供醫療診斷、法律、投資或危機處理。</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={startCompanion}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b]"
            >
              <Bot size={18} aria-hidden="true" />
              開始 AI 陪伴
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("emotion_question");
                setCategory("stress");
                resetConversation("setup");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
            >
              <RotateCcw size={18} aria-hidden="true" />
              重新開始
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <section className="flex min-h-[calc(100vh-11rem)] flex-col overflow-hidden rounded-lg border border-[#e6dfd3] bg-[#fffdf7] shadow-sm">
        <div className="border-b border-[#e6dfd3] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-[#51685a]">AI Companion</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#26332d]">開始 AI 陪伴</h1>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-lg border border-[#d8c8b2] bg-white px-3 py-1.5 text-[#51685a]">
                  {selectedMode.label}
                </span>
                <span className="rounded-lg border border-[#d8c8b2] bg-white px-3 py-1.5 text-[#51685a]">
                  {categories.find((item) => item.value === category)?.label}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-lg border border-[#d8c8b2] bg-white px-3 py-2 text-sm font-semibold text-[#51685a]">
                {usageText}
              </span>
              <button
                type="button"
                onClick={() => resetConversation("setup")}
                className="text-sm font-semibold text-[#51685a] hover:text-[#26332d]"
              >
                重新選模式
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6c756d]">
            這不是諮商或診斷，而是一段低壓力的情緒整理對話。你可以停在任何地方。
          </p>
          {cardName && (
            <p className="mt-3 inline-flex rounded-lg bg-[#eef2ea] px-3 py-2 text-sm font-semibold text-[#51685a]">
              這次抽到：{cardName}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {crisisVisible && (
            <div className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 shrink-0 text-[#8a3e37]" size={20} aria-hidden="true" />
                <div className="text-sm leading-6 text-[#8a3e37]">
                  <p className="font-semibold">如果你正在考慮傷害自己，請先把安全放在第一位。</p>
                  <p className="mt-1">
                    請立即聯絡當地緊急協助、119、1925 安心專線，或找身邊可信任的人陪你。
                  </p>
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
              <p className="font-semibold text-[#26332d]">正在抽出這次的反思卡</p>
            </div>
          )}

          {loading && !(mode === "card_draw" && !sessionId) && (
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
                <Bot size={20} aria-hidden="true" />
              </span>
              <div className="rounded-lg bg-[#f8f5ee] px-4 py-3 text-sm text-[#6c756d]">
                正在陪你整理...
              </div>
            </div>
          )}

          {subscribePrompt && (
            <div className="rounded-lg border border-[#8da892] bg-[#eef2ea] p-4">
              <div>
                <h2 className="font-semibold text-[#26332d]">這段陪伴可以先保存下來</h2>
                <p className="mt-2 text-sm leading-6 text-[#6c756d]">
                  註冊後可以把紀錄留在我的紀錄中；Plus 方案會在之後開放更多保存與回看功能。
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
                  ? "可以留空，或寫下今天的一點感受"
                  : mode === "card_draw"
                    ? "可以留空抽卡，或寫下想反思的事"
                    : "把現在卡住的一小段感受寫下來"
              }
              className="min-h-14 flex-1 resize-none rounded-lg border border-[#d8c8b2] bg-white px-4 py-3 text-sm leading-6 text-[#26332d] placeholder:text-[#9aa39c] focus:border-[#51685a] focus:outline-none"
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
    </main>
  );
}
