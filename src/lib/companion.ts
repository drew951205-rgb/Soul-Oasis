import type { SessionCategory, SessionMode } from "@/generated/prisma/enums";
import type { CardModel } from "@/generated/prisma/models/Card";

export const modeLabels: Record<SessionMode, string> = {
  daily_guidance: "今日指引",
  emotion_question: "情緒提問",
  card_draw: "抽卡互動",
};

export const categoryLabels: Record<SessionCategory, string> = {
  relationship: "感情",
  stress: "壓力",
  career: "人生方向",
  self_doubt: "自我懷疑",
  sleep: "睡眠",
};

export const sensitiveTerms = [
  "自殺",
  "輕生",
  "自殘",
  "自傷",
  "想死",
  "想消失",
  "活不下去",
  "不想活",
  "結束生命",
  "了結自己",
];

export type CompanionResult = {
  title: string;
  empathy: string;
  reflection: string;
  action: string;
  safety_flag: boolean;
};

const categoryCopy: Record<
  SessionCategory,
  { title: string; empathy: string; reflection: string; action: string }
> = {
  relationship: {
    title: "先把心裡真正受傷的地方放輕一點",
    empathy: "你在意這段關係，所以每個細節都容易被放大，這份不安其實很需要被接住。",
    reflection: "你可以先問自己，現在最需要的是被理解、被確認，還是有一段清楚的界線。",
    action: "今天先寫下想說的一句真心話，等情緒穩一點，再決定要不要溝通。",
  },
  stress: {
    title: "今天你更需要的是先安定自己",
    empathy: "你像是同時背著很多任務與期待，心裡其實已經撐了很久。",
    reflection: "試著分辨這份壓力來自事情本身，還是來自害怕自己沒有做好。",
    action: "先完成一件最小且明確的事，其他事情暫時排到明天再整理。",
  },
  career: {
    title: "方向不必一次確定，先看見下一步",
    empathy: "你不是沒有努力，而是站在很多可能之間，難免會覺得每個選擇都很重。",
    reflection: "你可以問自己，哪個方向讓你比較接近想成為的生活，而不只是別人的期待。",
    action: "選一件可以在一週內嘗試的小行動，用結果來幫你校準方向。",
  },
  self_doubt: {
    title: "你不需要用疲憊時的眼光定義自己",
    empathy: "當你一直懷疑自己，內心其實正在承受很多沒有說出口的壓力。",
    reflection: "先看看你對自己的批評，哪些是事實，哪些只是焦慮替你下的結論。",
    action: "今天記下一件你有完成的小事，讓自己重新看見可被信任的部分。",
  },
  sleep: {
    title: "把今晚留給身體，不急著想通全部",
    empathy: "睡不安穩常常不是你不夠放鬆，而是白天的情緒還沒有被好好放下。",
    reflection: "你可以問自己，今晚腦中反覆出現的事，真的需要現在解決嗎。",
    action: "睡前把待辦寫在紙上，做三次慢呼吸，讓明天再接手未完成的事。",
  },
};

export function hasSafetyRisk(text: string) {
  return sensitiveTerms.some((term) => text.includes(term));
}

export function crisisResult(): CompanionResult {
  return {
    title: "請先把安全放在第一位",
    empathy: "你現在的感受可能已經超過一個人獨自承受的範圍，請先讓身邊可信任的人知道。",
    reflection: "如果你有立即傷害自己的想法，這不是需要獨自整理的問題，而是需要即時協助。",
    action: "請立刻聯絡當地緊急服務、1925 安心專線，或前往最近的急診與安全地點。",
    safety_flag: true,
  };
}

export function generateCompanionResult({
  mode,
  category,
  userInput,
  card,
}: {
  mode: SessionMode;
  category: SessionCategory;
  userInput: string;
  card?: CardModel | null;
}): CompanionResult {
  if (hasSafetyRisk(userInput)) {
    return crisisResult();
  }

  const base = categoryCopy[category];

  if (mode === "daily_guidance") {
    return {
      title: base.title,
      empathy: base.empathy,
      reflection: base.reflection,
      action: base.action,
      safety_flag: false,
    };
  }

  if (mode === "card_draw" && card) {
    return {
      title: `今天抽到「${card.name}」`,
      empathy: card.uprightMeaning,
      reflection: card.reversedMeaning,
      action: "把這張卡當成整理思緒的提醒，今天只選一件能讓自己更穩的事。",
      safety_flag: false,
    };
  }

  return {
    title: base.title,
    empathy: base.empathy,
    reflection: base.reflection,
    action: userInput.trim()
      ? "把問題拆成一個能在今天處理的小步驟，先照顧最靠近你的那一件事。"
      : base.action,
    safety_flag: false,
  };
}

export function isSessionMode(value: string): value is SessionMode {
  return ["daily_guidance", "emotion_question", "card_draw"].includes(value);
}

export function isSessionCategory(value: string): value is SessionCategory {
  return ["relationship", "stress", "career", "self_doubt", "sleep"].includes(value);
}
