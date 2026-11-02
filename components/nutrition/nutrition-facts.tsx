import Link from "next/link";
import { macroEnergySplit, type RecipeNutrition } from "@/lib/nutrition";
import { formatNumber } from "@/lib/text";

/** Bảng dinh dưỡng tham khảo của công thức (ước tính từ bảng thành phần thực phẩm). */
export function NutritionFacts({ nutrition, servings }: { nutrition: RecipeNutrition; servings: number }) {
  const n = nutrition.perServing;
  const split = macroEnergySplit(n);
  const rows = [
    { label: "Chất đạm (protein)", value: n.protein, color: "bg-brand-600", pct: split.protein },
    { label: "Carbohydrate (bột đường)", value: n.carbs, color: "bg-accent-400", pct: split.carbs },
    { label: "Chất béo", value: n.fat, color: "bg-[#c58b4a]", pct: split.fat },
  ];
  return (
    <section aria-labelledby="dinh-duong" className="card p-5 sm:p-6">
      <h2 id="dinh-duong" className="text-2xl">
        Giá trị dinh dưỡng tham khảo
      </h2>
      <p className="mt-1 text-sm text-muted">Ước tính cho 1 khẩu phần (công thức gốc {servings} khẩu phần)</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold text-brand-700 tabular-nums">~{formatNumber(n.kcal, 0)}</span>
        <span className="font-semibold text-ink-soft">kcal / khẩu phần</span>
      </div>

      <div className="grow-x mt-4 flex h-3 overflow-hidden rounded-full bg-surface" aria-hidden>
        {rows.map((r) => (
          <span key={r.label} className={r.color} style={{ width: `${r.pct}%` }} />
        ))}
      </div>

      <dl className="mt-4 divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3 py-2.5">
            <dt className="inline-flex items-center gap-2">
              <span aria-hidden className={`size-3 rounded-full ${r.color}`} />
              {r.label}
            </dt>
            <dd className="font-semibold tabular-nums">
              {formatNumber(r.value)} g <span className="text-sm font-normal text-muted">({r.pct}% năng lượng)</span>
            </dd>
          </div>
        ))}
        {n.fiber !== null && (
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="pl-5">Chất xơ</dt>
            <dd className="font-semibold tabular-nums">{formatNumber(n.fiber)} g</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 rounded-xl bg-cream-50 p-3.5 text-sm text-ink-soft">
        <p>
          <strong className="font-semibold">Cách tính:</strong> cộng giá trị dinh dưỡng của {nutrition.linked}/
          {nutrition.totalIngredients} nguyên liệu có trong bảng thành phần thực phẩm của Bếp Khỏe (theo khối lượng phần ăn
          được), rồi chia cho số khẩu phần. Gia vị lượng nhỏ và nguyên liệu chưa có dữ liệu không được tính; lượng dầu, nước
          dùng thực tế hấp thụ có thể khác.
        </p>
        <p className="mt-2">
          Đây là số liệu ước tính để tham khảo, chưa được chuyên gia kiểm định.{" "}
          <Link href="/cong-cu/tinh-dinh-duong/" className="font-semibold text-brand-700 underline">
            Tự tính với công cụ dinh dưỡng
          </Link>
        </p>
      </div>
    </section>
  );
}
