"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { EmptyState } from "@/components/common/empty-state";
import { buttonClass } from "@/components/common/button";
import { DISH_TYPES, INGREDIENT_TAGS, RECIPE_CATEGORIES } from "@/data/taxonomy";
import { cn, matchesQuery, normalizeVi } from "@/lib/text";
import type { RecipeSummary } from "@/types/content";

const PAGE_SIZE = 12;

const TIME_OPTIONS = [
  { value: "", label: "Mọi thời gian" },
  { value: "15", label: "≤ 15 phút" },
  { value: "30", label: "≤ 30 phút" },
  { value: "60", label: "≤ 1 giờ" },
];

const SORT_OPTIONS = [
  { value: "moi-nhat", label: "Phù hợp nhất / mới nhất" },
  { value: "nhanh-nhat", label: "Nấu nhanh nhất" },
  { value: "it-calo", label: "Ít năng lượng nhất" },
  { value: "a-z", label: "Tên A → Z" },
];

type Filters = {
  q: string;
  cat: string;
  loai: string;
  time: string;
  ing: string[];
  sort: string;
  page: number;
};

function readFilters(sp: URLSearchParams): Filters {
  return {
    q: sp.get("q") ?? "",
    cat: sp.get("danh-muc") ?? "",
    loai: sp.get("loai") ?? "",
    time: sp.get("thoi-gian") ?? "",
    ing: (sp.get("nguyen-lieu") ?? "").split(",").filter(Boolean),
    sort: sp.get("sap-xep") ?? "moi-nhat",
    page: Math.max(1, Number(sp.get("trang")) || 1),
  };
}

function toSearch(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.cat) p.set("danh-muc", f.cat);
  if (f.loai) p.set("loai", f.loai);
  if (f.time) p.set("thoi-gian", f.time);
  if (f.ing.length) p.set("nguyen-lieu", f.ing.join(","));
  if (f.sort !== "moi-nhat") p.set("sap-xep", f.sort);
  if (f.page > 1) p.set("trang", String(f.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** Điểm liên quan: khớp nguyên cụm trong tên món > khớp từng từ trong tên > khớp mô tả/nguyên liệu. */
function relevance(r: RecipeSummary, q: string): number {
  const query = normalizeVi(q);
  const title = normalizeVi(r.title);
  let score = title.includes(query) ? 100 : 0;
  if (title.startsWith(query)) score += 20;
  for (const t of query.split(" ")) if (title.split(" ").includes(t)) score += 10;
  if (r.searchText.includes(query)) score += 5;
  return score;
}

export function filterRecipes(recipes: RecipeSummary[], f: Filters): RecipeSummary[] {
  const max = Number(f.time) || Infinity;
  const result = recipes.filter(
    (r) =>
      (!f.q.trim() || matchesQuery(r.searchText, f.q)) &&
      (!f.cat || r.categories.includes(f.cat as RecipeSummary["categories"][number])) &&
      (!f.loai || r.dishType === f.loai) &&
      r.totalMinutes <= max &&
      f.ing.every((t) => r.ingredientTags.includes(t as RecipeSummary["ingredientTags"][number])),
  );
  const sorted = [...result];
  switch (f.sort) {
    case "nhanh-nhat":
      sorted.sort((a, b) => a.totalMinutes - b.totalMinutes);
      break;
    case "it-calo":
      sorted.sort((a, b) => (a.kcalPerServing ?? Infinity) - (b.kcalPerServing ?? Infinity));
      break;
    case "a-z":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "vi"));
      break;
    default:
      sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      if (f.q.trim()) sorted.sort((a, b) => relevance(b, f.q) - relevance(a, f.q));
  }
  return sorted;
}

