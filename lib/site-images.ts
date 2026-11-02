import { z } from "zod";
import { imageSchema } from "@/lib/schemas";
import siteImagesJson from "@/data/site-images.json";

const siteImagesSchema = z.object({ hero: imageSchema.optional() });

/** Ảnh dùng chung của website (ảnh hero trang chủ...). */
export const siteImages = siteImagesSchema.parse(siteImagesJson);
