"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Lock, Trash2 } from "lucide-react";

const tabs = [
  { id: "disclaimer", label: "免責聲明", icon: FileText },
  { id: "privacy", label: "隱私政策", icon: Lock },
  { id: "crisis", label: "危機協助", icon: AlertTriangle },
  { id: "delete", label: "刪除申請", icon: Trash2 },
];

export default function LegalPage() {
  const [active, setActive] = useState("disclaimer");

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <p className="text-sm font-semibold uppercase text-[#51685a]">Trust Center</p>
      <h1 className="mt-3 text-3xl font-semibold text-[#26332d]">規範中心</h1>
      <p className="mt-3 max-w-2xl leading-7 text-[#6c756d]">
        Soul Oasis 的定位是情緒陪伴與自我整理，不是醫療、治療或危機處理服務。
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${
                active === tab.id ? "bg-[#d8e2d5] text-[#26332d]" : "text-[#51685a] hover:bg-[#f8f5ee]"
              }`}
            >
              <tab.icon size={17} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        <section className="rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 sm:p-7">
          {active === "disclaimer" && (
            <div className="space-y-4 leading-7 text-[#6c756d]">
              <h2 className="text-2xl font-semibold text-[#26332d]">免責聲明</h2>
              <p>Soul Oasis 提供情緒陪伴、自我反思與紀錄整理，不構成醫療診斷、心理治療或專業諮商。</p>
              <p>平台回應不可取代醫師、心理師、社工、法律或其他專業人員的判斷。</p>
              <p>我們不保證特定結果，也不鼓勵使用者依賴平台作為唯一支持來源。</p>
            </div>
          )}

          {active === "privacy" && (
            <div className="space-y-4 leading-7 text-[#6c756d]">
              <h2 className="text-2xl font-semibold text-[#26332d]">隱私政策</h2>
              <p>第一版僅蒐集帳號資料、體驗輸入、心情分數、分類、回應內容與建立時間。</p>
              <p>資料用途限於登入、保存紀錄、回看紀錄與改善產品體驗。</p>
              <p>密碼以雜湊方式保存；個人紀錄需登入後才能查看。</p>
            </div>
          )}

          {active === "crisis" && (
            <div className="space-y-4 leading-7 text-[#6c756d]">
              <h2 className="text-2xl font-semibold text-[#26332d]">危機協助提示</h2>
              <p>若你有自傷、自殺、急性精神危機或立即危險，請立即尋求當地緊急協助。</p>
              <p>台灣可撥打 119、110，或聯絡 1925 安心專線。也可以前往最近急診或請身邊可信任的人陪同。</p>
              <p>命中敏感詞時，系統會顯示固定危機提示，不進行一般陪伴式內容生成。</p>
            </div>
          )}

          {active === "delete" && (
            <div className="space-y-4 leading-7 text-[#6c756d]">
              <h2 className="text-2xl font-semibold text-[#26332d]">內容刪除申請方式</h2>
              <p>登入後可在「我的紀錄」刪除單筆紀錄，刪除後不再於列表中顯示。</p>
              <p>若需要協助刪除帳號或全部資料，請來信 support@souloasis.local，第一版以人工處理為主。</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
