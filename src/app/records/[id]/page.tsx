"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Trash2 } from "lucide-react";

const modeLabels: Record<string, string> = {
  daily_guidance: "今日指引",
  emotion_question: "情緒提問",
  card_draw: "抽卡互動",
};

const categoryLabels: Record<string, string> = {
  relationship: "關係",
  stress: "壓力",
  career: "方向",
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
  summary: {
    has_summary: boolean;
    title: string;
    timeline: { label: string; text: string }[];
    focus: string;
    next_step: string;
  };
  messages: {
    id: string;
    role: string;
    content: string;
    created_at: string;
  }[];
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
        if (!response.ok) throw new Error(data.error ?? "讀取紀錄失敗。");
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
    return <main className="mx-auto max-w-3xl px-5 py-16 text-[#6c756d]">讀取中...</main>;
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
          {session.summary.has_summary && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#eef2ea] px-3 py-2">
              <FileText size={15} aria-hidden="true" />
              總結紀錄
            </span>
          )}
        </div>

        {session.summary.has_summary && (
          <section className="mt-8 rounded-lg border border-[#e6dfd3] bg-white p-5">
            <p className="text-sm font-semibold uppercase text-[#51685a]">Conversation Summary</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#26332d]">{session.summary.title}</h2>

            <div className="mt-5 grid gap-4 border-l-2 border-[#e6dfd3] pl-5">
              {session.summary.timeline.map((item, index) => (
                <section key={`${item.label}-${index}`} className="relative">
                  <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-[#8da892]" />
                  <h3 className="font-semibold text-[#26332d]">{item.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#6c756d]">{item.text}</p>
                </section>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <section className="rounded-lg bg-[#f8f5ee] p-4">
                <h3 className="font-semibold text-[#26332d]">主要卡點</h3>
                <p className="mt-2 text-sm leading-6 text-[#6c756d]">{session.summary.focus}</p>
              </section>
              <section className="rounded-lg bg-[#eef2ea] p-4">
                <h3 className="font-semibold text-[#26332d]">下一步</h3>
                <p className="mt-2 text-sm leading-6 text-[#6c756d]">{session.summary.next_step}</p>
              </section>
            </div>
          </section>
        )}

        {session.user_input && (
          <section className="mt-8 rounded-lg border border-[#e6dfd3] bg-white p-5">
            <h2 className="font-semibold text-[#26332d]">最初輸入</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-[#6c756d]">{session.user_input}</p>
          </section>
        )}

        <section className="mt-5 rounded-lg border border-[#e6dfd3] bg-white p-5">
          <h2 className="font-semibold text-[#26332d]">對話內容</h2>
          {session.messages.length > 0 ? (
            <div className="mt-4 space-y-4">
              {session.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[82%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-[#51685a] text-white"
                        : "bg-[#f8f5ee] text-[#26332d]"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#6c756d]">
              這筆紀錄沒有聊天訊息，只保留固定格式回應。
            </p>
          )}
        </section>
      </article>
    </main>
  );
}
