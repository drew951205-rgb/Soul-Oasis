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
    title: "先聽見你在意的那一塊",
    empathy: "聽起來，這段關係裡有些感受被你放在心裡一陣子了。",
    reflection: "此刻你比較需要被理解，還是需要一點距離讓自己安靜下來？",
    action: "可以先不用急著回應誰，讓自己的感受有一個清楚的位置。",
  },
  stress: {
    title: "先讓壓力有地方放下來",
    empathy: "感覺你最近承接了不少事，心裡可能一直沒有真正停下來。",
    reflection: "現在最讓你喘不過氣的，是事情本身，還是一直不能放鬆的感覺？",
    action: "今天只挑一件最小的事就好，剩下的可以晚一點再整理。",
  },
  career: {
    title: "方向可以先不用一次確定",
    empathy: "你不是沒有想法，而是每個選擇好像都帶著重量。",
    reflection: "如果先不管別人的期待，哪個方向讓你比較能呼吸？",
    action: "可以先用一個小嘗試靠近它，不必把今天的選擇變成永遠。",
  },
  self_doubt: {
    title: "先不要用疲憊定義自己",
    empathy: "一直懷疑自己真的很累，像心裡有個聲音不停挑錯。",
    reflection: "那個批評你的聲音，是在描述事實，還是在替焦慮說話？",
    action: "可以先記下一件你已經做到的小事，哪怕它很小也算數。",
  },
  sleep: {
    title: "今晚先不急著想通全部",
    empathy: "睡不安穩有時不是你不夠努力，而是心裡還有東西沒放下。",
    reflection: "腦中反覆出現的那件事，真的需要今晚就處理嗎？",
    action: "可以把它寫下來，讓明天的你再接手，今晚先留給身體休息。",
  },
};

export function hasSafetyRisk(text: string) {
  return sensitiveTerms.some((term) => text.includes(term));
}

export function crisisResult(): CompanionResult {
  return {
    title: "請先把安全放在第一位",
    empathy: "你現在的感受可能已經超過一個人獨自承受的範圍。",
    reflection: "如果有立即傷害自己的想法，請先讓身邊可信任的人知道。",
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
      action: "可以把它當成一個提醒：今天先靠近一件讓你比較穩的事。",
      safety_flag: false,
    };
  }

  return {
    title: base.title,
    empathy: base.empathy,
    reflection: base.reflection,
    action: userInput.trim()
      ? "不用立刻解決全部。你可以先說說，這件事最卡住的是哪一部分？"
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
