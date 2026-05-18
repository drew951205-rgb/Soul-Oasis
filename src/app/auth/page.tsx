import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <main className="px-5 py-12">
      <Suspense fallback={<div className="mx-auto max-w-md text-[#6c756d]">載入中...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
