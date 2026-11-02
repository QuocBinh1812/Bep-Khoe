import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Coffee, Moon, Refrigerator, Search, Sun } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";
import { toCardData } from "@/components/article/article-views";
import { buttonClass } from "@/components/common/button";
import { CollectionCard } from "@/components/collection/collection-card";
import { SectionHeading } from "@/components/common/section-heading";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { FridgeFinder } from "@/components/recipe/fridge-finder";
import { TodaySuggestion } from "@/components/recipe/today-suggestion";
import { MEALS, RECIPE_CATEGORIES, WEEKDAYS } from "@/data/taxonomy";
import { getArticles } from "@/lib/articles";
import { getCollections, toCollectionCard } from "@/lib/collections";
import { getMealPlans, mealPlanRecipeCounts, resolveMealItem } from "@/lib/meal-plans";
import { getAllRecipes, getFeaturedRecipes, getRecipesByCategory, toSummary } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { siteImages } from "@/lib/site-images";
import { TOOLS } from "./cong-cu/tools";

export const metadata = buildMetadata({
  title: `${site.name} – Công thức nấu ăn ngon, dinh dưỡng cho gia đình Việt`,
  absoluteTitle: true,
  description: site.description,
  path: "/",
});

const MEAL_ICONS = { sang: Coffee, trua: Sun, toi: Moon } as const;

