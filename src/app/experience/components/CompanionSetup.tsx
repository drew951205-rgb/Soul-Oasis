"use client";

import { BriefcaseBusiness, Bot, Heart, Leaf, Moon, RotateCcw, Sparkles, Waves } from "lucide-react";
import {
  categoryOptions,
  modeOptions,
  type CompanionCategory,
  type CompanionMode,
} from "@/config/labels";

const categoryIcons: Record<CompanionCategory, typeof Heart> = {
  relationship: Heart,
  stress: Waves,
  career: BriefcaseBusiness,
  self_doubt: Leaf,
  sleep: Moon,
};

export function CompanionSetup({
  mode,
  category,
  onModeChange,
  onCategoryChange,
  onReset,
  onStart,
}: {
  mode: CompanionMode;
  category: CompanionCategory;
  onModeChange: (mode: CompanionMode) => void;
  onCategoryChange: (category: CompanionCategory) => void;
  onReset: () => void;
  onStart: () => void;
}) {
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
            {modeOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onModeChange(item.value)}
                className={`min-h-20 rounded-lg border px-4 py-4 text-left transition ${
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
            {categoryOptions.map((item) => {
              const Icon = categoryIcons[item.value];
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onCategoryChange(item.value)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                    category === item.value
                      ? "border-[#51685a] bg-[#51685a] text-white"
                      : "border-[#e6dfd3] bg-white text-[#51685a] hover:border-[#c6c8bb]"
                  }`}
                  title={item.description}
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
            onClick={onStart}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b]"
          >
            <Bot size={18} aria-hidden="true" />
            開始 AI 陪伴
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
          >
            <RotateCcw size={18} aria-hidden="true" />
            重新開始
          </button>
        </div>
      </section>
    </main>
  );
}
