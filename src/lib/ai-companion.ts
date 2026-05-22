import OpenAI from "openai";
import type { ChatMessageModel } from "@/generated/prisma/models/ChatMessage";
import type { SessionCategory, SessionMode } from "@/generated/prisma/enums";
import {
  categoryLabels,
  crisisResult,
  generateCompanionResult,
  hasSafetyRisk,
  modeLabels,
} from "@/lib/companion";

export const companionSystemPrompt = `
你是一位溫和、安靜、不批判的 AI 陪伴師。

產品定位：
- 你不是心理治療師
- 你不是醫師
- 你不做精神診斷
- 你不提供醫療、法律、投資建議
- 你不處理急性危機

你的目標不是解決使用者的人生問題，而是讓使用者願意安心地繼續說下去。

你必須做到：
- 主動傾聽
- 反映使用者的情緒
- 用自然語氣回應
- 使用開放式提問
- 不批判、不說教、不強迫正向
- 不要像客服，不要列大量條列
- 不要保證結果，不要鼓勵依賴平台

每次回覆規則：
- 使用繁體中文
- 2 到 5 句
- 每句自然、短一點
- 可以有一個溫和的問題，引導使用者繼續說
- 不要使用「你應該」「你必須」「一定會好」這類語氣

危機處理：
若使用者表達自殺、自傷、立即危險或急性精神危機，不要一般陪伴式回應。
請簡短提醒他立刻聯絡當地緊急服務、可信任的人、或前往急診。
`.trim();

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openai;
}

function transcriptFromMessages(messages: Pick<ChatMessageModel, "role" | "content">[]) {
  return messages
    .slice(-12)
    .map((message) => {
      const role = message.role === "assistant" ? "陪伴師" : "使用者";
      return `${role}：${message.content}`;
    })
    .join("\n");
}

export function shouldShowSubscriptionPrompt(userMessageCount: number, isMember: boolean) {
  if (isMember) {
    return userMessageCount >= 8 && userMessageCount % 4 === 0;
  }

  return userMessageCount >= 4;
}

export async function createCompanionReply({
  mode,
  category,
  userInput,
  messages,
  cardName,
}: {
  mode: SessionMode;
  category: SessionCategory;
  userInput: string;
  messages: Pick<ChatMessageModel, "role" | "content">[];
  cardName?: string | null;
}) {
  if (hasSafetyRisk(userInput)) {
    const crisis = crisisResult();
    return `${crisis.empathy}\n${crisis.reflection}\n${crisis.action}`;
  }

  const client = getOpenAI();

  if (!client) {
    const fallback = generateCompanionResult({ mode, category, userInput });
    return `${fallback.empathy}\n${fallback.reflection}`;
  }

  const context = [
    `模式：${modeLabels[mode]}`,
    `主題：${categoryLabels[category]}`,
    cardName ? `本次抽到的反思卡：${cardName}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const transcript = transcriptFromMessages(messages);
  const input = `
以下是目前對話脈絡，請延續陪伴師人格回覆使用者最新一句話。

${context}

${transcript}

使用者最新訊息：${userInput || "我現在不知道該說什麼。"}
`.trim();

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
    instructions: companionSystemPrompt,
    input,
    max_output_tokens: 260,
  });

  return response.output_text.trim();
}
