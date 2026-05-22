"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Menu, Sprout, UserRound, X } from "lucide-react";

type Me = {
  id: string;
  name: string;
  email: string;
} | null;

export function AppNav() {
  const [user, setUser] = useState<Me>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  const links = (
    <>
      <Link href="/experience" className="text-sm font-medium text-[#51685a] hover:text-[#26332d]">
        開始 AI 陪伴
      </Link>
      <Link href="/plans" className="text-sm font-medium text-[#51685a] hover:text-[#26332d]">
        方案
      </Link>
      <Link href="/legal" className="text-sm font-medium text-[#51685a] hover:text-[#26332d]">
        規範中心
      </Link>
      {user && (
        <Link href="/records" className="text-sm font-medium text-[#51685a] hover:text-[#26332d]">
          我的紀錄
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6dfd3] bg-[#f8f5ee]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#26332d]">
          <span className="grid size-9 place-items-center rounded-lg bg-[#d8e2d5] text-[#51685a]">
            <Sprout size={19} aria-hidden="true" />
          </span>
          <span>Soul Oasis</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">{links}</nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm text-[#6c756d]">
                <UserRound size={16} aria-hidden="true" />
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="grid size-10 place-items-center rounded-lg border border-[#d8c8b2] bg-[#fffdf7] text-[#51685a] hover:bg-white"
                aria-label="登出"
                title="登出"
              >
                <LogOut size={17} aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-[#51685a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#43574b]"
            >
              登入 / 註冊
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-lg border border-[#d8c8b2] bg-[#fffdf7] text-[#51685a] md:hidden"
          aria-label="開啟選單"
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e6dfd3] bg-[#fffdf7] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4" onClick={() => setOpen(false)}>
            {links}
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 text-left text-sm font-medium text-[#51685a]"
              >
                <LogOut size={16} aria-hidden="true" />
                登出
              </button>
            ) : (
              <Link href="/auth" className="text-sm font-semibold text-[#26332d]">
                登入 / 註冊
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
