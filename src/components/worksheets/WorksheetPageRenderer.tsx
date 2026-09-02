import type { ReactNode } from "react";
import type { WsPage } from "./registry";
import { wsPageImage } from "./registry";
import { worksheetComponentKey, isPrintableKind } from "./worksheetKind";
import { BookletCoverPage } from "@/components/BookletCoverPage";
import { BookletTocSheet } from "./BookletTocSheet";
import { IntroUnderstandingSheet, WhatWeTeachSheet, WhyModelsSheet } from "./IntroUnderstandingSheet";
import { AnglesAroundUsSheet } from "./AnglesAroundUsSheet";
import { AnglesTypesSheet } from "./AnglesTypesSheet";
import { MeasurementEstimationSheet } from "./MeasurementEstimationSheet";
import { DrawMeasureSheet } from "./DrawMeasureSheet";
import { AppletBookletSheet, AppletMakerBookletSheet } from "./AppletBookletSheet";
import { ProtractorPosterSheet } from "./ProtractorPosterSheet";
import { ClockAnglesSheet } from "./ClockAnglesSheet";
import { Angles7Sheet } from "./Angles7Sheet";
import { RightAngleEstimateSheet } from "./RightAngleEstimateSheet";

// מקור-רינדור יחיד ל-44 עמודי חוברת הזוויות.
// המצגת אינה עמוד בספר ואינה מטופלת כאן; היא משאב נפרד בעמוד הראשי.
// כל kind/content ממופה כאן בדיוק פעם אחת, עם exhaustive check שמונע fallback שקט.
function assertNever(x: never): never {
  throw new Error(`Unhandled worksheet variant: ${JSON.stringify(x)}`);
}

export const isPrintablePage = isPrintableKind;

export type WorksheetRenderOpts = {
  /** מיקום העמוד בחוברת (1-based) — משמש לתמונה. */
  slot: number;
  /** ניווט תוכן-העניינים: onJump (ספר דיגיטלי) או hrefFor (קורא/הדפסה). */
  tocOnJump?: (page1Based: number) => void;
  tocHrefFor?: (page1Based: number) => string;
};

// מחזיר את רכיב התוכן הפנימי הנכון לעמוד. העטיפה (A4 / scale / stacking) נשארת
// באחריות כל צרכן — כאן ממופה אך ורק איזה רכיב מוצג.
export function worksheetContentNode(page: WsPage, opts: WorksheetRenderOpts): ReactNode {
  const key = worksheetComponentKey(page);
  switch (key) {
    case "cover":
      return <BookletCoverPage />;
    case "toc":
      return <BookletTocSheet onJump={opts.tocOnJump} hrefFor={opts.tocHrefFor} />;
    case "image":
      return (
        // <img> ולא next/image — עמוד החוברת מוקטן מדויק ל-A4 מלא, בלי אופטימיזציה
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={wsPageImage(opts.slot)}
          alt={`${page.title} — דף ${opts.slot}`}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      );
    case "intro-a":
      return <IntroUnderstandingSheet part={1} />;
    case "intro-b":
      return <IntroUnderstandingSheet part={2} />;
    case "what-we-teach":
      return <WhatWeTeachSheet />;
    case "why-models":
      return <WhyModelsSheet />;
    case "around-us":
      return <AnglesAroundUsSheet />;
    case "angles-types":
      return <AnglesTypesSheet />;
    case "measurement":
      return <MeasurementEstimationSheet />;
    case "draw-measure":
      return <DrawMeasureSheet />;
    case "applet":
      return <AppletBookletSheet />;
    case "applet-maker":
      return <AppletMakerBookletSheet />;
    case "protractor-poster":
      return <ProtractorPosterSheet />;
    case "clock-angles":
      return <ClockAnglesSheet />;
    case "right-angle-estimate":
      return <RightAngleEstimateSheet />;
    case "angle7-1":
      return <Angles7Sheet part={1} />;
    case "angle7-2":
      return <Angles7Sheet part={2} />;
    case "angle7-3":
      return <Angles7Sheet part={3} />;
    case "angle7-4":
      return <Angles7Sheet part={4} />;
    default:
      return assertNever(key);
  }
}
