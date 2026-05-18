import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-[#e6dfd3] bg-[#fffdf7]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-[#6c756d] sm:flex-row sm:items-center sm:justify-between">
        <p>Soul Oasis 心靈綠洲</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/legal" className="hover:text-[#26332d]">
            隱私
          </Link>
          <Link href="/legal" className="hover:text-[#26332d]">
            免責
          </Link>
          <a href="mailto:support@souloasis.local" className="hover:text-[#26332d]">
            聯絡我們
          </a>
        </div>
      </div>
    </footer>
  );
}
