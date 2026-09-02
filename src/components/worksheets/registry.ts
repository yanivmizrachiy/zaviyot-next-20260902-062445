// מקור האמת היחיד לספר הדיגיטלי "הוראת זוויות בכיתה ז׳".
// 44 עמודים בסדר הקריאה הקנוני:
// 1 כריכה · 2 תוכן עניינים · 3–6 מבוא ותוכן הוראה · 7–12 לימוד/פוסטרים/יישומונים ·
// 13–43 בדיוק 31 דפי עבודה רציפים · 44 פוסטר סיום שאינו דף עבודה.
// המצגת אינה עמוד בספר; היא משאב נפרד בעמוד הראשי.
// עמודי image משתמשים ב-/booklet-worksheets/page-NN.webp; שאר העמודים מרונדרים ב-React.
export type WsContentId =
  | "angles-types" | "measurement" | "draw-measure" | "around-us" | "intro-a" | "intro-b" | "what-we-teach" | "why-models" | "applet" | "applet-maker"
  | "protractor-poster" | "clock-angles"
  | "right-angle-estimate"
  | "angle7-1" | "angle7-2" | "angle7-3" | "angle7-4";

type WsPageBase = {
  title: string;
  section: "angles" | "coords";
  toc?: { label: string; sub: string };
  // פתיחת קבוצת נושא. WS_GROUPS נגזר רק מסימונים אלה ומשמש ניווט והדפסה.
  groupStart?: string;
  // true רק לעמוד תרגול שהתלמיד עובד עליו. ממנו נגזרים WORKSHEETS והמספור הרץ.
  worksheet?: true;
};

export type WsPage =
  | (WsPageBase & { kind: "cover" })
  | (WsPageBase & { kind: "toc" })
  | (WsPageBase & { kind: "image"; img: number })
  | (WsPageBase & { kind: "content"; content: WsContentId });

