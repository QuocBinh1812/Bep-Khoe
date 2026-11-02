"use client";

import { useState } from "react";
import { Check, Printer, Share2 } from "lucide-react";
import { buttonClass } from "@/components/common/button";

/** Nút In & Chia sẻ. Chia sẻ dùng Web Share API, nếu không hỗ trợ thì sao chép liên kết. */
export function SharePrint({ title, text, showPrint = true }: { title: string; text?: string; showPrint?: boolean }) {
  const [status, setStatus] = useState<string>("");

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("Đã sao chép liên kết");
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return;
      setStatus("Không thể chia sẻ – hãy sao chép địa chỉ trên thanh trình duyệt");
    }
    window.setTimeout(() => setStatus(""), 3000);
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      {showPrint && (
        <button type="button" onClick={() => window.print()} className={buttonClass("outline", "md")}>
          <Printer aria-hidden className="size-5" /> In
        </button>
      )}
      <button type="button" onClick={share} className={buttonClass("outline", "md")}>
        {status ? <Check aria-hidden className="size-5 text-brand-600" /> : <Share2 aria-hidden className="size-5" />}
        Chia sẻ
      </button>
      <span role="status" aria-live="polite" className="text-sm text-brand-700">
        {status}
      </span>
    </div>
  );
}
