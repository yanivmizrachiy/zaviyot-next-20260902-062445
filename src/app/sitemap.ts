import type { MetadataRoute } from "next";

// רק מסלולים ציבוריים שמחזירים תוכן קנוני בפועל.
// מסלולי התאימות/redirect, הקורא וההדפסה אינם sitemap destinations.
const SITE_URL = "https://zaviyot-next-20260902-062445.vercel.app";

export const PUBLIC_ROUTES = [
  "/",
  "/hamchashot",
  "/hamchashot/t/concept",
  "/hamchashot/t/measure",
  "/hamchashot/t/coords",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
