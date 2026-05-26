import Link from "next/link";

export function SubscribePrompt() {
  return (
    <div className="rounded-lg border border-[#8da892] bg-[#eef2ea] p-4">
      <div>
        <h2 className="font-semibold text-[#26332d]">這段陪伴可以先保存下來</h2>
        <p className="mt-2 text-sm leading-6 text-[#6c756d]">
          註冊後可以把紀錄留在我的紀錄中；Plus 方案會在之後開放更多保存與回看功能。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/auth?mode=register&redirect=/records"
            className="rounded-lg bg-[#51685a] px-4 py-2 text-sm font-semibold text-white"
          >
            註冊保存
          </Link>
          <Link
            href="/plans"
            className="rounded-lg border border-[#d8c8b2] bg-white px-4 py-2 text-sm font-semibold text-[#51685a]"
          >
            查看方案
          </Link>
        </div>
      </div>
    </div>
  );
}
