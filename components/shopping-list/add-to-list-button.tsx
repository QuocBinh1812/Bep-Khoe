"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingBasket } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { addShoppingItems, type ShoppingItemInput } from "@/lib/quantity";
import { writeShoppingList } from "@/lib/storage";

/** Thêm nhiều nguyên liệu vào danh sách đi chợ (tự gộp nguyên liệu trùng). */
export function AddToListButton({
  items,
  label = "Thêm vào danh sách đi chợ",
  variant = "primary",
  className,
}: {
  items: ShoppingItemInput[] | (() => ShoppingItemInput[]);
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}) {
  const [added, setAdded] = useState<number | null>(null);

  function handleClick() {
    const inputs = typeof items === "function" ? items() : items;
    if (!inputs.length) return;
    writeShoppingList((prev) => addShoppingItems(prev, inputs));
    setAdded(inputs.length);
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={handleClick} className={buttonClass(variant, "md", className)}>
        {added !== null ? <Check key={added} aria-hidden className="animate-pop size-5" /> : <ShoppingBasket aria-hidden className="size-5" />}
        {added !== null ? "Đã thêm – thêm lần nữa?" : label}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-muted">
        {added !== null && (
          <span className="animate-fade-up inline-block">
            Đã thêm {added} nguyên liệu.{" "}
            <Link href="/cong-cu/danh-sach-di-cho/" className="font-semibold text-brand-700 underline">
              Xem danh sách đi chợ
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}
