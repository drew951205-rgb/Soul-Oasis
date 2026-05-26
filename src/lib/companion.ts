import type { SessionCategory, SessionMode } from "@/generated/prisma/enums";
import type { CardModel } from "@/generated/prisma/models/Card";
import {
  categoryLabels,
  isCompanionCategory,
  isCompanionMode,
  modeLabels,
} from "@/config/labels";

export { categoryLabels, modeLabels };

export const sensitiveTerms = [
  "自殺",
  "自盡",
  "輕生",
  "自殘",
  "自傷",
  "割腕",
  "燒炭",
  "上吊",
  "跳樓",
  "活不下去",
  "想消失",
  "不想活",
  "結束生命",
];

const falsePositiveContexts = [
  "不想消失在大家面前",
  "怕自己消失",
  "自殘式加班",
  "想消失一下",
];

const intentTerms = ["自殺", "自盡", "輕生", "不想活", "活不下去", "結束生命"];
const selfHarmTerms = ["自殘", "自傷", "割腕"];
const urgencyTerms = ["現在", "今晚", "今天", "馬上", "立刻", "撐不下去"];
const methodTerms = ["燒炭", "上吊", "跳樓", "刀", "藥", "繩子"];

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
    title: "先看見關係裡真正累的地方",
    empathy: "你在意這段關係，所以才會反覆想著那些沒有被好好接住的感受。",
    reflection: "可以先分辨，現在最痛的是事件本身，還是你覺得自己不被理解。",
    action: "今天先不急著定義關係，寫下一句你真正想被聽見的話就好。",
  },
  stress: {
    title: "先讓壓力有一個可以放下的位置",
    empathy: "你像是同時背著很多件事，身體和心裡都已經很用力了。",
    reflection: "可以問問自己，這份壓力是來自事情本身，還是來自害怕失控。",
    action: "先選一件最小的事完成，其他事情暫時不要一起扛在身上。",
  },
  career: {
    title: "迷惘時先不用急著做出答案",
    empathy: "你不是沒有方向，而是眼前的選項都帶著重量，所以很難輕鬆決定。",
    reflection: "可以先觀察，哪個選擇讓你比較接近想成為的自己，而不是只避開害怕。",
    action: "今天先列出一個可嘗試的小行動，不需要立刻承諾整條路。",
  },
  self_doubt: {
    title: "把自我懷疑放慢一點看",
    empathy: "一直檢查自己是不是夠好，其實會讓心裡很疲憊。",
    reflection: "你可以分辨，這是事實上的不足，還是長期習慣用嚴格眼光看自己。",
    action: "先記下一件你已經完成的小事，讓自己不要只看見缺口。",
  },
  sleep: {
    title: "睡前先把心放回安靜的位置",
    empathy: "夜晚容易讓白天沒整理完的情緒浮上來，這不是你太脆弱。",
    reflection: "可以觀察，現在腦中反覆出現的是待辦、擔心，還是沒有說出口的感受。",
    action: "先把明天再處理的事寫下來，讓身體知道今晚可以暫時休息。",
  },
};

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function hasSafetyRisk(text: string) {
  const normalized = text.toLowerCase().replace(/\s+/g, "");
  if (!normalized) return false;
  if (!includesAny(normalized, sensitiveTerms)) return false;

  if (falsePositiveContexts.some((context) => normalized.includes(context))) {
    return false;
  }

  const hasIntent = includesAny(normalized, intentTerms);
  const hasSelfHarm = includesAny(normalized, selfHarmTerms);
  const hasUrgency = includesAny(normalized, urgencyTerms);
  const hasMethod = includesAny(normalized, methodTerms);

  return hasIntent || (hasSelfHarm && (hasUrgency || hasMethod));
}

export function crisisResult(): CompanionResult {
  return {
    title: "請先把安全放在第一位",
    empathy: "你現在承受的痛苦可能已經超過一個人能獨自消化的程度。",
    reflection: "此刻最重要的不是分析原因，而是讓身邊出現真實、能立即回應的人。",
    action: "請立即聯絡當地緊急協助、119、110、1925 安心專線，或請可信任的人陪你前往急診。",
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
    return { ...base, safety_flag: false };
  }

  if (mode === "card_draw" && card) {
    return {
      title: `這次抽到：${card.name}`,
      empathy: card.uprightMeaning,
      reflection: card.reversedMeaning,
      action: "把這張卡當作反思入口，先寫下一句你此刻最想承認的感受。",
      safety_flag: false,
    };
  }

  return {
    title: base.title,
    empathy: base.empathy,
    reflection: base.reflection,
    action: userInput.trim()
      ? "先不用急著解決全部，今晚只挑一個最小、最不耗力的下一步。"
      : base.action,
    safety_flag: false,
  };
}

export function isSessionMode(value: string): value is SessionMode {
  return isCompanionMode(value);
}

export function isSessionCategory(value: string): value is SessionCategory {
  return isCompanionCategory(value);
}
