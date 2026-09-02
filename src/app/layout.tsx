import type { Metadata, Viewport } from "next";
import { Rubik, Assistant } from "next/font/google";
import { InPageTransitions } from "@/components/InPageTransitions";
import { SiteReturnNav } from "@/components/SiteReturnNav";
import Script from "next/script";
import "./globals.css";
import "./home-refinement.css";
import "./book-realism.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-rubik",
  display: "swap",
});

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
});

const SITE_URL = "https://zaviyot-next-20260902-062445.vercel.app";
const SITE_TITLE = "חוברת הוראת הזוויות לכיתה ז׳";
const SITE_DESC = "לאור עדכון ת״ל לקראת תשפ״ז";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · זוויות",
  },
  description: SITE_DESC,
  applicationName: "זוויות",
  authors: [{ name: "איילת קריספין" }],
  keywords: [
    "זוויות",
    "מתמטיקה",
    "מדידת זוויות",
    "סוגי זוויות",
    "תוכנית הלימודים",
    "איילת קריספין",
    "מנח״י",
    "מחוז ירושלים",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: "זוויות",
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e1830",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${assistant.variable}`}>
      <body className="site-numbers">
        {children}
        <SiteReturnNav />
        <InPageTransitions />
        <Script src="/reveal.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
