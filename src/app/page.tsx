import Link from "next/link";
import {
  ArrowRight,
  Bed,
  Bolt,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleOff,
  Compass,
  Heart,
  MessageCircle,
  Ban,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const scenarioCards = [
  {
    title: "感情困擾",
    text: "梳理關係中的糾結，找回愛人與愛己的平衡。",
    icon: Heart,
    className: "bg-[#eef2ed] hover:bg-[#dfe8df]",
  },
  {
    title: "壓力焦慮",
    text: "在高壓生活中呼吸，釋放焦躁不安的情緒。",
    icon: Bolt,
    className: "bg-[#eee9df] hover:bg-[#e4ddcf]",
  },
  {
    title: "人生迷惘",
    text: "尋找未來的方向，陪你探索生命中的各種可能。",
    icon: Compass,
    className: "bg-[#f1f3ec] hover:bg-[#e3eadb]",
  },
  {
    title: "睡前陪伴",
    text: "在安靜的夜晚，沉澱一整天的喧囂與疲憊。",
    icon: Bed,
    className: "bg-[#e8e5df] hover:bg-[#dedad2]",
  },
];

const steps = [
  ["1", "選擇當下狀態", "從多種心靈氣候中，點選最符合你此時此刻感受的主題。"],
  ["2", "描述內心困擾", "像對著老朋友說話一樣，自由地寫下你目前的想法。"],
  ["3", "獲得陪伴與引導", "AI 會用溫和的方式陪你整理情緒，提供下一步的小提醒。"],
];

const faqs = [
  [
    "這是一項心理諮商服務嗎？",
    "不是。Soul Oasis 是 AI 心靈陪伴與情緒紀錄工具，提供日常支持與自我整理空間，不取代醫師、心理師或諮商師。",
  ],
  [
    "我需要註冊帳號才能使用嗎？",
    "你可以先以訪客身份體驗。若想保存紀錄、回看自己的情緒脈絡，就需要註冊帳號。",
  ],
  [
    "我的對話內容是安全的嗎？",
    "你的紀錄需登入後才能查看，也可以刪除單筆紀錄。第一版只蒐集 MVP 必要資料，不做社群公開或真人後台查看。",
  ],
  [
    "Free 版與 Plus 版的主要區別？",
    "Free 版適合輕量使用；Plus 目前先做方案展示，未串接金流，後續預留更高額度與長期紀錄保存。",
  ],
];

export default function Home() {
  return (
    <main className="bg-[#fbf9f4] text-[#1b1c19]">
      <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:px-10 lg:px-20 lg:pb-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_75%_25%,rgba(163,177,138,0.18),rgba(251,249,244,0)_64%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_0.92fr]">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="inline-flex items-center rounded-full border border-[#dce5d5] bg-[#eef3e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#566342]">
              心靈綠洲 Soul Oasis
            </p>
            <h1 className="mt-8 text-4xl font-semibold leading-tight text-[#1b1c19] sm:text-5xl lg:text-6xl">
              當心裡很亂，
              <br />
              先讓我們陪你整理。
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#5f645b] sm:text-lg lg:mx-0">
              溫柔、穩定、可依靠的數位心靈空間。透過 AI 陪伴，幫你梳理情緒，找回一點能呼吸的空間。
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/experience"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#566342] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(86,99,66,0.18)] transition hover:-translate-y-0.5 hover:bg-[#485438]"
              >
                開始 AI 陪伴
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center justify-center rounded-full border border-[#c6c8bb] bg-[#fbf9f4] px-8 py-4 text-base font-semibold text-[#566342] transition hover:bg-[#f0eee9]"
              >
                查看方案
              </Link>
            </div>
          </div>

          <div className="relative mx-auto min-h-[430px] w-full max-w-[520px]">
            <div className="absolute left-4 top-3 w-[84%] rounded-[28px] bg-white p-6 shadow-[0_30px_70px_rgba(86,99,66,0.12)] soul-floating">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#a3b18a] text-white">
                  <MessageCircle size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="mb-1 text-sm font-semibold text-[#5f645b]">AI 陪伴者</p>
                  <p className="leading-7 text-[#343833]">
                    我感覺到你現在的心情有些沉重，想跟我聊聊剛才發生的事嗎？
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-2 top-[160px] w-[72%] rounded-[28px] bg-[#566342] p-6 text-white shadow-[0_30px_70px_rgba(86,99,66,0.16)] soul-floating-delayed">
              <p className="leading-7">今天遇到一點挫折，覺得壓力很大，不知道該怎麼辦...</p>
            </div>

            <div className="absolute bottom-6 left-4 w-[86%] rounded-[28px] bg-white p-6 shadow-[0_30px_70px_rgba(86,99,66,0.12)] soul-floating-slow">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-[#566342]">情緒能量整理</span>
                <span className="text-xs text-[#6f756d]">目前狀態：需要平復</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#e4e2dd]">
                <div className="h-full w-[65%] rounded-full bg-[#a3b18a]" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#f2e0c3] px-3 py-1 text-xs font-medium text-[#4f4532]">
                  高壓力
                </span>
                <span className="rounded-full bg-[#dfe4e0] px-3 py-1 text-xs font-medium text-[#434845]">
                  渴望被聽見
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold text-[#1b1c19]">今天，想聊聊什麼？</h2>
            <p className="mt-3 text-[#5f645b]">選擇一個最貼近你當下狀態的入口</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {scenarioCards.map((card) => (
              <Link
                key={card.title}
                href="/experience"
                className={`group rounded-[28px] p-7 transition duration-300 hover:-translate-y-1 ${card.className}`}
              >
                <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-white text-[#566342] transition group-hover:scale-105">
                  <card.icon size={22} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-[#1b1c19]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f645b]">{card.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf9f4] px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-semibold text-[#1b1c19]">開始你的心靈整理之旅</h2>
            <div className="mx-auto mt-5 h-1.5 w-20 rounded-full bg-[#d5dfcb]" />
          </div>
          <div className="relative grid gap-12 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-10 hidden border-t-2 border-dashed border-[#c6c8bb] md:block" />
            {steps.map(([number, title, text]) => (
              <div key={number} className="relative text-center">
                <span className="relative z-10 mx-auto mb-8 grid size-20 place-items-center rounded-full border-4 border-[#fbf9f4] bg-white text-2xl font-bold text-[#566342] shadow-[0_18px_45px_rgba(86,99,66,0.1)]">
                  {number}
                </span>
                <h3 className="text-lg font-bold text-[#1b1c19]">{title}</h3>
                <p className="mx-auto mt-4 max-w-[300px] text-sm leading-7 text-[#5f645b]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.8fr_1fr]">
          <div className="relative overflow-hidden rounded-[36px] bg-[#566342] p-9 text-white sm:p-12">
            <div className="relative z-10 max-w-xl">
              <span className="rounded-full bg-white/18 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em]">
                核心特色
              </span>
              <h2 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
                AI 陪伴回應：
                <br />
                聽懂你沒說出口的委屈
              </h2>
              <p className="mt-5 text-base leading-8 text-white/82">
                我們以固定陪伴師語氣回應，不急著說教，也不假裝診斷，只陪你把卡住的感受慢慢說清楚。
              </p>
              <Link
                href="/experience"
                className="mt-8 inline-flex rounded-full bg-white px-7 py-3 font-bold text-[#566342] transition hover:bg-[#dae8be]"
              >
                立即體驗
              </Link>
            </div>
            <MessageCircle className="absolute -right-10 bottom-4 text-white/10" size={250} aria-hidden="true" />
          </div>

          <div className="grid gap-6">
            {[
              [CalendarDays, "情緒紀錄保存", "登入後保存你的情緒脈絡，看見自己一步步整理的軌跡。"],
              [Sparkles, "每日陪伴引導", "每天一個小提醒，陪你練習把注意力帶回當下。"],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-[28px] bg-[#f0eee9] p-8">
                <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-white text-[#566342]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-[#1b1c19]">{title as string}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f645b]">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf9f4] px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold text-[#1b1c19]">找到適合你的陪伴方式</h2>
            <p className="mt-3 text-[#5f645b]">從免費體驗開始，等你需要更長期的整理再升級</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <section className="rounded-[28px] border border-[#c6c8bb]/45 bg-white p-8 shadow-[0_22px_60px_rgba(86,99,66,0.08)]">
              <h3 className="text-2xl font-bold text-[#1b1c19]">基礎版 Free</h3>
              <p className="mt-2 text-sm text-[#5f645b]">適合初次嘗試，需要簡單傾訴的你</p>
              <p className="mt-8 text-4xl font-extrabold text-[#1b1c19]">
                NT$ 0 <span className="text-base font-normal text-[#5f645b]">/ 每月</span>
              </p>
              <ul className="mt-8 space-y-4 text-sm text-[#5f645b]">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#566342]" size={18} aria-hidden="true" />
                  會員每日 10 則 AI 對話
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#566342]" size={18} aria-hidden="true" />
                  基本情緒紀錄保存
                </li>
                <li className="flex items-center gap-3 opacity-45">
                  <CircleOff size={18} aria-hidden="true" />
                  更高額度與長期整理
                </li>
              </ul>
              <Link
                href="/experience"
                className="mt-10 inline-flex w-full justify-center rounded-full border border-[#76786e] px-6 py-3 font-bold text-[#566342] transition hover:bg-[#f0eee9]"
              >
                免費開始
              </Link>
            </section>

            <section className="relative overflow-hidden rounded-[28px] bg-[#566342] p-8 text-white shadow-[0_28px_70px_rgba(86,99,66,0.2)] md:scale-[1.03]">
              <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#a3b18a] px-5 py-2 text-xs font-bold text-[#1f2a16]">
                推薦方案
              </span>
              <h3 className="text-2xl font-bold">專業版 Plus</h3>
              <p className="mt-2 text-sm text-white/70">預留給想要深度整理、完整保存紀錄的你</p>
              <p className="mt-8 text-4xl font-extrabold">
                NT$ 199 <span className="text-base font-normal text-white/70">/ 每月</span>
              </p>
              <ul className="mt-8 space-y-4 text-sm text-white/90">
                {["預留更高 AI 對話額度", "長期情緒紀錄保存", "未來提醒與回看功能", "優先使用新整理工具"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Sparkles className="text-[#dae8be]" size={17} aria-hidden="true" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Link
                href="/plans"
                className="mt-10 inline-flex w-full justify-center rounded-full bg-white px-6 py-3 font-bold text-[#566342] transition hover:bg-[#dae8be]"
              >
                查看 Plus 方案
              </Link>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-4xl rounded-[36px] bg-[#f0eee9] p-8 text-center sm:p-12 lg:p-16">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#a3b18a] text-white">
            <ShieldCheck size={28} aria-hidden="true" />
          </span>
          <h2 className="mt-8 text-3xl font-semibold text-[#1b1c19]">你的安心是我們的首要任務</h2>
          <div className="mt-10 grid gap-8 text-left md:grid-cols-2">
            <div className="flex gap-4">
              <Ban className="mt-1 shrink-0 text-[#566342]" size={22} aria-hidden="true" />
              <div>
                <h3 className="font-bold text-[#1b1c19]">隱私優先</h3>
                <p className="mt-2 text-sm leading-7 text-[#5f645b]">
                  紀錄需登入後才能查看，也提供刪除功能。第一版不做社群公開或真人諮詢後台。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShieldCheck className="mt-1 shrink-0 text-[#566342]" size={22} aria-hidden="true" />
              <div>
                <h3 className="font-bold text-[#1b1c19]">非醫療聲明</h3>
                <p className="mt-2 text-sm leading-7 text-[#5f645b]">
                  本服務不是心理治療或危機處理。如有自傷、自殺或立即危險，請尋求當地緊急協助。
                </p>
              </div>
            </div>
          </div>
          <Link href="/legal" className="mt-10 inline-flex items-center gap-2 font-bold text-[#566342] hover:underline">
            查看危機協助與規範
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-[#fbf9f4] px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-semibold text-[#1b1c19]">常見問題</h2>
          <div className="space-y-4">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl bg-white shadow-[0_14px_45px_rgba(86,99,66,0.06)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold text-[#1b1c19]">
                  {question}
                  <ChevronDown
                    className="shrink-0 text-[#76786e] transition group-open:rotate-180"
                    size={20}
                    aria-hidden="true"
                  />
                </summary>
                <p className="px-6 pb-6 leading-7 text-[#5f645b]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
