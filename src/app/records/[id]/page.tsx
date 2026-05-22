"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";

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

type SessionDetail = {
  id: string;
  created_at: string;
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

export default function RecordDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/sessions/${params.id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "載入失敗。");
        setSession(data.session);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  async function deleteRecord() {
    await fetch(`/api/sessions/${params.id}`, { method: "DELETE" });
    router.push("/records");
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] p-4 text-[#8a3e37]">
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
      <Link href="/records" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#51685a]">
        <ArrowLeft size={16} aria-hidden="true" />
        回到我的紀錄
      </Link>

      <article className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-[#51685a]">
              {new Date(session.created_at).toLocaleString("zh-TW")}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[#26332d]">{session.result.title}</h1>
          </div>
          <button
            type="button"
            onClick={deleteRecord}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-4 py-2 text-sm font-semibold text-[#8a3e37] hover:bg-[#fff6f3]"
          >
            <Trash2 size={16} aria-hidden="true" />
            刪除
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#51685a]">
          <span className="rounded-lg bg-[#eef2ea] px-3 py-2">{modeLabels[session.mode]}</span>
          <span className="rounded-lg bg-[#eef2ea] px-3 py-2">{categoryLabels[session.category]}</span>
          {session.mood_score && <span className="rounded-lg bg-[#eef2ea] px-3 py-2">心情 {session.mood_score}/5</span>}
          {session.card_name && <span className="rounded-lg bg-[#eef2ea] px-3 py-2">抽到 {session.card_name}</span>}
        </div>

        {session.user_input && (
          <section className="mt-8 rounded-lg border border-[#e6dfd3] bg-white p-5">
            <h2 className="font-semibold text-[#26332d]">當時輸入</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-[#6c756d]">{session.user_input}</p>
          </section>
        )}

        <div className="mt-5 grid gap-4">
          {[
            ["陪伴回應", session.result.empathy],
            ["可以想一想", session.result.reflection],
            ["小提醒", session.result.action],
          ].map(([title, text]) => (
            <section key={title} className="rounded-lg border border-[#e6dfd3] bg-white p-5">
              <h2 className="font-semibold text-[#26332d]">{title}</h2>
              <p className="mt-3 leading-7 text-[#6c756d]">{text}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
