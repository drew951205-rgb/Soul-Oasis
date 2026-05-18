import { Leaf, Sparkles } from "lucide-react";

export function CardVisual({
  name,
  animated = false,
  compact = false,
}: {
  name?: string | null;
  animated?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto grid place-items-center rounded-[10px] border border-[#d8c8b2] bg-[#fffdf7] shadow-sm ${
        animated ? "soul-card-reveal" : ""
      } ${compact ? "h-48 w-32" : "h-64 w-44"}`}
    >
      <div className="absolute inset-3 rounded-lg border border-[#e6dfd3]" />
      <div className="absolute left-4 top-4 text-[#8da892]">
        <Sparkles size={compact ? 16 : 18} aria-hidden="true" />
      </div>
      <div className="absolute bottom-4 right-4 rotate-180 text-[#8da892]">
        <Sparkles size={compact ? 16 : 18} aria-hidden="true" />
      </div>
      <div className="grid place-items-center gap-4 px-5 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-[#d8e2d5] text-[#51685a]">
          <Leaf size={compact ? 24 : 30} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8da892]">
            Soul Card
          </p>
          <p className="mt-2 text-xl font-semibold text-[#26332d]">{name ?? "正在抽卡"}</p>
        </div>
      </div>
    </div>
  );
}

export function ShuffleDeck() {
  return (
    <div className="relative mx-auto h-64 w-48">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="soul-card-shuffle absolute left-1/2 top-1/2 h-56 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[10px] border border-[#d8c8b2] bg-[#fffdf7] shadow-md"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <div className="absolute inset-3 rounded-lg border border-[#e6dfd3]" />
          <div className="absolute inset-0 grid place-items-center text-[#51685a]">
            <Leaf size={28} aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}