/** Tìm kiếm & lọc công thức phía trình duyệt. Trạng thái lưu trên URL để chia sẻ được. */
export function RecipeExplorer({ recipes }: { recipes: RecipeSummary[] }) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams(searchParams.toString())));
  const [showFilters, setShowFilters] = useState(false);
  const [lastParams, setLastParams] = useState(searchParams.toString());

  // Đồng bộ khi URL đổi từ bên ngoài (ví dụ tìm kiếm từ header).
  const currentParams = searchParams.toString();
  if (currentParams !== lastParams) {
    setLastParams(currentParams);
    const fromUrl = readFilters(new URLSearchParams(currentParams));
    if (toSearch(fromUrl) !== toSearch(filters)) setFilters(fromUrl);
  }

  useEffect(() => {
    const search = toSearch(filters);
    if (search !== (window.location.search || "")) {
      const t = window.setTimeout(() => {
        window.history.replaceState(null, "", `${window.location.pathname}${search}`);
      }, 250);
      return () => window.clearTimeout(t);
    }
  }, [filters]);

  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, page: 1, ...patch }));

  const results = useMemo(() => filterRecipes(recipes, filters), [recipes, filters]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount =
    (filters.cat ? 1 : 0) + (filters.loai ? 1 : 0) + (filters.time ? 1 : 0) + filters.ing.length;

  const goToPage = (p: number) => {
    setFilters((f) => ({ ...f, page: p }));
    document.getElementById("ket-qua")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearAll = () => setFilters({ q: "", cat: "", loai: "", time: "", ing: [], sort: "moi-nhat", page: 1 });

  return (
    <div>
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="recipe-search" className="sr-only">
              Tìm công thức theo tên món hoặc nguyên liệu
            </label>
            <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              id="recipe-search"
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Tên món hoặc nguyên liệu: cá, trứng, bí đỏ…"
              className="field min-h-12 pl-11"
            />
          </div>
          <div className="flex gap-3">
            <label htmlFor="recipe-sort" className="sr-only">
              Sắp xếp
            </label>
            <select
              id="recipe-sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="field min-h-12 flex-1 sm:w-48"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls="recipe-filters"
              className={buttonClass(showFilters || activeCount ? "secondary" : "outline", "md", "min-h-12 lg:hidden")}
            >
              <SlidersHorizontal aria-hidden className="size-5" />
              Bộ lọc{activeCount ? ` (${activeCount})` : ""}
            </button>
          </div>
        </div>

        <div id="recipe-filters" className={cn("mt-4 space-y-4 border-t border-line pt-4 lg:block", !showFilters && "hidden")}>
          <FilterRow label="Danh mục">
            <Chip active={!filters.cat} onClick={() => update({ cat: "" })}>
              Tất cả
            </Chip>
            {RECIPE_CATEGORIES.map((c) => (
              <Chip key={c.slug} active={filters.cat === c.slug} onClick={() => update({ cat: filters.cat === c.slug ? "" : c.slug })}>
                {c.name}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Nguyên liệu bạn có" hint="Chọn nhiều – món phải có đủ các nguyên liệu đã chọn">
            {INGREDIENT_TAGS.map((t) => {
              const on = filters.ing.includes(t.slug);
              return (
                <Chip
                  key={t.slug}
                  active={on}
                  onClick={() => update({ ing: on ? filters.ing.filter((x) => x !== t.slug) : [...filters.ing, t.slug] })}
                >
                  {t.name}
                </Chip>
              );
            })}
          </FilterRow>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="filter-type" className="mb-1.5 block text-sm font-bold text-ink-soft">
                Loại món
              </label>
              <select id="filter-type" value={filters.loai} onChange={(e) => update({ loai: e.target.value })} className="field">
                <option value="">Tất cả loại món</option>
                {DISH_TYPES.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-time" className="mb-1.5 block text-sm font-bold text-ink-soft">
                Thời gian nấu
              </label>
              <select id="filter-time" value={filters.time} onChange={(e) => update({ time: e.target.value })} className="field">
                {TIME_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div id="ket-qua" className="mt-6 flex scroll-mt-24 flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="font-semibold text-ink-soft">
          {results.length} công thức{filters.q.trim() ? ` cho “${filters.q.trim()}”` : ""}
        </p>
        {(activeCount > 0 || filters.q) && (
          <button type="button" onClick={clearAll} className={buttonClass("ghost", "sm")}>
            <X aria-hidden className="size-4" /> Xóa bộ lọc
          </button>
        )}
      </div>

      {pageItems.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((r, i) => (
            <RecipeCard key={r.slug} recipe={r} priority={i < 2} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-4"
          icon={SearchX}
          title="Chưa tìm thấy công thức phù hợp"
          description="Thử bỏ bớt nguyên liệu đã chọn, đổi thời gian nấu hoặc tìm bằng từ khóa ngắn hơn (ví dụ “cá”, “trứng”)."
          action={
            <button type="button" onClick={clearAll} className={buttonClass("primary")}>
              Xem tất cả công thức
            </button>
          }
        />
      )}

      {totalPages > 1 && (
        <nav aria-label="Phân trang" className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className={buttonClass("outline", "icon")}
            aria-label="Trang trước"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={buttonClass(p === page ? "primary" : "outline", "icon")}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className={buttonClass("outline", "icon")}
            aria-label="Trang sau"
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </nav>
      )}
    </div>
  );
}

function FilterRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold text-ink-soft">
        {label}
        {hint && <span className="ml-2 font-normal text-muted">{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-10 items-center rounded-full border px-3.5 text-[0.92rem] font-medium transition-colors",
        active
          ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
          : "border-line bg-white text-ink-soft hover:border-brand-300 hover:bg-brand-50",
      )}
    >
      {children}
    </button>
  );
}