export const WS_PAGES: WsPage[] = [
  { title: "חוברת הוראת הזוויות לכיתה ז׳", section: "angles", kind: "cover", groupStart: "פתיחה ומבוא", toc: { label: "חוברת הוראת הזוויות לכיתה ז׳", sub: "לאור עדכון ת״ל לקראת תשפ״ז" } },
  { title: "תוכן העניינים", section: "angles", kind: "toc" },
  { title: "מתוך עדכון ת״ל — גאומטריה קדם-היסקית: לומדים ומלמדים להבנה", section: "angles", kind: "content", content: "intro-a", toc: { label: "מתוך עדכון ת״ל", sub: "גאומטריה קדם-היסקית: לומדים ומלמדים להבנה" } },
  { title: "מתוך עדכון ת״ל — למה ללמוד להבנה?", section: "angles", kind: "content", content: "intro-b" },
  { title: "מה אנחנו מלמדים?", section: "angles", kind: "content", content: "what-we-teach", toc: { label: "מה אנחנו מלמדים?", sub: "נושאי הלימוד מתוך תוכנית הלימודים המעודכנת" } },
  { title: "למה נשתמש בהמחשות?", section: "angles", kind: "content", content: "why-models", toc: { label: "למה נשתמש בהמחשות?", sub: "פעולה במרחב · הגשר בין האינטואיציה לידע הפורמלי" } },

  { title: "סוגי זוויות", section: "angles", kind: "content", content: "angles-types", groupStart: "סוגי זוויות ומדידתן", toc: { label: "סוגי זוויות ומדידתן", sub: "ששת סוגי הזוויות והגדרותיהם" } },
  { title: "פוסטר — זוויות, מד זווית ומחוגה", section: "angles", kind: "image", img: 7 },
  { title: "מדידה ואומדן של זוויות", section: "coords", kind: "content", content: "measurement", toc: { label: "מדידה ואומדן של זוויות", sub: "מד זווית · אומדן · דיוק" } },
  { title: "קישור ליישומונים", section: "coords", kind: "content", content: "applet", toc: { label: "קישור ליישומונים", sub: "מד זווית לאומדן זוויות (Matific) · יצירת דפי עבודה של זוויות (StoryboardThat)" } },
  { title: "קישור ליישומונים", section: "coords", kind: "content", content: "applet-maker" },
  { title: "פוסטר — כיצד להשתמש במד זווית", section: "coords", kind: "content", content: "protractor-poster", toc: { label: "פוסטר — כיצד להשתמש במד זווית", sub: "מד זווית משמש למדידת גודל של זוויות · צפייה, הורדה והדפסה" } },

  // 31 דפי העבודה הקנוניים — עמודי ספר 13–43 בלבד.
  { title: "סוגי זוויות — זוויות סביבנו", section: "angles", kind: "content", content: "around-us", worksheet: true, groupStart: "דפי עבודה", toc: { label: "זוויות סביבנו", sub: "זיהוי, מיון ומדידה של זוויות מן הסביבה" } },
  { title: "השלימו את ההיגדים — הזוויות שבין העצים", section: "angles", kind: "image", img: 4, worksheet: true },
  { title: "ציור של שני עטים — סימון ההיגדים הנכונים", section: "angles", kind: "image", img: 5, worksheet: true },
  { title: "התבוננו בכל זוג עטים — התאמה למידת הזווית", section: "angles", kind: "image", img: 6, worksheet: true },
  { title: "מי אני? — חידות על גודל הזווית", section: "angles", kind: "image", img: 8, worksheet: true },
  { title: "הזווית שבין העץ הנטוי למישור הדשא", section: "angles", kind: "image", img: 9, worksheet: true },
  { title: "מספריים פתוחים — היגדים והשלמת משפטים", section: "angles", kind: "image", img: 10, worksheet: true },
  { title: "זוויות על פני השעון", section: "angles", kind: "image", img: 11, worksheet: true },
  { title: "מה גודל הזווית בין מחוגי השעון", section: "angles", kind: "content", content: "clock-angles", worksheet: true },
  { title: "זוויות ברחובות העיר — מפת הרחובות", section: "angles", kind: "image", img: 12, worksheet: true },
  { title: "זוויות ברחובות העיר — שאלות", section: "angles", kind: "image", img: 13, worksheet: true },
  { title: "השלימו את המשפטים בעזרת מחסן המילים — חלק א", section: "angles", kind: "image", img: 15, worksheet: true },
  { title: "השלימו את המשפטים בעזרת מחסן המילים — חלק ב", section: "coords", kind: "image", img: 16, worksheet: true, toc: { label: "זוויות במערכת צירים", sub: "זוויות על גבי מערכת הצירים" } },
  { title: "שרטוט ומדידת זוויות", section: "coords", kind: "content", content: "draw-measure", worksheet: true },
  { title: "קרניים מאונכות וזווית ישרה — נכון, לא נכון או אי אפשר לדעת", section: "coords", kind: "image", img: 17, worksheet: true },
  { title: "הזווית AOB במערכת הצירים — חלק א", section: "coords", kind: "image", img: 18, worksheet: true },
  { title: "הזווית AOB במערכת הצירים — חלק ב", section: "coords", kind: "image", img: 19, worksheet: true },
  { title: "השוואת זוויות מן הראשית אל נקודות שונות", section: "coords", kind: "image", img: 20, worksheet: true },
  { title: "הזזת הנקודה B ימינה — חקירת הזווית, חלק א", section: "coords", kind: "image", img: 21, worksheet: true },
  { title: "הזזת הנקודה B ימינה — חקירת הזווית, חלק ב", section: "coords", kind: "image", img: 22, worksheet: true },
  { title: "הזזת הנקודה B ימינה ומעלה — חקירת הזווית", section: "coords", kind: "image", img: 23, worksheet: true },
  { title: "הנקודה F — קרבה לציר וגודל הזווית", section: "coords", kind: "image", img: 24, worksheet: true },
  { title: "הנקודות C ו-D על אותה קרן — הזווית נשמרת", section: "coords", kind: "image", img: 25, worksheet: true },
  { title: "הנקודה E — רביעים וגודל הזווית", section: "coords", kind: "image", img: 26, worksheet: true },
  { title: "קרניים של 30° ו-60° — מיקום נקודות ביחס לקרן", section: "coords", kind: "image", img: 27, worksheet: true },
  { title: "חקירת נקודות ביחס למחוג", section: "coords", kind: "image", img: 28, worksheet: true },
  { title: "זוויות ישרות, חדות וקהות", section: "coords", kind: "content", content: "right-angle-estimate", worksheet: true, toc: { label: "אומדן של זווית ביחס לזווית ישרה", sub: "זוויות ישרות, חדות וקהות · בדיקה בעזרת דף מקופל" } },
  { title: "שאלות כמו בתוכנית הלימודים", section: "coords", kind: "content", content: "angle7-1", worksheet: true, toc: { label: "שאלות כמו בתוכנית הלימודים", sub: "זווית ישרה במערכת צירים · מאגר התרגילים, תרגול והעשרה" } },
  { title: "שאלות כמו בתוכנית הלימודים", section: "coords", kind: "content", content: "angle7-2", worksheet: true },
  { title: "שאלות כמו בתוכנית הלימודים", section: "coords", kind: "content", content: "angle7-3", worksheet: true },
  { title: "שאלות כמו בתוכנית הלימודים", section: "coords", kind: "content", content: "angle7-4", worksheet: true },

  { title: "פוסטר — סוגי זוויות ומדידתן", section: "angles", kind: "image", img: 14 },
];

