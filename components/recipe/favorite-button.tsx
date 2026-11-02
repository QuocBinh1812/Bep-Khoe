"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites, useHydrated } from "@/lib/storage";
import { cn } from "@/lib/text";

export function FavoriteButton({
  slug,
  title,
  variant = "icon",
  className,
}: {
  slug: string;
  title: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { favorites, toggle } = useFavorites();
  const [pulse, setPulse] = useState(0);
  const hydrated = useHydrated();
  const active = hydrated && favorites.includes(slug);
  const label = active ? `Bỏ lưu "${title}" khỏi yêu thích` : `Lưu "${title}" vào yêu thích`;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => {
          toggle(slug);
          setPulse((n) => n + 1);
        }}
        aria-pressed={active}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.95rem] font-semibold transition-colors",
          active
            ? "border-accent-400 bg-accent-100 text-accent-700 hover:bg-accent-200"
            : "border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50",
          className,
        )}
      >
        <Heart key={pulse} aria-hidden className={cn("size-5", active && "fill-current", pulse > 0 && "animate-pop")} />
        {active ? "Đã lưu yêu thích" : "Lưu yêu thích"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        setPulse((n) => n + 1);
      }}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-11 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 transition-colors hover:bg-white",
        active ? "text-accent-500" : "text-ink-soft hover:text-accent-500",
        className,
      )}
    >
      <Heart key={pulse} aria-hidden className={cn("size-5", active && "fill-current", pulse > 0 && "animate-pop")} />
    </button>
  );
}
