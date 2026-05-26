import { AlertTriangle } from "lucide-react";

export function CrisisAlert() {
  return (
    <div className="rounded-lg border border-[#d9a6a0] bg-[#fff6f3] p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-1 shrink-0 text-[#8a3e37]" size={20} aria-hidden="true" />
        <div className="text-sm leading-6 text-[#8a3e37]">
          <p className="font-semibold">如果你正在考慮傷害自己，請先把安全放在第一位。</p>
          <p className="mt-1">
            請立即聯絡當地緊急協助、119、1925 安心專線，或找身邊可信任的人陪你。
          </p>
        </div>
      </div>
    </div>
  );
}
