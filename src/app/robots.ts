import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

// מסלולי הקורא/ההדפסה מסומנים noindex בדפים עצמם ולכן אינם כלולים ב-sitemap.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.publicUrl}/sitemap.xml`,
    host: SITE.publicUrl,
  };
}