export default function HomePage() {
  const all = getAllRecipes();
  const featured = getFeaturedRecipes(4).map(toSummary);
  const summaries = all.map(toSummary);
  const slots = [
    { label: "Bữa sáng", recipes: summaries.filter((r) => r.categories.includes("mon-an-sang")) },
    {
      label: "Món chính",
      recipes: summaries.filter((r) => ["kho-rim", "hap-luoc", "sot", "xao"].includes(r.dishType) && r.dishType !== "salad"),
    },
    { label: "Món canh", recipes: summaries.filter((r) => r.dishType === "canh") },
  ];
  const plans = getMealPlans();
  const weekPlan = plans.find((p) => p.category === "thuc-don-7-ngay") ?? plans[0];
  const nutrition = getArticles("dinh-duong");
  const nutritionFeatured = [...nutrition.filter((a) => a.featured), ...nutrition.filter((a) => !a.featured)].slice(0, 3);
  const health = getArticles("suc-khoe").slice(0, 3);
  const heroCollage = getFeaturedRecipes(4);
  const collections = getCollections();

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-brand-50">
        <div className="container-page grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-brand-800 ring-1 ring-brand-100">
              {site.slogan}
            </p>
            <h1 id="hero-title" className="mt-5 text-[2.3rem] leading-[1.15] sm:text-5xl lg:text-[3.4rem]">
              Bữa cơm nhà <span className="text-brand-700">ngon miệng</span>, cả nhà{" "}
              <span className="relative whitespace-nowrap">
                khỏe mạnh
                <svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-1 left-0 h-3 w-full text-accent-400" preserveAspectRatio="none">
                  <path d="M2 9c40-6 120-8 196-3" pathLength={1} className="animate-draw" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              Công thức món Việt dễ nấu, ít dầu mỡ; kiến thức dinh dưỡng dễ hiểu; thực đơn 7 ngày và danh sách đi chợ tự động –
              tất cả miễn phí cho gia đình bạn.
            </p>

            <form action="/cong-thuc/" method="get" role="search" className="mt-7 flex max-w-xl gap-2 rounded-full bg-white p-1.5 shadow-[var(--shadow-card)] ring-1 ring-line">
              <label htmlFor="hero-search" className="sr-only">
                Tìm công thức
              </label>
              <div className="relative flex-1">
                <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  placeholder="Hôm nay nấu gì? Ví dụ: canh chua"
                  className="h-12 w-full rounded-full bg-transparent pl-12 pr-3 text-ink placeholder:text-[#7d8a81] focus:outline-none"
                />
              </div>
              <button type="submit" className={buttonClass("primary", "lg")}>
                Tìm món
              </button>
            </form>

            <a
              href="#tu-lanh"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full font-semibold text-brand-800 hover:text-brand-700"
            >
              <Refrigerator aria-hidden className="size-5 text-brand-600" />
              Chưa biết nấu gì? Chọn nguyên liệu trong tủ lạnh
              <ArrowDown aria-hidden className="size-4" />
            </a>
          </div>

          {siteImages.hero ? (
            <figure className="animate-float-in relative">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] shadow-[var(--shadow-card-hover)] ring-8 ring-white">
                <Image
                  src={siteImages.hero.src}
                  alt={siteImages.hero.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
              {siteImages.hero.credit && (
                <figcaption className="mt-2 text-right text-xs text-muted">
                  Ảnh: {siteImages.hero.credit.author} ·{" "}
                  <a href={siteImages.hero.credit.sourceUrl} target="_blank" rel="noopener nofollow" className="underline">
                    Wikimedia Commons
                  </a>{" "}
                  · {siteImages.hero.credit.license}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="animate-float-in grid grid-cols-2 gap-3 sm:gap-4" aria-hidden>
              {heroCollage.map((r, i) => (
                <RecipeImage
                  key={r.slug}
                  title={r.title}
                  image={r.image}
                  dishType={r.dishType}
                  ingredientTags={r.ingredientTags}
                  priority={i < 2}
                  sizes="(min-width: 1024px) 280px, 50vw"
                  className={`rounded-3xl shadow-[var(--shadow-card)] ring-4 ring-white ${i % 2 ? "translate-y-6" : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TỦ LẠNH CÓ GÌ */}
      <section id="tu-lanh" aria-labelledby="tu-lanh-title" className="scroll-mt-20 border-y border-brand-100 bg-brand-50/70">
        <div className="container-page py-12 sm:py-16">
          <SectionHeading
            id="tu-lanh-title"
            eyebrow="Nấu từ đồ sẵn có"
            title="Tủ lạnh nhà bạn có gì?"
            description="Chọn những nguyên liệu đang có – Bếp Khỏe gợi ý ngay món nấu được, không cần đi chợ thêm."
          />
          <FridgeFinder recipes={summaries} />
        </div>
      </section>

      <div className="space-y-20 py-16 sm:space-y-24 sm:py-20">
        {/* CÔNG THỨC NỔI BẬT */}
        <section aria-labelledby="noi-bat" className="container-page">
          <SectionHeading
            id="noi-bat"
            eyebrow="Được nấu nhiều"
            title="Công thức nổi bật"
            description="Những món quen thuộc, được hướng dẫn kỹ từng bước và điều chỉnh để lành mạnh hơn."
            href="/cong-thuc/"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>

        {/* GỢI Ý HÔM NAY */}
        <section aria-labelledby="hom-nay" className="bg-surface py-14 sm:py-16">
          <div className="container-page">
            <SectionHeading
              id="hom-nay"
              eyebrow="Hôm nay ăn gì?"
              title="Gợi ý món ăn hôm nay"
              description="Một bữa sáng, một món chính và một món canh – gợi ý đổi mới mỗi ngày."
            />
            <TodaySuggestion slots={slots} />
          </div>
        </section>

        {/* DANH MỤC */}
        <section aria-labelledby="danh-muc" className="container-page">
          <SectionHeading id="danh-muc" eyebrow="Khám phá" title="Công thức theo danh mục" href="/cong-thuc/" />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {RECIPE_CATEGORIES.map((c, i) => {
              const count = getRecipesByCategory(c.slug).length;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/cong-thuc/danh-muc/${c.slug}/`}
                    className={`reveal group flex h-full flex-col rounded-[var(--radius-card)] p-4 transition-[background-color,translate] duration-200 hover:-translate-y-1 sm:p-6 ${
                      ["bg-brand-50 hover:bg-brand-100", "bg-cream-100 hover:bg-cream-200", "bg-accent-100/70 hover:bg-accent-100"][i % 3]
                    }`}
                  >
                    <span className="font-display text-lg font-bold sm:text-xl">{c.name}</span>
                    <span className="mt-1 hidden text-[0.95rem] text-ink-soft sm:block">{c.description}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-brand-700">
                      {count} công thức
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* THỰC ĐƠN 7 NGÀY */}
        {weekPlan && (
          <section aria-labelledby="thuc-don" className="container-page">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 text-white">
              <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent-200">Thực đơn 7 ngày</p>
                  <h2 id="thuc-don" className="mt-2 text-3xl text-white sm:text-4xl">
                    {weekPlan.title}
                  </h2>
                  <p className="mt-3 text-brand-50/90">{weekPlan.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/thuc-don/${weekPlan.slug}/`} className={buttonClass("accent", "lg")}>
                      Xem thực đơn
                    </Link>
                    <Link
                      href="/thuc-don/"
                      className="inline-flex min-h-12 items-center gap-1.5 rounded-full px-5 font-semibold text-white ring-1 ring-white/40 hover:bg-white/10"
                    >
                      {plans.length} thực đơn mẫu <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                  <p className="mt-4 text-sm text-brand-50/80">
                    {mealPlanRecipeCounts(weekPlan).size} món có công thức · tạo danh sách đi chợ cả tuần trong một lần bấm
                  </p>
                </div>
                <ol className="grid gap-2 sm:grid-cols-2">
                  {weekPlan.days.slice(0, 4).map((d, i) => (
                    <li key={i} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <p className="font-display font-bold">{WEEKDAYS[i]}</p>
                      <ul className="mt-2 space-y-1 text-[0.92rem]">
                        {MEALS.map((m) => {
                          const Icon = MEAL_ICONS[m.slug];
                          const first = d[m.slug].map(resolveMealItem).find((x) => x.recipe) ?? resolveMealItem(d[m.slug][0]);
                          return (
                            <li key={m.slug} className="flex items-start gap-2">
                              <Icon aria-hidden className="mt-1 size-3.5 shrink-0 text-accent-200" />
                              <span className="sr-only">{m.name}: </span>
                              <span className="line-clamp-1 text-brand-50">{first.name}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* BỘ SƯU TẬP */}
        <section aria-labelledby="bo-suu-tap" className="container-page">
          <SectionHeading
            id="bo-suu-tap"
            eyebrow="Theo nhu cầu"
            title="Bộ sưu tập cho gia đình bạn"
            description="Nấu nhanh sau giờ làm, nấu cho ông bà hay muốn ăn nhẹ bụng – chọn một bộ sưu tập là có ngay danh sách món."
            href="/bo-suu-tap/"
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.slice(0, 3).map((c) => (
              <li key={c.slug} className="flex">
                <CollectionCard collection={toCollectionCard(c)} className="w-full" />
              </li>
            ))}
          </ul>
        </section>

        {/* DINH DƯỠNG */}
        <section aria-labelledby="dinh-duong" className="container-page">
          <SectionHeading
            id="dinh-duong"
            eyebrow="Hiểu để ăn đúng"
            title="Chủ đề dinh dưỡng nổi bật"
            description="Kiến thức dinh dưỡng dễ hiểu, có nguồn tham khảo rõ ràng và ngày cập nhật."
            href="/dinh-duong/"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {nutritionFeatured.map((a) => (
              <ArticleCard key={a.slug} article={toCardData(a)} />
            ))}
          </div>
        </section>

        {/* CÔNG CỤ */}
        <section aria-labelledby="cong-cu" className="bg-cream-50 py-14 sm:py-16">
          <div className="container-page">
            <SectionHeading
              id="cong-cu"
              eyebrow="Miễn phí · không cần đăng ký"
              title="Công cụ dinh dưỡng & bếp núc"
              href="/cong-cu/"
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TOOLS.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="reveal group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <t.icon aria-hidden className="size-6 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                    </span>
                    <span className="mt-4 font-display text-lg font-bold group-hover:text-brand-700">{t.title}</span>
                    <span className="mt-1 text-[0.95rem] text-muted">{t.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SỨC KHỎE */}
        <section aria-labelledby="suc-khoe" className="container-page">
          <SectionHeading
            id="suc-khoe"
            eyebrow="Sống khỏe mỗi ngày"
            title="Bài viết sức khỏe mới nhất"
            href="/suc-khoe/"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {health.map((a) => (
              <ArticleCard key={a.slug} article={toCardData(a)} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
