import type { Metadata, Viewport } from "next";
import { Rubik, Assistant } from "next/font/google";
import localFont from "next/font/local";
import { InPageTransitions } from "@/components/InPageTransitions";
import Script from "next/script";
import "./globals.css";
import "./home-refinement.css";

// עיצוב בהשראת Oak National Academy: גופן גיאומטרי-מעוגל אחד לכל האתר
// (Oak משתמשים ב-Lexend בלבד; Lexend לא תומך בעברית, לכן Rubik — קרוב לו
// באופי — הוא הגופן היחיד כאן. globals.css מכוון גם את --font-assistant
// לאותו גופן, כך שאין עוד שימוש בגופן שני.
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-rubik",
  display: "swap",
});

// מערכת עיצוב אחידה: Assistant לגוף הטקסט (זהה ל«מספרים מכוונים»), Rubik לכותרות.
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
});

// גופן כתב-יד עברי עגול "Gveret Levin" (AlefAlefAlef, רישיון OFL) — מאורח
// עצמית (הקובץ ב-src/fonts) כי הגופן אינו ברשימת next/font/google של Next.
// לשימוש נקודתי בלבד: כותרת-ההשראה מעל סרטון "המירוץ למיליון". לא מחליף את
// גופן האתר.
const gveretLevin = localFont({
  src: "../fonts/GveretLevin-Regular.ttf",
  variable: "--font-gveret",
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
    <html lang="he" dir="rtl" className={`${rubik.variable} ${assistant.variable} ${gveretLevin.variable}`}>
      <body className="site-numbers">
        {children}
        <InPageTransitions />
        <Script src="/reveal.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
