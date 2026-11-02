"use client";

import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { writeMealPlanner, type PlannerState } from "@/lib/storage";

/** Chép thực đơn mẫu sang công cụ lập thực đơn để người dùng tự chỉnh sửa. */
export function UsePlanButton({ plan }: { plan: PlannerState }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        const hasExisting = (() => {
          try {
            return !!window.localStorage.getItem("bepkhoe:meal-planner:v1");
          } catch {
            return false;
          }
        })();
        if (hasExisting && !window.confirm("Thay thực đơn bạn đang lập bằng thực đơn mẫu này?")) return;
        writeMealPlanner(plan);
        router.push("/cong-cu/lap-thuc-don/");
      }}
      className={buttonClass("outline", "md")}
    >
      <CalendarDays aria-hidden className="size-5" /> Tùy chỉnh thực đơn này
    </button>
  );
}
