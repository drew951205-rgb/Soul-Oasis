"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, RefreshCcw, Save } from "lucide-react";
import { CardVisual } from "@/components/card-visual";

type SessionDetail = {
  id: string;
  mode: string;
  category: string;
  user_input: string;
  mood_score: number | null;
  card_name: string | null;
  result: {
    title: string;
    empathy: string;
    reflection: string;
    action: string;
    safety_flag: boolean;
  };
};

const modeLabels: Record<string, string> = {
  daily_guidance: "今日指引",
  emotion_question: "情緒提問",
  card_draw: "抽卡互動",
};

const categoryLabels: Record<string, string> = {
  relationship: "感情",
  stress: "壓力",
  career: "人生方向",
  self_doubt: "自我懷疑",
  sleep: "睡眠",
};

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const guestToken = localStorage.getItem("soul_guest_token");
    const query = guestToken ? `?guest_token=${encodeURIComponent(guestToken)}` : "";

    Promise.all([
      fetch(`/api/sessions/${params.id}${query}`).then((res) => res.json()),
      fetch("/api/auth/me").then((res) => res.json()),
    ])
      .then(([sessionData, meData]) => {
        if (!sessionData.session) {
          setError(sessionData.error ?? "找不到這次結果。");
          return;
        }
        setSession(sessionData.session);
        setUser(meData.user);
      })
      .catch(() => setError("載入失敗，請稍後再試。"));
  }, [params.id]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] px-4 py-3 text-[#8a3e37]">
          {error}
        </p>
      </main>
    );
  }

  if (!session) {
    return <main className="mx-auto max-w-3xl px-5 py-16 text-[#6c756d]">載入中...</main>;
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      {session.result.safety_flag && (
        <div className="mb-6 flex gap-3 rounded-lg border border-[#d9a6a0] bg-[#fff6f3] p-4 text-[#8a3e37]">
          <AlertTriangle className="shrink-0" size={22} aria-hidden="true" />
          <p className="text-sm leading-6">
            若你正處於立即危險，請立刻聯絡當地緊急服務、1925 安心專線，或前往最近急診。
          </p>
        </div>
      )}

      <section className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#51685a]">Companion Result</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#26332d]">{session.result.title}</h1>

        <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#51685a]">
          <span className="rounded-lg bg-[#eef2ea] px-3 py-2">{categoryLabels[session.category]}</span>
          <span className="rounded-lg bg-[#eef2ea] px-3 py-2">{modeLabels[session.mode]}</span>
          {session.mood_score && (
            <span className="rounded-lg bg-[#eef2ea] px-3 py-2">心情 {session.mood_score}/5</span>
          )}
          {session.card_name && (
            <span className="rounded-lg bg-[#eef2ea] px-3 py-2">抽到 {session.card_name}</span>
          )}
        </div>

        {session.card_name && (
          <section className="mt-8 grid gap-6 rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-5 sm:grid-cols-[200px_1fr] sm:items-center">
            <CardVisual name={session.card_name} animated compact />
            <div>
              <p className="text-sm font-semibold uppercase text-[#51685a]">Drawn Card</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#26332d]">{session.card_name}</h2>
              <p className="mt-3 leading-7 text-[#6c756d]">
                這張卡是本次陪伴的反思提示，請把它當成整理情緒的入口，而不是預言或指令。
              </p>
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-4">
          {[
            ["情緒理解", session.result.empathy],
            ["反思提示", session.result.reflection],
            ["下一步建議", session.result.action],
          ].map(([title, text]) => (
            <section key={title} className="rounded-lg border border-[#e6dfd3] bg-white p-5">
              <h2 className="font-semibold text-[#26332d]">{title}</h2>
              <p className="mt-3 leading-7 text-[#6c756d]">{text}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {user ? (
            <Link
              href="/records"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b]"
            >
              <Save size={18} aria-hidden="true" />
              已保存到我的紀錄
            </Link>
          ) : (
            <Link
              href={`/auth?mode=register&redirect=/result/${session.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b]"
            >
              <Save size={18} aria-hidden="true" />
              註冊即可保存這次紀錄
            </Link>
          )}
          <Link
            href="/experience"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-5 py-3 font-semibold text-[#51685a] hover:bg-[#f8f5ee]"
          >
            <RefreshCcw size={18} aria-hidden="true" />
            再問一次
          </Link>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[#e6dfd3] bg-[#f8f5ee] p-4">
        <p className="text-sm leading-6 text-[#6c756d]">
          Soul Oasis 提供自我整理與陪伴，不提供醫療診斷、治療、法律、投資或醫療建議。
          <Link href="/legal" className="ml-1 inline-flex items-center gap-1 font-semibold text-[#51685a]">
            查看規範
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </section>
    </main>
  );
}
