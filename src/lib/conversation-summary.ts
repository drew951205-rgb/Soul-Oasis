import OpenAI from "openai";

type SummaryMessage = {
  role: string;
  content: string;
  safetyFlag?: boolean;
};

export type ConversationSummary = {
  title: string;
  timeline: { label: string; text: string }[];
  focus: string;
  next_step: string;
  safety_flag: boolean;
};

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;

  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openai;
}

function clip(text: string, max = 90) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function fallbackSummary(messages: SummaryMessage[]): ConversationSummary {
  const userMessages = messages.filter((message) => message.role === "user");
  const assistantMessages = messages.filter((message) => message.role === "assistant");
  const firstUser = userMessages[0]?.content ?? "你開始說出最近心裡卡住的地方。";
  const lastUser = userMessages.at(-1)?.content ?? firstUser;
  const lastAssistant = assistantMessages.at(-1)?.content ?? "先把感受放慢，看見自己已經承受的重量。";

  return {
    title: "這次對話先幫你把感受放回原位",
    timeline: [
      {
        label: "一開始",
        text: clip(firstUser),
      },
      {
        label: "中間",
        text: userMessages.length > 1 ? clip(userMessages[Math.floor(userMessages.length / 2)].content) : "你開始讓模糊的情緒有一點輪廓。",
      },
      {
        label: "後來",
        text: clip(lastUser),
      },
      {
        label: "陪伴整理",
        text: clip(lastAssistant),
      },
    ],
    focus: "這段對話比較像是在替壓力、擔心或疲憊找出可以被看見的位置，而不是急著得到一個標準答案。",
    next_step: "接下來可以先選一件最小、最不耗力的事完成，讓自己先回到比較穩的節奏。",
    safety_flag: false,
  };
}

function crisisSummary(): ConversationSummary {
  return {
    title: "先把安全放在第一位",
    timeline: [
      { label: "提醒", text: "這段對話出現了可能需要即時支持的訊號。" },
      { label: "界線", text: "Soul Oasis 不能處理危機，也不能取代醫療或現場協助。" },
      { label: "現在", text: "請先離開獨處狀態，聯絡身邊可信任的人或當地緊急協助。" },
    ],
    focus: "現在最重要的不是分析原因，而是讓你身邊出現真實、可立即回應的人。",
    next_step: "若你在台灣，請立即撥打 119、110 或 1925 安心專線；也可以請身邊可信任的人陪你前往急診。",
    safety_flag: true,
  };
}

function parseSummary(text: string): ConversationSummary | null {
  const jsonText = text.match(/\{[\s\S]*\}/)?.[0] ?? text;

  try {
    const parsed = JSON.parse(jsonText) as Partial<ConversationSummary>;
    if (!parsed.title || !parsed.focus || !parsed.next_step || !Array.isArray(parsed.timeline)) {
      return null;
    }

    return {
      title: clip(String(parsed.title), 42),
      timeline: parsed.timeline.slice(0, 4).map((item) => ({
        label: clip(String(item?.label ?? "整理"), 12),
        text: clip(String(item?.text ?? ""), 110),
      })),
      focus: clip(String(parsed.focus), 110),
      next_step: clip(String(parsed.next_step), 110),
      safety_flag: Boolean(parsed.safety_flag),
    };
  } catch {
    return null;
  }
}

export async function createConversationSummary(messages: SummaryMessage[]) {
  if (messages.some((message) => message.safetyFlag)) {
    return crisisSummary();
  }

  const client = getOpenAI();
  if (!client) return fallbackSummary(messages);

  const transcript = messages
    .slice(-16)
    .map((message) => `${message.role === "assistant" ? "陪伴者" : "使用者"}：${message.content}`)
    .join("\n");

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
    instructions: `
你是 Soul Oasis 的溫和陪伴整理者。
請根據對話產生「對話小結」，只做情緒整理與自我反思，不做心理治療、診斷、法律、投資或醫療建議。
語氣要安靜、自然、不雞湯、不保證結果。
只能回傳 JSON，不要加 markdown。
JSON 欄位：
{
  "title": "20字內的溫和標題",
  "timeline": [
    { "label": "一開始", "text": "20到60字" },
    { "label": "中間", "text": "20到60字" },
    { "label": "後來", "text": "20到60字" },
    { "label": "整理", "text": "20到60字" }
  ],
  "focus": "這次對話的主要情緒或卡點，30到80字",
  "next_step": "一個低壓力下一步，30到80字",
  "safety_flag": false
}
`.trim(),
    input: transcript,
    max_output_tokens: 520,
  });

  return parseSummary(response.output_text) ?? fallbackSummary(messages);
}
