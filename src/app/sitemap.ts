import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

// רק מסלולים ציבוריים שמחזירים תוכן קנוני בפועל.
// מסלולי התאימות/redirect, הקורא וההדפסה אינם sitemap destinations.

export const PUBLIC_ROUTES = [
  "/",
  "/hamchashot",
  "/hamchashot/t/concept",
  "/hamchashot/t/measure",
  "/hamchashot/t/coords",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: route === "/" ? SITE.publicUrl : `${SITE.publicUrl}${route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
