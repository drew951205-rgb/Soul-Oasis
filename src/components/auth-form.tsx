"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

export function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const redirect = searchParams.get("redirect") || "/records";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  const title = useMemo(
    () => (isRegister ? "建立一個可以保存紀錄的帳號" : "回到你的情緒紀錄"),
    [isRegister],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const guestToken = localStorage.getItem("soul_guest_token");
    const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        guest_token: guestToken,
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "操作失敗，請再試一次。");
      return;
    }

    window.location.href = redirect;
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 sm:p-7">
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-[#f8f5ee] p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            !isRegister ? "bg-white text-[#26332d] shadow-sm" : "text-[#51685a]"
          }`}
        >
          登入
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            isRegister ? "bg-white text-[#26332d] shadow-sm" : "text-[#51685a]"
          }`}
        >
          註冊
        </button>
      </div>

      <h1 className="text-2xl font-semibold text-[#26332d]">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-[#6c756d]">
        註冊成功後會自動登入，並保存你剛完成的未登入體驗紀錄。
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4">
        {isRegister && (
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#26332d]">姓名</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border border-[#d8c8b2] bg-white px-4 py-3"
              autoComplete="name"
            />
          </label>
        )}
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#26332d]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-lg border border-[#d8c8b2] bg-white px-4 py-3"
            autoComplete="email"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#26332d]">密碼</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-[#d8c8b2] bg-white px-4 py-3"
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
        </label>

        {error && (
          <p className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a3e37]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b] disabled:opacity-60"
        >
          {isRegister ? <UserPlus size={18} aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
          {loading ? "處理中..." : isRegister ? "註冊並登入" : "登入"}
        </button>
      </form>
    </div>
  );
}
