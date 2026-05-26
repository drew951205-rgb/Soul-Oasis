"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText, MessageCircle, Plus, Trash2 } from "lucide-react";

const categories = [
  ["", "全部"],
  ["relationship", "關係"],
  ["stress", "壓力"],
  ["career", "方向"],
  ["self_doubt", "自我懷疑"],
  ["sleep", "睡眠"],
];

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

type RecordItem = {
  id: string;
  created_at: string;
  mode: string;
  category: string;
  title: string;
  mood_score: number | null;
  preview_text: string;
  has_summary: boolean;
  summary_preview: string;
  summary_next_step: string;
};

type ViewMode = "all" | "summaries";

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [category, setCategory] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      setLoading(true);

      try {
        const meResponse = await fetch("/api/auth/me");
        const meData = await meResponse.json();

        if (!meData.user) {
          if (!cancelled) {
            setRecords([]);
            setError("請先登入後查看我的紀錄。");
          }
          return;
        }

        const query = category ? `?category=${category}` : "";
        const response = await fetch(`/api/sessions${query}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "讀取紀錄失敗。");

        if (!cancelled) {
          setRecords(data.sessions);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "讀取紀錄失敗。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, [category]);

  const visibleRecords = useMemo(
    () => (viewMode === "summaries" ? records.filter((record) => record.has_summary) : records),
    [records, viewMode],
  );
  const summaryCount = records.filter((record) => record.has_summary).length;

  async function deleteRecord(id: string) {
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setRecords((items) => items.filter((item) => item.id !== id));
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-[#51685a]">Journal</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#26332d]">我的紀錄</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#6c756d]">
            保存每次 AI 陪伴對話，也能回看已整理出的本次小結。
          </p>
        </div>
        <Link
          href="/experience"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 text-center font-semibold text-white hover:bg-[#43574b]"
        >
          <Plus size={18} aria-hidden="true" />
          開始新的陪伴
        </Link>
      </div>

      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setViewMode("all")}
          className={`rounded-lg border p-4 text-left ${
            viewMode === "all"
              ? "border-[#51685a] bg-[#eef2ea]"
              : "border-[#e6dfd3] bg-[#fffdf7]"
          }`}
        >
          <span className="inline-flex items-center gap-2 font-semibold text-[#26332d]">
            <MessageCircle size={18} aria-hidden="true" />
            全部紀錄
          </span>
          <span className="mt-1 block text-sm text-[#6c756d]">{records.length} 筆對話紀錄</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("summaries")}
          className={`rounded-lg border p-4 text-left ${
            viewMode === "summaries"
              ? "border-[#51685a] bg-[#eef2ea]"
              : "border-[#e6dfd3] bg-[#fffdf7]"
          }`}
        >
          <span className="inline-flex items-center gap-2 font-semibold text-[#26332d]">
            <FileText size={18} aria-hidden="true" />
            總結紀錄
          </span>
          <span className="mt-1 block text-sm text-[#6c756d]">{summaryCount} 筆已產生小結</span>
        </button>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              category === value
                ? "border-[#51685a] bg-[#51685a] text-white"
                : "border-[#e6dfd3] bg-[#fffdf7] text-[#51685a]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] p-4 text-[#8a3e37]">
          {error}
          <Link href="/auth" className="ml-2 font-semibold underline">
            前往登入
          </Link>
        </div>
      )}

      {!error && (
        <div className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7]">
          {loading ? (
            <p className="p-6 text-[#6c756d]">讀取中...</p>
          ) : visibleRecords.length === 0 ? (
            <p className="p-6 text-[#6c756d]">
              {viewMode === "summaries"
                ? "目前還沒有總結紀錄。聊到一段後，在 AI 陪伴頁點「整理本次對話」即可產生。"
                : "目前還沒有紀錄。"}
            </p>
          ) : (
            <ul className="divide-y divide-[#e6dfd3]">
              {visibleRecords.map((record) => (
                <li key={record.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <Link href={`/records/${record.id}`} className="block">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#51685a]">
                      <span>{new Date(record.created_at).toLocaleString("zh-TW")}</span>
                      <span>{modeLabels[record.mode]}</span>
                      <span>{categoryLabels[record.category]}</span>
                      {record.mood_score && <span>心情 {record.mood_score}/5</span>}
                      {record.has_summary && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ea] px-2 py-0.5">
                          <FileText size={12} aria-hidden="true" />
                          已有小結
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-semibold text-[#26332d]">{record.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6c756d]">
                      {record.has_summary
                        ? record.summary_preview || record.preview_text
                        : record.preview_text}
                    </p>
                    {record.has_summary && record.summary_next_step && (
                      <p className="mt-3 rounded-lg bg-[#f8f5ee] px-3 py-2 text-sm leading-6 text-[#51685a]">
                        下一步：{record.summary_next_step}
                      </p>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteRecord(record.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c8b2] bg-white px-4 py-2 text-sm font-semibold text-[#8a3e37] hover:bg-[#fff6f3]"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    刪除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
