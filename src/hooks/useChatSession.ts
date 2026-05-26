"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { getGuestToken } from "@/lib/guest-token";
import { getWelcomeMessage, type CompanionCategory, type CompanionMode } from "@/config/labels";

export type ChatConfig = {
  mode: CompanionMode;
  category: CompanionCategory;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  safety_flag?: boolean;
};

export type UsageState = {
  limit: number;
  used: number;
  remaining: number;
  limit_reached: boolean;
};

export type ConversationSummary = {
  title: string;
  timeline: { label: string; text: string }[];
  focus: string;
  next_step: string;
  safety_flag: boolean;
};

export type Me = {
  id: string;
  name: string;
  email: string;
} | null;

type ChatState = {
  sessionId: string;
  cardName: string | null;
  messages: ChatMessage[];
  usage: UsageState | null;
  loading: boolean;
  error: string;
  subscribePrompt: boolean;
  crisisVisible: boolean;
  feedbackSent: Record<string, string>;
  summary: ConversationSummary | null;
  summaryOpen: boolean;
  summaryLoading: boolean;
  summaryError: string;
  user: Me;
};

type ChatResponsePayload = {
  session_id: string;
  card?: { name?: string | null } | null;
  usage?: UsageState | null;
  subscribe_prompt?: boolean;
  safety?: { flagged?: boolean };
  message: {
    id: string;
    content: string;
    safety_flag?: boolean;
  };
};

type Action =
  | { type: "RESET"; mode: CompanionMode }
  | { type: "SET_USER"; user: Me }
  | { type: "SEND_START"; userMessage?: ChatMessage }
  | { type: "SEND_SUCCESS"; payload: ChatResponsePayload }
  | { type: "SEND_ERROR"; error: string; usage?: UsageState | null; subscribePrompt?: boolean; restoreMessageId?: string }
  | { type: "SET_INPUT_ERROR"; error: string }
  | { type: "FEEDBACK_START"; messageId: string; reason: string }
  | { type: "FEEDBACK_ROLLBACK"; messageId: string }
  | { type: "SUMMARY_START" }
  | { type: "SUMMARY_SUCCESS"; summary: ConversationSummary }
  | { type: "SUMMARY_ERROR"; error: string }
  | { type: "CLOSE_SUMMARY" };

function initialState(mode: CompanionMode): ChatState {
  return {
    sessionId: "",
    cardName: null,
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(mode),
      },
    ],
    usage: null,
    loading: false,
    error: "",
    subscribePrompt: false,
    crisisVisible: false,
    feedbackSent: {},
    summary: null,
    summaryOpen: false,
    summaryLoading: false,
    summaryError: "",
    user: null,
  };
}

function chatReducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "RESET":
      return { ...initialState(action.mode), user: state.user };
    case "SET_USER":
      return { ...state, user: action.user };
    case "SEND_START":
      return {
        ...state,
        error: "",
        subscribePrompt: false,
        summaryOpen: false,
        loading: true,
        messages: action.userMessage ? [...state.messages, action.userMessage] : state.messages,
      };
    case "SEND_SUCCESS":
      return {
        ...state,
        loading: false,
        sessionId: action.payload.session_id,
        cardName: action.payload.card?.name ?? state.cardName,
        usage: action.payload.usage ?? null,
        subscribePrompt: Boolean(action.payload.subscribe_prompt),
        crisisVisible: Boolean(action.payload.safety?.flagged),
        messages: [
          ...state.messages,
          {
            id: action.payload.message.id,
            role: "assistant",
            content: action.payload.message.content,
            safety_flag: Boolean(action.payload.message.safety_flag),
          },
        ],
      };
    case "SEND_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
        usage: action.usage ?? state.usage,
        subscribePrompt: Boolean(action.subscribePrompt),
        messages: action.restoreMessageId
          ? state.messages.filter((message) => message.id !== action.restoreMessageId)
          : state.messages,
      };
    case "SET_INPUT_ERROR":
      return { ...state, error: action.error };
    case "FEEDBACK_START":
      return {
        ...state,
        feedbackSent: { ...state.feedbackSent, [action.messageId]: action.reason },
      };
    case "FEEDBACK_ROLLBACK": {
      const next = { ...state.feedbackSent };
      delete next[action.messageId];
      return { ...state, feedbackSent: next };
    }
    case "SUMMARY_START":
      return { ...state, summaryError: "", summaryLoading: true };
    case "SUMMARY_SUCCESS":
      return { ...state, summaryLoading: false, summary: action.summary, summaryOpen: true };
    case "SUMMARY_ERROR":
      return { ...state, summaryLoading: false, summaryError: action.error };
    case "CLOSE_SUMMARY":
      return { ...state, summaryOpen: false };
    default:
      return state;
  }
}

