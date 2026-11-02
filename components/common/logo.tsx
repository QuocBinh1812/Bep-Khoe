import { cn } from "@/lib/text";

/** Biểu tượng Bếp Khỏe: chiếc bát với lá xanh và làn hơi ấm. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("shrink-0", className)}>
      <rect width="48" height="48" rx="14" fill="#277A43" />
      <path
        d="M17 9.5c-1.6 2 1.6 3.5 0 5.6M24 8c-1.6 2 1.6 3.6 0 5.8M31 9.5c-1.6 2 1.6 3.5 0 5.6"
        stroke="#F3E8D5"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M9 22.5h30c0 8.3-6.7 15-15 15s-15-6.7-15-15z" fill="#F3E8D5" />
      <path d="M17.5 41h13" stroke="#F3E8D5" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M30.5 16.5c-5.6.2-9.3 3.4-9.6 9 4.7.3 9.2-2.4 9.6-9z"
        fill="#F0A65A"
      />
      <path d="M21.4 25.6c2.2-2.6 4.6-4.6 7.6-6.4" stroke="#277A43" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-10" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-bold tracking-tight text-brand-700">Bếp Khỏe</span>
        {!compact && (
          <span className="mt-1 hidden text-[0.7rem] font-medium text-muted sm:block">Ăn ngon – Sống khỏe</span>
        )}
      </span>
    </span>
  );
}
