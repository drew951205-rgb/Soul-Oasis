"use client";

import { FormEvent, memo, useEffect, useRef, useState } from "react";
import { Bot, FileText, Send, ThumbsDown, ThumbsUp, UserRound } from "lucide-react";
import { ShuffleDeck } from "@/components/card-visual";
import { COMPANION_MODES, categoryLabels, modeLabels, type CompanionCategory, type CompanionMode } from "@/config/labels";
import type { ChatMessage, useChatSession } from "@/hooks/useChatSession";
import { CrisisAlert } from "./CrisisAlert";
import { SubscribePrompt } from "./SubscribePrompt";
import { SummaryModal } from "./SummaryModal";
import { UsageBar } from "./UsageBar";

type ChatSession = ReturnType<typeof useChatSession>;

const ChatMessageItem = memo(function ChatMessageItem({
  message,
  feedbackSent,
  onFeedback,
}: {
  message: ChatMessage;
  feedbackSent: string | undefined;
  onFeedback: (messageId: string, rating: number, reason: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
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
          <span>{feedbackSent ? "已收到回饋" : "這段回覆有幫助嗎？"}</span>
          <button
            type="button"
            disabled={Boolean(feedbackSent)}
            onClick={() => onFeedback(message.id, 5, "helpful")}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#e6dfd3] bg-white px-3 py-2 font-semibold text-[#51685a] disabled:opacity-60"
          >
            <ThumbsUp size={14} aria-hidden="true" />
            有幫助
          </button>
          <button
            type="button"
            disabled={Boolean(feedbackSent)}
            onClick={() => onFeedback(message.id, 2, "not_gentle_enough")}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#e6dfd3] bg-white px-3 py-2 font-semibold text-[#51685a] disabled:opacity-60"
          >
            <ThumbsDown size={14} aria-hidden="true" />
            不夠貼近
          </button>
        </div>
      )}
    </div>
  );
});

export function ChatInterface({
  mode,
  category,
  session,
  onReset,
}: {
  mode: CompanionMode;
  category: CompanionCategory;
  session: ChatSession;
  onReset: () => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [session.messages, session.loading, session.subscribePrompt, session.crisisVisible]);

  async function submit(event?: FormEvent) {
    event?.preventDefault();

    const currentInput = input;
    setInput("");
    const result = await session.sendMessage(currentInput);
    if (!result.ok) {
      setInput(result.restore);
    }
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
                  {modeLabels[mode]}
                </span>
                <span className="rounded-lg border border-[#d8c8b2] bg-white px-3 py-1.5 text-[#51685a]">
                  {categoryLabels[category]}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <UsageBar usage={session.usage} />
              <button
                type="button"
                onClick={onReset}
                className="min-h-11 text-sm font-semibold text-[#51685a] hover:text-[#26332d]"
              >
                重新選模式
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6c756d]">
            這不是諮商或診斷，而是一段低壓力的情緒整理對話。你可以停在任何地方。
          </p>
          {session.cardName && (
            <p className="mt-3 inline-flex rounded-lg bg-[#eef2ea] px-3 py-2 text-sm font-semibold text-[#51685a]">
              這次抽到：{session.cardName}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {session.crisisVisible && <CrisisAlert />}

          {session.messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              feedbackSent={session.feedbackSent[message.id]}
              onFeedback={(messageId, rating, reason) => void session.sendFeedback(messageId, rating, reason)}
            />
          ))}

          {session.loading && mode === "card_draw" && !session.sessionId && (
            <div className="rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-5 text-center">
              <ShuffleDeck />
              <p className="font-semibold text-[#26332d]">正在抽出這次的反思卡</p>
            </div>
          )}

          {session.loading && !(mode === "card_draw" && !session.sessionId) && (
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
                <Bot size={20} aria-hidden="true" />
              </span>
              <div className="rounded-lg bg-[#f8f5ee] px-4 py-3 text-sm text-[#6c756d]">
                正在陪你整理...
              </div>
            </div>
          )}

          {session.subscribePrompt && <SubscribePrompt />}

          {session.canSummarize && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => void session.generateSummary()}
                disabled={session.summaryLoading}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d8c8b2] bg-white px-5 py-3 text-sm font-semibold text-[#51685a] shadow-sm hover:bg-[#f8f5ee] disabled:opacity-60"
              >
                <FileText size={17} aria-hidden="true" />
                {session.summaryLoading ? "正在整理..." : session.summary ? "查看本次小結" : "整理本次對話"}
              </button>
            </div>
          )}

          {session.summaryError && (
            <p className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a3e37]">
              {session.summaryError}
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={submit} className="border-t border-[#e6dfd3] p-4">
          {session.error && (
            <p className="mb-3 rounded-lg border border-[#d9a6a0] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a3e37]">
              {session.error}
            </p>
          )}
          <div className="flex gap-3">
            <label className="sr-only" htmlFor="companion-message">
              輸入想說的內容
            </label>
            <textarea
              id="companion-message"
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 500))}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submit();
                }
              }}
              rows={2}
              maxLength={500}
              enterKeyHint="send"
              aria-describedby="input-hint"
              placeholder={COMPANION_MODES[mode].placeholder}
              className="min-h-14 flex-1 resize-none rounded-lg border border-[#d8c8b2] bg-white px-4 py-3 text-sm leading-6 text-[#26332d] placeholder:text-[#9aa39c] focus:border-[#51685a] focus:outline-none"
            />
            <span id="input-hint" className="sr-only">
              最多 500 字。Enter 送出，Shift Enter 換行。
            </span>
            <button
              type="submit"
              disabled={session.loading}
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

      {session.summaryOpen && session.summary && (
        <SummaryModal
          summary={session.summary}
          sessionId={session.sessionId}
          user={session.user}
          onClose={session.closeSummary}
          onReset={onReset}
        />
      )}
    </main>
  );
}
