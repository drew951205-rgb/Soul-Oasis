"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const redirect = searchParams.get("redirect") || "/records";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";

  const title = useMemo(
    () => (isRegister ? "建立帳號保存你的紀錄" : "回到你的陪伴紀錄"),
    [isRegister],
  );

  function validate() {
    const nextErrors: FieldErrors = {};

    if (isRegister && !name.trim()) {
      nextErrors.name = "請輸入名稱。";
    }

    if (!email.trim()) {
      nextErrors.email = "請輸入 Email。";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "請輸入有效的 Email。";
    }

    if (password.length < 8) {
      nextErrors.password = "密碼至少需要 8 碼。";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!validate()) return;

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
      setError(data.error ?? "操作失敗，請稍後再試。");
      return;
    }

    window.location.href = redirect;
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-[#e6dfd3] bg-[#fffdf7] p-5 sm:p-7">
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-[#f8f5ee] p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrors({});
            setError("");
          }}
          className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold ${
            !isRegister ? "bg-white text-[#26332d] shadow-sm" : "text-[#51685a]"
          }`}
        >
          登入
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrors({});
            setError("");
          }}
          className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold ${
            isRegister ? "bg-white text-[#26332d] shadow-sm" : "text-[#51685a]"
          }`}
        >
          註冊
        </button>
      </div>

      <h1 className="text-2xl font-semibold text-[#26332d]">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-[#6c756d]">
        註冊後可以保存這次對話與總結；登入後可回看我的紀錄。
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
        {isRegister && (
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#26332d]">名稱</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-11 rounded-lg border border-[#d8c8b2] bg-white px-4 py-3"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="text-sm text-[#8a3e37]">{errors.name}</span>}
          </label>
        )}
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#26332d]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-11 rounded-lg border border-[#d8c8b2] bg-white px-4 py-3"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="text-sm text-[#8a3e37]">{errors.email}</span>}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#26332d]">密碼</span>
          <span className="flex rounded-lg border border-[#d8c8b2] bg-white">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 flex-1 rounded-lg bg-transparent px-4 py-3 outline-none"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={8}
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="grid size-11 place-items-center text-[#51685a]"
              aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </span>
          {errors.password && <span className="text-sm text-[#8a3e37]">{errors.password}</span>}
        </label>

        {error && (
          <p className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a3e37]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#51685a] px-5 py-3 font-semibold text-white hover:bg-[#43574b] disabled:opacity-60"
        >
          {isRegister ? <UserPlus size={18} aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
          {loading ? "處理中..." : isRegister ? "註冊並登入" : "登入"}
        </button>
      </form>
    </div>
  );
}
