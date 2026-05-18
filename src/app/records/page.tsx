"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const categories = [
  ["", "全部"],
  ["relationship", "感情"],
  ["stress", "壓力"],
  ["career", "人生方向"],
  ["self_doubt", "自我懷疑"],
  ["sleep", "睡眠"],
];

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

type RecordItem = {
  id: string;
  created_at: string;
  mode: string;
  category: string;
  title: string;
  mood_score: number | null;
  preview_text: string;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = category ? `?category=${category}` : "";
    fetch(`/api/sessions${query}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "載入失敗。");
        setRecords(data.sessions);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

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
          <p className="mt-3 leading-7 text-[#6c756d]">回看每次整理，觀察自己的情緒狀態。</p>
        </div>
        <Link
          href="/experience"
          className="rounded-lg bg-[#51685a] px-5 py-3 text-center font-semibold text-white hover:bg-[#43574b]"
        >
          新增一次整理
        </Link>
      </div>

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
            <p className="p-6 text-[#6c756d]">載入中...</p>
          ) : records.length === 0 ? (
            <p className="p-6 text-[#6c756d]">目前還沒有紀錄。</p>
          ) : (
            <ul className="divide-y divide-[#e6dfd3]">
              {records.map((record) => (
                <li key={record.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <Link href={`/records/${record.id}`} className="block">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#51685a]">
                      <span>{new Date(record.created_at).toLocaleString("zh-TW")}</span>
                      <span>{modeLabels[record.mode]}</span>
                      <span>{categoryLabels[record.category]}</span>
                      {record.mood_score && <span>心情 {record.mood_score}/5</span>}
                    </div>
                    <h2 className="mt-2 font-semibold text-[#26332d]">{record.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6c756d]">
                      {record.preview_text}
                    </p>
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
