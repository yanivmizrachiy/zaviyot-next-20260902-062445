import type { MetadataRoute } from "next";

// מסלולי הקורא/ההדפסה מסומנים noindex בדפים עצמם ולכן אינם כלולים ב-sitemap.
const SITE_URL = "https://zaviyot.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