export function useChatSession(config: ChatConfig | null) {
  const [state, dispatch] = useReducer(
    chatReducer,
    config?.mode ?? "emotion_question",
    initialState,
  );

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "SET_USER", user: data.user ?? null }))
      .catch(() => dispatch({ type: "SET_USER", user: null }));
  }, []);

  useEffect(() => {
    if (config) {
      dispatch({ type: "RESET", mode: config.mode });
    }
  }, [config]);

  const userMessageCount = useMemo(
    () => state.messages.filter((message) => message.role === "user").length,
    [state.messages],
  );
  const canSummarize = Boolean(state.sessionId) && userMessageCount >= 5;

  const sendMessage = useCallback(
    async (content: string) => {
      if (!config || state.loading) return { ok: false, restore: content };

      const trimmed = content.trim();
      if (config.mode === "emotion_question" && !trimmed) {
        dispatch({ type: "SET_INPUT_ERROR", error: "情緒提問需要先輸入一點內容，哪怕只有一句也可以。" });
        return { ok: false, restore: content };
      }

      const guestToken = getGuestToken();
      const tempUserId = crypto.randomUUID();
      const userMessage = trimmed
        ? {
            id: tempUserId,
            role: "user" as const,
            content: trimmed,
          }
        : undefined;

      dispatch({ type: "SEND_START", userMessage });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: state.sessionId || undefined,
          mode: config.mode,
          category: config.category,
          content: trimmed,
          guest_token: guestToken,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({
          type: "SEND_ERROR",
          error: data.error ?? "剛剛沒有成功送出，請稍後再試一次。",
          usage: data.usage,
          subscribePrompt: Boolean(data.subscribe_prompt),
          restoreMessageId: userMessage?.id,
        });
        return { ok: false, restore: content };
      }

      if (data.guest_token) {
        localStorage.setItem("soul_guest_token", data.guest_token);
      }

      dispatch({ type: "SEND_SUCCESS", payload: data });
      return { ok: true, restore: "" };
    },
    [config, state.loading, state.sessionId],
  );

  const sendFeedback = useCallback(
    async (messageId: string, rating: number, reason: string) => {
      if (!state.sessionId || state.feedbackSent[messageId]) return;

      dispatch({ type: "FEEDBACK_START", messageId, reason });
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: state.sessionId,
          message_id: messageId,
          rating,
          reason,
        }),
      }).catch(() => dispatch({ type: "FEEDBACK_ROLLBACK", messageId }));
    },
    [state.sessionId, state.feedbackSent],
  );

  const generateSummary = useCallback(async () => {
    if (!state.sessionId || state.summaryLoading) return;

    dispatch({ type: "SUMMARY_START" });
    const response = await fetch(`/api/chat/${state.sessionId}/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guest_token: getGuestToken() }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      dispatch({
        type: "SUMMARY_ERROR",
        error: data.error ?? "暫時無法整理這段對話，請稍後再試。",
      });
      return;
    }

    dispatch({ type: "SUMMARY_SUCCESS", summary: data.summary });
  }, [state.sessionId, state.summaryLoading]);

  const reset = useCallback(() => {
    if (config) {
      dispatch({ type: "RESET", mode: config.mode });
    }
  }, [config]);

  const closeSummary = useCallback(() => dispatch({ type: "CLOSE_SUMMARY" }), []);

  return {
    ...state,
    userMessageCount,
    canSummarize,
    sendMessage,
    sendFeedback,
    generateSummary,
    closeSummary,
    reset,
  };
}
