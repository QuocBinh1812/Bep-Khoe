"use client";

import { Minus, Plus } from "lucide-react";

export function ServingsStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  id,
  label = "Số khẩu phần",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  id: string;
  label?: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  return (
    <div className="inline-flex items-center gap-3">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <div className="inline-flex items-center rounded-full border border-line bg-white">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          className="grid size-11 place-items-center rounded-full text-brand-700 hover:bg-brand-50"
          aria-label="Giảm 1 khẩu phần"
        >
          <Minus aria-hidden className="size-5" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n) && n > 0) onChange(clamp(n));
          }}
          className="w-12 bg-transparent text-center text-lg font-bold tabular-nums focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          className="grid size-11 place-items-center rounded-full text-brand-700 hover:bg-brand-50"
          aria-label="Tăng 1 khẩu phần"
        >
          <Plus aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
