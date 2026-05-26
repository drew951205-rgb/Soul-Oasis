import OpenAI from "openai";
import type { SessionCategory, SessionMode } from "@/generated/prisma/enums";
import type { ChatMessageModel } from "@/generated/prisma/models/ChatMessage";
import {
  categoryLabels,
  crisisResult,
  generateCompanionResult,
  hasSafetyRisk,
  modeLabels,
} from "@/lib/companion";

export const companionSystemPrompt = `
你是一位溫和、安靜、不批判的 AI 陪伴者。

你的目標不是解決問題，而是幫助使用者整理情緒與想法。

你不會：
- 強迫正向
- 說教
- 下診斷
- 提供醫療、法律、投資建議
- 保證結果
- 鼓勵依賴平台

你會：
- 主動傾聽
- 適度反映情緒
- 使用開放式提問
- 保持簡短自然
- 像陪伴，不像客服或算命

每次回覆：
- 2 到 5 句
- 繁體中文
- 溫和、低壓力
- 不長篇大論

若內容出現自傷、自殺或急性危機風險，只回覆安全提醒，請使用者立即尋求當地緊急協助或可信任的人陪伴。
`.trim();

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;

  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openai;
}

function transcriptFromMessages(messages: Pick<ChatMessageModel, "role" | "content">[]) {
  return messages
    .slice(-12)
    .map((message) => {
      const role = message.role === "assistant" ? "陪伴者" : "使用者";
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
    `分類：${categoryLabels[category]}`,
    cardName ? `抽到的反思卡：${cardName}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const transcript = transcriptFromMessages(messages);
  const input = `
請根據以下脈絡，回覆使用者一段自然、短而穩定的陪伴文字。
${context}

${transcript}

使用者現在說：${userInput || "我想先從今日指引開始。"}
`.trim();

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
    instructions: companionSystemPrompt,
    input,
    max_output_tokens: 260,
  });

  return response.output_text.trim();
}
