import Link from "next/link";
import { Share2 } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="bg-[#fbf9f4] px-5 pb-6">
      <div className="mx-auto max-w-6xl rounded-t-[36px] bg-[#f0eee9] px-7 py-10 sm:px-10">
        <div className="grid gap-10 border-b border-[#d8d8cf] pb-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <p className="text-2xl font-semibold text-[#566342]">Soul Oasis</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#6c756d]">
              為忙碌的現代人保留一處可以呼吸、可以示弱、可以重新出發的綠洲。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="grid gap-3">
              <p className="text-sm font-bold text-[#26332d]">探索</p>
              <Link href="/" className="text-sm text-[#6c756d] hover:text-[#51685a]">
                首頁
              </Link>
              <Link href="/experience" className="text-sm text-[#6c756d] hover:text-[#51685a]">
                AI 陪伴
              </Link>
            </div>
            <div className="grid gap-3">
              <p className="text-sm font-bold text-[#26332d]">法律</p>
              <Link href="/legal" className="text-sm text-[#6c756d] hover:text-[#51685a]">
                免責聲明
              </Link>
              <Link href="/legal" className="text-sm text-[#6c756d] hover:text-[#51685a]">
                隱私政策
              </Link>
            </div>
            <div className="grid gap-3">
              <p className="text-sm font-bold text-[#26332d]">關於</p>
              <Link href="/plans" className="text-sm text-[#6c756d] hover:text-[#51685a]">
                方案
              </Link>
              <a href="mailto:support@souloasis.local" className="text-sm text-[#6c756d] hover:text-[#51685a]">
                聯絡我們
              </a>
            </div>
            <div className="grid gap-3">
              <p className="text-sm font-bold text-[#26332d]">分享</p>
              <a
                href="mailto:?subject=Soul Oasis&body=https://soul-oasis.vercel.app"
                className="grid size-9 place-items-center rounded-full bg-white text-[#51685a] hover:bg-[#51685a] hover:text-white"
                aria-label="分享 Soul Oasis"
                title="分享 Soul Oasis"
              >
                <Share2 size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs text-[#8a9087] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Soul Oasis. All rights reserved.</p>
          <p>繁體中文 (Taiwan)</p>
        </div>
      </div>
    </footer>
  );
}
