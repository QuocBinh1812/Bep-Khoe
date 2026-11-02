"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Pause,
  PartyPopper,
  Play,
  RotateCcw,
  Sun,
  Timer,
  X,
} from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { formatQuantity, isToTasteNote, scaleAmount } from "@/lib/quantity";
import { useRecipeServings } from "@/lib/recipe-session";
import { useHydrated } from "@/lib/storage";
import { cn } from "@/lib/text";
import type { RecipeIngredient, RecipeStep } from "@/types/content";

type Props = {
  slug: string;
  title: string;
  baseServings: number;
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
  className?: string;
};

type WakeLockSentinelLike = { release: () => Promise<void>; released: boolean };

/** Âm báo hết giờ bằng Web Audio (không cần file âm thanh). */
function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.45, 0.9].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.4);
    });
    window.setTimeout(() => ctx.close(), 1600);
  } catch {
    // Trình duyệt không hỗ trợ âm thanh – bỏ qua.
  }
  navigator.vibrate?.([300, 150, 300, 150, 300]);
}

function mmss(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Chế độ nấu: toàn màn hình, chữ lớn, từng bước một, giữ màn hình luôn sáng,
 * hẹn giờ theo bước, xem nhanh nguyên liệu. Điều khiển bằng nút, vuốt hoặc phím mũi tên.
 */
export function CookingMode({ slug, title, baseServings, steps, ingredients, className }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [showIngredients, setShowIngredients] = useState(false);
  const [wakeOn, setWakeOn] = useState(false);
  const hydrated = useHydrated();
  const wakeSupported = hydrated && "wakeLock" in navigator;
  const [timer, setTimer] = useState<{ step: number; remaining: number; running: boolean } | null>(null);
  const [servings] = useRecipeServings(slug, baseServings);
  const touchX = useRef<number | null>(null);

  const done = step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)];

  const go = useCallback((delta: number) => {
    setDir(delta < 0 ? "prev" : "next");
    setStep((s) => Math.min(steps.length, Math.max(0, s + delta)));
    setShowIngredients(false);
  }, [steps.length]);

  function openMode() {
    setStep(0);
    setShowIngredients(false);
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function closeMode() {
    dialogRef.current?.close();
  }

  // Giữ màn hình luôn sáng khi đang ở chế độ nấu.
  useEffect(() => {
    if (!open) return;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinelLike> } };
    if (!nav.wakeLock) return;
    let sentinel: WakeLockSentinelLike | null = null;
    let cancelled = false;
    const acquire = async () => {
      try {
        sentinel = await nav.wakeLock!.request("screen");
        if (!cancelled) setWakeOn(true);
      } catch {
        if (!cancelled) setWakeOn(false);
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && (!sentinel || sentinel.released)) acquire();
    };
    acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      sentinel?.release().catch(() => {});
      setWakeOn(false);
    };
  }, [open]);

  // Đếm ngược hẹn giờ.
  useEffect(() => {
    if (!timer?.running) return;
    const id = window.setInterval(() => {
      setTimer((t) => {
        if (!t || !t.running) return t;
        if (t.remaining <= 1) {
          beep();
          return { ...t, remaining: 0, running: false };
        }
        return { ...t, remaining: t.remaining - 1 };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timer?.running]);

  // Phím mũi tên khi chế độ nấu đang mở.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const stepTimer = timer && timer.step === step ? timer : null;

  return (
    <>
      <button type="button" onClick={openMode} className={buttonClass("primary", "md", className)}>
        <ChefHat aria-hidden className="size-5" /> Bắt đầu nấu
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Chế độ nấu: ${title}`}
        onClose={() => setOpen(false)}
        className="dialog-fade m-0 h-dvh max-h-none w-screen max-w-none bg-white p-0 text-ink backdrop:bg-ink"
      >
        <div
          className="flex h-full flex-col"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 70 && !showIngredients) go(dx < 0 ? 1 : -1);
          }}
        >
          {/* Thanh trên */}
          <header className="border-b border-line">
            <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
              <ChefHat aria-hidden className="size-6 shrink-0 text-brand-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold">{title}</p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  {wakeOn ? (
                    <>
                      <Sun aria-hidden className="size-3.5 text-accent-500" /> Màn hình luôn sáng
                    </>
                  ) : open && !wakeSupported ? (
                    "Không giữ được màn hình sáng"
                  ) : (
                    `${servings} khẩu phần`
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIngredients((s) => !s)}
                aria-pressed={showIngredients}
                className={buttonClass(showIngredients ? "secondary" : "outline", "sm")}
              >
                <ListChecks aria-hidden className="size-4" />
                <span className="sr-only sm:not-sr-only">Nguyên liệu</span>
              </button>
              <button
                type="button"
                onClick={closeMode}
                className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-brand-50"
                aria-label="Thoát chế độ nấu"
              >
                <X aria-hidden className="size-6" />
              </button>
            </div>
            <div
              className="h-1.5 bg-surface"
              role="progressbar"
              aria-label="Tiến độ nấu"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={Math.min(step + (done ? 0 : 1), steps.length)}
            >
              <div
                className="h-full bg-brand-600 transition-[width] duration-300"
                style={{ width: `${(Math.min(step + 1, steps.length) / steps.length) * 100}%` }}
              />
            </div>
          </header>

          {/* Nội dung */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
              {showIngredients ? (
                <section aria-label="Nguyên liệu" className="animate-fade-up">
                  <h2 className="text-2xl">Nguyên liệu cho {servings} khẩu phần</h2>
                  <ul className="mt-4 divide-y divide-line text-xl">
                    {ingredients.map((ing, i) => {
                      const q = formatQuantity(scaleAmount(ing.amount, baseServings, servings), ing.unit);
                      return (
                        <li key={i} className="py-3">
                          {ing.amount !== null && (
                            <span className="font-bold text-brand-800">
                              {q.amount} {q.unit}{" "}
                            </span>
                          )}
                          {ing.name}
                          {ing.amount === null && <span className="font-bold text-brand-800"> – vừa đủ</span>}
                          {ing.note && !isToTasteNote(ing.note) && <span className="text-muted"> – {ing.note}</span>}
                        </li>
                      );
                    })}
                  </ul>
                  <button type="button" onClick={() => setShowIngredients(false)} className={buttonClass("primary", "lg", "mt-6")}>
                    Quay lại bước đang nấu
                  </button>
                </section>
              ) : done ? (
                <section className="animate-scale-in flex flex-col items-center py-10 text-center">
                  <PartyPopper aria-hidden className="animate-wiggle size-16 text-accent-500" />
                  <h2 className="mt-4 text-3xl sm:text-4xl">Hoàn thành!</h2>
                  <p className="mt-3 max-w-md text-xl text-ink-soft">Chúc cả nhà ngon miệng với món {title.toLowerCase()}.</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={closeMode} className={buttonClass("primary", "lg")}>
                      Thoát chế độ nấu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDir("prev");
                        setStep(0);
                      }}
                      className={buttonClass("outline", "lg")}
                    >
                      <RotateCcw aria-hidden className="size-5" /> Xem lại từ đầu
                    </button>
                  </div>
                </section>
              ) : (
                <section key={step} aria-live="polite" className={dir === "next" ? "animate-slide-next" : "animate-slide-prev"}>
                  <p className="text-lg font-bold text-brand-700">
                    Bước {step + 1}/{steps.length}
                  </p>
                  {current.title && <h2 className="mt-2 text-3xl sm:text-4xl">{current.title}</h2>}
                  <p className="mt-5 text-[1.45rem] leading-relaxed sm:text-[1.7rem]">{current.text}</p>

                  {current.durationMinutes && (
                    <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-accent-100/70 p-4">
                      <Timer
                        aria-hidden
                        className={cn("size-8 text-accent-700", stepTimer?.remaining === 0 && "animate-wiggle text-red-700")}
                      />
                      {stepTimer ? (
                        <>
                          <span
                            className={cn(
                              "font-display text-4xl font-bold tabular-nums",
                              stepTimer.remaining === 0 ? "text-red-700" : "text-ink",
                            )}
                            role="timer"
                            aria-live="off"
                          >
                            {mmss(stepTimer.remaining)}
                          </span>
                          {stepTimer.remaining === 0 ? (
                            <span className="animate-pop text-lg font-bold text-red-700" role="alert">
                              Hết giờ!
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setTimer({ ...stepTimer, running: !stepTimer.running })}
                              className={buttonClass("outline", "md")}
                            >
                              {stepTimer.running ? <Pause aria-hidden className="size-5" /> : <Play aria-hidden className="size-5" />}
                              {stepTimer.running ? "Tạm dừng" : "Tiếp tục"}
                            </button>
                          )}
                          <button type="button" onClick={() => setTimer(null)} className={buttonClass("ghost", "md")}>
                            <RotateCcw aria-hidden className="size-5" /> Đặt lại
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setTimer({ step, remaining: current.durationMinutes! * 60, running: true })}
                          className={buttonClass("accent", "lg")}
                        >
                          Hẹn giờ {current.durationMinutes} phút
                        </button>
                      )}
                    </div>
                  )}
                </section>
              )}
            </div>
          </main>

          {/* Điều hướng */}
          {!showIngredients && !done && (
            <footer className="border-t border-line bg-white">
              <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  className={buttonClass("outline", "lg", "min-h-14 flex-1")}
                >
                  <ChevronLeft aria-hidden className="size-6" /> Bước trước
                </button>
                <button type="button" onClick={() => go(1)} className={buttonClass("primary", "lg", "min-h-14 flex-[1.4]")}>
                  {step === steps.length - 1 ? "Hoàn thành" : "Bước tiếp"} <ChevronRight aria-hidden className="size-6" />
                </button>
              </div>
            </footer>
          )}
        </div>
      </dialog>
    </>
  );
}
