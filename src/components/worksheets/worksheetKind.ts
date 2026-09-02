import type { WsPage } from "./registry";

// מפתח הרכיב שיוצג לעמוד חוברת — מיפוי טהור (בלי JSX) המשמש גם את
// WorksheetPageRenderer וגם את הבדיקות. מקור-אמת יחיד שמבטיח שכל kind/content
// ממופה בדיוק פעם אחת, עם exhaustive check (assertNever) שנכשל בזמן קומפילציה
// אם נוסף ערך שלא טופל.
export type WsComponentKey =
  | "cover"
  | "toc"
  | "image"
  | "intro-a"
  | "intro-b"
  | "what-we-teach"
  | "why-models"
  | "around-us"
  | "angles-types"
  | "measurement"
  | "draw-measure"
  | "applet"
  | "protractor-poster"
  | "clock-angles"
  | "right-angle-estimate"
  | "applet-maker"
  | "angle7-1"
  | "angle7-2"
  | "angle7-3"
  | "angle7-4";

function assertNever(x: never): never {
  throw new Error(`Unhandled worksheet variant: ${JSON.stringify(x)}`);
}

export function worksheetComponentKey(page: WsPage): WsComponentKey {
  switch (page.kind) {
    case "cover":
      return "cover";
    case "toc":
      return "toc";
    case "image":
      return "image";
    case "content":
      switch (page.content) {
        case "intro-a":
          return "intro-a";
        case "intro-b":
          return "intro-b";
        case "what-we-teach":
          return "what-we-teach";
        case "why-models":
          return "why-models";
        case "around-us":
          return "around-us";
        case "angles-types":
          return "angles-types";
        case "measurement":
          return "measurement";
        case "draw-measure":
          return "draw-measure";
        case "applet":
          return "applet";
        case "protractor-poster":
          return "protractor-poster";
        case "clock-angles":
          return "clock-angles";
        case "right-angle-estimate":
          return "right-angle-estimate";
        case "applet-maker":
          return "applet-maker";
        case "angle7-1":
          return "angle7-1";
        case "angle7-2":
          return "angle7-2";
        case "angle7-3":
          return "angle7-3";
        case "angle7-4":
          return "angle7-4";
        default:
          return assertNever(page.content);
      }
    default:
      return assertNever(page);
  }
}

// כל אחד מ-44 עמודי הספר הוא עמוד A4 קנוני וניתן להדפסה.
// המצגת אינה kind של הספר כלל; היא משאב נפרד בעמוד הראשי.
export function isPrintableKind(page: WsPage): boolean {
  switch (page.kind) {
    case "cover":
    case "toc":
    case "image":
    case "content":
      return true;
    default:
      return assertNever(page);
  }
}
