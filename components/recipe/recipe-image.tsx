import Image from "next/image";
import { Beef, CookingPot, Drumstick, Egg, Fish, Leaf, Salad, Shrimp, Soup, Wheat, type LucideIcon } from "lucide-react";
import type { ContentImage } from "@/types/content";
import { cn } from "@/lib/text";

type Props = {
  title: string;
  image?: ContentImage;
  dishType: string;
  ingredientTags: readonly string[];
  sizes: string;
  priority?: boolean;
  className?: string;
};

const ICONS = { Fish, Shrimp, Drumstick, Beef, Egg, Soup, Salad, Leaf, CookingPot, Wheat } satisfies Record<
  string,
  LucideIcon
>;
type IconName = keyof typeof ICONS;

const ICON_BY_TAG: Array<[string, IconName]> = [
  ["ca", "Fish"],
  ["tom", "Shrimp"],
  ["ga", "Drumstick"],
  ["thit-bo", "Beef"],
  ["trung", "Egg"],
];
const ICON_BY_DISH: Record<string, IconName> = {
  canh: "Soup",
  chao: "Soup",
  "bun-pho": "Soup",
  salad: "Salad",
  xao: "Leaf",
  "kho-rim": "CookingPot",
  "hap-luoc": "CookingPot",
  sot: "CookingPot",
};

const PALETTES = [
  "from-cream-200 via-cream-100 to-accent-100 text-brand-700",
  "from-brand-100 via-brand-50 to-cream-100 text-brand-700",
  "from-accent-100 via-cream-100 to-cream-200 text-accent-700",
  "from-cream-100 via-brand-50 to-brand-100 text-brand-800",
];

function pickIcon(dishType: string, tags: readonly string[]): IconName {
  if (dishType === "canh" || dishType === "chao" || dishType === "bun-pho") return ICON_BY_DISH[dishType];
  for (const [tag, icon] of ICON_BY_TAG) if (tags.includes(tag)) return icon;
  if (tags.includes("gao-ngu-coc")) return "Wheat";
  return ICON_BY_DISH[dishType] ?? "CookingPot";
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Ảnh món ăn tỷ lệ 4:3. Khi chưa có ảnh thật, hiển thị hình minh họa nhẹ (không tải thêm file)
 * thay vì dùng URL ảnh giả có thể lỗi.
 */
export function RecipeImage({ title, image, dishType, ingredientTags, sizes, priority, className }: Props) {
  if (image) {
    return (
      <div className={cn("relative aspect-[4/3] overflow-hidden bg-cream-100", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }
  const Icon = ICONS[pickIcon(dishType, ingredientTags)];
  const palette = PALETTES[hash(title) % PALETTES.length];
  return (
    <div
      role="img"
      aria-label={`Hình minh họa món ${title}`}
      className={cn("relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br", palette, className)}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.6px, transparent 1.7px)",
          backgroundSize: "22px 22px",
        }}
      />
      <span className="relative grid size-[38%] max-h-28 max-w-28 place-items-center rounded-full bg-white/75 shadow-sm ring-1 ring-white">
        <Icon aria-hidden strokeWidth={1.5} className="size-1/2" />
      </span>
    </div>
  );
}
