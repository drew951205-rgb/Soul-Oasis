import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  HeartHandshake,
  Moon,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";

const entries = [
  { title: "感情", text: "把在意與委屈先說清楚。", icon: HeartHandshake },
  { title: "壓力", text: "把混亂拆成可承接的小步。", icon: Waves },
  { title: "迷惘", text: "先看見下一個穩定方向。", icon: Sparkles },
  { title: "睡眠", text: "讓今晚不必負責想通全部。", icon: Moon },
];

const steps = ["選擇此刻狀態", "描述正在卡住的感受", "收到三段式陪伴回應"];

export default function Home() {
  return (
    <main>
      <section className="border-b border-[#e6dfd3] bg-[#fffdf7]">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase text-[#51685a]">
              心靈綠洲 Soul Oasis
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-[#26332d] sm:text-6xl">
              當心裡很亂，先讓我們陪你整理。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6c756d]">
              一個溫柔、穩定、可靠的情緒陪伴空間。不是算命，也不替代醫療，而是幫你把感受、想法與下一步慢慢分清楚。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/experience"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b]"
              >
                立即體驗
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center justify-center rounded-lg border border-[#d8c8b2] bg-[#f8f5ee] px-5 py-3 font-semibold text-[#51685a] hover:bg-white"
              >
                查看方案
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-6 shadow-sm">
            <div className="rounded-lg bg-[#fffdf7] p-5">
              <p className="text-sm font-medium text-[#6c756d]">今日整理</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#26332d]">
                你不需要立刻變好，只需要先穩住一點。
              </h2>
              <div className="mt-6 space-y-4">
                {["情緒理解", "反思提示", "下一步建議"].map((item, index) => (
                  <div key={item} className="flex gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#d8e2d5] text-sm font-semibold text-[#51685a]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-[#26332d]">{item}</p>
                      <p className="mt-1 text-sm leading-6 text-[#6c756d]">
                        {index === 0 && "先接住你的感受，不急著評判。"}
                        {index === 1 && "把壓力拆開，看清楚真正卡住的地方。"}
                        {index === 2 && "選一件今晚能完成的小行動。"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map((entry) => (
            <Link
              key={entry.title}
              href="/experience"
              className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 hover:border-[#8da892]"
            >
              <entry.icon className="mb-5 text-[#51685a]" size={24} aria-hidden="true" />
              <h2 className="text-lg font-semibold text-[#26332d]">{entry.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6c756d]">{entry.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#eef2ea] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold text-[#26332d]">三步驟，先把心放穩。</h2>
              <div className="mt-8 grid gap-4">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-lg bg-[#fffdf7] p-4">
                    <span className="grid size-9 place-items-center rounded-lg bg-[#d8c8b2] text-sm font-semibold text-[#26332d]">
                      {index + 1}
                    </span>
                    <span className="font-medium text-[#26332d]">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {[
                ["AI 陪伴", "以固定結構回應，避免誇大與自由發散。"],
                ["情緒紀錄", "登入後保存每次整理，回看自己的狀態變化。"],
                ["每日回看", "把回應變成溫柔的日常提醒。"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5">
                  <h3 className="font-semibold text-[#26332d]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6c756d]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-[#26332d]">方案預覽</h2>
            <p className="mt-3 leading-7 text-[#6c756d]">
              第一版先展示方案差異，不串接金流。免費版可開始整理，Plus 預留無限次數與永久保存。
            </p>
            <Link
              href="/plans"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b]"
            >
              查看方案
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5">
              <p className="text-sm font-semibold text-[#51685a]">Free</p>
              <p className="mt-3 text-3xl font-semibold">NT$0</p>
              <p className="mt-2 text-sm text-[#6c756d]">每日有限次數、基本情緒紀錄。</p>
            </div>
            <div className="rounded-lg border border-[#8da892] bg-[#fffdf7] p-5">
              <p className="text-sm font-semibold text-[#51685a]">Plus</p>
              <p className="mt-3 text-3xl font-semibold">NT$199/mo</p>
              <p className="mt-2 text-sm text-[#6c756d]">無限互動、永久保存、陪伴提醒。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6dfd3] bg-[#fffdf7] py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-3">
          <div className="flex gap-3">
            <ShieldCheck className="shrink-0 text-[#51685a]" size={22} aria-hidden="true" />
            <p className="text-sm leading-6 text-[#6c756d]">
              Soul Oasis 不是醫療、治療或危機處理服務。若有自傷或立即危險，請立刻尋求當地緊急協助。
            </p>
          </div>
          <div className="flex gap-3">
            <BookOpenText className="shrink-0 text-[#51685a]" size={22} aria-hidden="true" />
            <p className="text-sm leading-6 text-[#6c756d]">
              我們只收集 MVP 必要資料，並提供紀錄刪除功能與清楚的隱私政策入口。
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-[#26332d]">FAQ</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c756d]">
              回應用於自我整理與陪伴，不提供診斷、保證結果、法律、投資或醫療建議。
            </p>
            <Link href="/legal" className="mt-3 inline-block text-sm font-semibold text-[#51685a]">
              查看規範
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
