import Link from "next/link";
import { Check, Minus } from "lucide-react";

const rows = [
  ["每日體驗次數", "有限次數", "無限制"],
  ["情緒紀錄", "基本紀錄", "永久保存"],
  ["歷史回看", "可用", "可用"],
  ["陪伴提醒", "未開放", "預留"],
  ["付款", "免費", "第一版不串金流"],
];

export default function PlansPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-sm font-semibold uppercase text-[#51685a]">Plans</p>
      <h1 className="mt-3 text-3xl font-semibold text-[#26332d]">會員方案</h1>
      <p className="mt-3 max-w-2xl leading-7 text-[#6c756d]">
        MVP 先保留免費與付費版差異展示，暫不串接金流，也不在第一版區分實際權限。
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-6">
          <p className="text-sm font-semibold text-[#51685a]">Free</p>
          <h2 className="mt-3 text-4xl font-semibold text-[#26332d]">NT$0</h2>
          <p className="mt-3 leading-7 text-[#6c756d]">適合初次體驗陪伴式整理與基本情緒紀錄。</p>
          <Link
            href="/experience"
            className="mt-6 inline-flex w-full justify-center rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
          >
            開始體驗
          </Link>
        </section>

        <section className="rounded-lg border border-[#8da892] bg-[#fffdf7] p-6">
          <p className="text-sm font-semibold text-[#51685a]">Plus</p>
          <h2 className="mt-3 text-4xl font-semibold text-[#26332d]">NT$199/mo</h2>
          <p className="mt-3 leading-7 text-[#6c756d]">預留給高頻整理、長期保存與主動提醒的使用者。</p>
          <button
            type="button"
            disabled
            className="mt-6 inline-flex w-full justify-center rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white opacity-70"
          >
            付款功能尚未開放
          </button>
        </section>
      </div>

      <section className="mt-8 overflow-hidden rounded-lg border border-[#e6dfd3] bg-[#fffdf7]">
        <div className="grid grid-cols-3 bg-[#eef2ea] px-4 py-3 text-sm font-semibold text-[#26332d]">
          <span>功能</span>
          <span>Free</span>
          <span>Plus</span>
        </div>
        {rows.map(([feature, free, plus]) => (
          <div key={feature} className="grid grid-cols-3 border-t border-[#e6dfd3] px-4 py-4 text-sm text-[#6c756d]">
            <span className="font-medium text-[#26332d]">{feature}</span>
            <span className="flex items-center gap-2">
              {free === "未開放" ? <Minus size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
              {free}
            </span>
            <span className="flex items-center gap-2">
              {plus === "第一版不串金流" ? <Minus size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
              {plus}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
