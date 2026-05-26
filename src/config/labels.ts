import type { SessionCategory, SessionMode } from "@/generated/prisma/enums";

export type CompanionMode = SessionMode;
export type CompanionCategory = SessionCategory;

export const COMPANION_MODES: Record<
  CompanionMode,
  {
    label: string;
    helper: string;
    welcomeMessage: string;
    placeholder: string;
  }
> = {
  daily_guidance: {
    label: "今日指引",
    helper: "不用先整理好問題，也可以先獲得一段溫和的今日提醒。",
    welcomeMessage: "我在這裡。你可以先不用說很多，也可以直接送出，讓我陪你整理今天的狀態。",
    placeholder: "可以留空，或寫下今天的一點感受",
  },
  emotion_question: {
    label: "情緒提問",
    helper: "適合把正在卡住的感受說出來，讓 AI 陪你慢慢釐清。",
    welcomeMessage: "我在這裡。你可以慢慢說，不需要一次整理好。",
    placeholder: "把現在卡住的一小段感受寫下來",
  },
  card_draw: {
    label: "抽卡互動",
    helper: "用一張反思卡當作入口，不做預言，只協助你整理想法。",
    welcomeMessage: "我在這裡。你可以說說現在心裡最在意的事，或直接送出，讓這張卡成為今天的反思入口。",
    placeholder: "可以留空抽卡，或寫下想反思的事",
  },
};

export const COMPANION_CATEGORIES: Record<
  CompanionCategory,
  {
    label: string;
    description: string;
  }
> = {
  relationship: {
    label: "關係",
    description: "感情、人際或親密關係裡的拉扯。",
  },
  stress: {
    label: "壓力",
    description: "工作、生活或責任感帶來的緊繃。",
  },
  career: {
    label: "方向",
    description: "選擇、職涯或人生方向的迷惘。",
  },
  self_doubt: {
    label: "自我懷疑",
    description: "對自己不確定、害怕不夠好的感受。",
  },
  sleep: {
    label: "睡眠",
    description: "睡前腦袋停不下來，想先安定下來。",
  },
};

export const modeOptions = Object.entries(COMPANION_MODES).map(([value, config]) => ({
  value: value as CompanionMode,
  ...config,
}));

export const categoryOptions = Object.entries(COMPANION_CATEGORIES).map(([value, config]) => ({
  value: value as CompanionCategory,
  ...config,
}));

export const modeLabels = Object.fromEntries(
  Object.entries(COMPANION_MODES).map(([value, config]) => [value, config.label]),
) as Record<CompanionMode, string>;

export const categoryLabels = Object.fromEntries(
  Object.entries(COMPANION_CATEGORIES).map(([value, config]) => [value, config.label]),
) as Record<CompanionCategory, string>;

export function isCompanionMode(value: string): value is CompanionMode {
  return value in COMPANION_MODES;
}

export function isCompanionCategory(value: string): value is CompanionCategory {
  return value in COMPANION_CATEGORIES;
}

export function getWelcomeMessage(mode: CompanionMode) {
  return COMPANION_MODES[mode].welcomeMessage;
}

export function getModeLabel(value: string) {
  return isCompanionMode(value) ? modeLabels[value] : value;
}

export function getCategoryLabel(value: string) {
  return isCompanionCategory(value) ? categoryLabels[value] : value;
}