export const WS_TOTAL = WS_PAGES.length;

export function wsPageImage(n: number): string {
  const page = WS_PAGES[n - 1];
  const img = page && page.kind === "image" ? page.img : n;
  return `/booklet-worksheets/page-${String(img).padStart(2, "0")}.webp`;
}

export const TOC_ENTRIES = WS_PAGES
  .map((page, index) => (page.toc ? { ...page.toc, page: index + 1 } : null))
  .filter((entry): entry is { label: string; sub: string; page: number } => entry !== null);

export type WsGroup = { title: string; from: number; to: number };
export const WS_GROUPS: WsGroup[] = WS_PAGES.reduce<WsGroup[]>((groups, page, index) => {
  if (page.groupStart) {
    if (groups.length) groups[groups.length - 1].to = index;
    groups.push({ title: page.groupStart, from: index + 1, to: WS_PAGES.length });
  }
  return groups;
}, []);

export function wsGroupOf(page1Based: number): WsGroup {
  const group = WS_GROUPS.find((item) => page1Based >= item.from && page1Based <= item.to);
  if (!group) throw new Error(`page ${page1Based} is outside all WS_GROUPS`);
  return group;
}

export type TocGroup = { title: string; entries: { label: string; sub: string; page: number; ordinal: number }[] };
export const TOC_GROUPS: TocGroup[] = WS_GROUPS.map((group) => ({
  title: group.title,
  entries: TOC_ENTRIES
    .map((entry, index) => ({ ...entry, ordinal: index + 1 }))
    .filter((entry) => entry.page >= group.from && entry.page <= group.to),
}));

export type WorksheetEntry = {
  id: string;
  num: number;
  slot: number;
  title: string;
  kind: "image" | "content";
  thumb?: string;
  printModes: readonly ["color", "bw"];
};

export const WORKSHEETS: WorksheetEntry[] = WS_PAGES
  .map((page, index) => ({ page, slot: index + 1 }))
  .filter((entry) => entry.page.worksheet)
  .map((entry, index) => ({
    id: entry.page.kind === "image" ? `img-${entry.page.img}` : entry.page.kind === "content" ? entry.page.content : `page-${entry.slot}`,
    num: index + 1,
    slot: entry.slot,
    title: entry.page.title,
    kind: entry.page.kind === "image" ? ("image" as const) : ("content" as const),
    thumb: entry.page.kind === "image" ? wsPageImage(entry.slot) : undefined,
    printModes: ["color", "bw"] as const,
  }));

export const WORKSHEETS_TOTAL = WORKSHEETS.length;
