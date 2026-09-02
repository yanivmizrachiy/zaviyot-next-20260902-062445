import type { ComponentType } from "react";
import { AidSheet } from "./AidSheet";
import { AID_ITEMS, type AidItemMeta } from "@/lib/aidTopics";
import {
  AidCircles1,
  AidCircles2,
  AidRightAngle,
  AidProtractors,
  AidAngleCircles,
  AidObtuseTriangles,
  AidRays,
  AidQuadrantBlank,
  AidQuadrantNumbers,
} from "./sheets";
import {
  ResProtractorTilted,
  ResProtractorClassic,
  ResHowToUse,
  ResPoster,
  ResGeometryAngles,
  ResMeasureGivenA,
  ResMeasureGivenB,
  ResWhatSizeAngles,
  ResReadingAnglesA,
  ResReadingAnglesB,
} from "./resource-sheets";
import { AidEquilateralTriangles, AidSixtyDegreeAngles } from "./equilateral-triangle-aid";

// רישום דפי ההמחשה — הנתונים (כותרות, נושאים, סדר, מקור) חיים במקור-האמת
// הטהור src/lib/aidTopics.ts; כאן רק מוצמד לכל id רכיב-האיור שלו. n של הנתיב
// ‎/hamchashot/[n]‎ = מיקום הפריט במערך (1-based) — קבוע, קישורים לא נשברים.
const FIGS: Record<string, ComponentType> = {
  "circles-1": AidCircles1,
  "circles-2": AidCircles2,
  "right-angle": AidRightAngle,
  "protractor-sheet": AidProtractors,
  "angle-circle": AidAngleCircles,
  "obtuse-triangles": AidObtuseTriangles,
  rays: AidRays,
  "quadrant-blank": AidQuadrantBlank,
  "quadrant-numbers": AidQuadrantNumbers,
  "protractor-a": ResProtractorTilted,
  "protractor-b": ResProtractorClassic,
  "how-to-use": ResHowToUse,
  "poster-measure": ResPoster,
  "measure-worksheet": ResGeometryAngles,
  "measure-given-a": ResMeasureGivenA,
  "measure-given-b": ResMeasureGivenB,
  "what-size": ResWhatSizeAngles,
  "reading-a": ResReadingAnglesA,
  "reading-b": ResReadingAnglesB,
  "equilateral-triangle-film-aid": AidEquilateralTriangles,
};

export type AidDocEntry = AidItemMeta & { n: number; Fig: ComponentType };

export const AID_DOCS: AidDocEntry[] = AID_ITEMS.map((item, i) => {
  const Fig = FIGS[item.id];
  if (!Fig) throw new Error(`aid item "${item.id}" has no Fig component`);
  return { ...item, n: i + 1, Fig };
});

/** מספר עמודי ה-A4 האמיתיים של פריט המחשה — משמש תצוגה מקדימה והדפסה. */
export function aidDocPageCount(n: number) {
  return AID_DOCS[n - 1]?.id === "equilateral-triangle-film-aid" ? 2 : 1;
}

/**
 * תצוגה מקדימה של פריט — עמוד A4 ראשון בלבד.
 * כך כרטיסי הקטלוג נשארים בגודל קבוע גם אם פריט כולל יותר מעמוד אחד.
 */
export function AidDoc({ n }: { n: number }) {
  const doc = AID_DOCS[n - 1];
  const Fig = doc.Fig;
  return (
    <AidSheet n={n} title={doc.title}>
      <Fig />
    </AidSheet>
  );
}

/** תצוגה/הדפסה מלאה של כל עמודי הפריט, ברצף אחד. */
export function AidDocPages({ n }: { n: number }) {
  const doc = AID_DOCS[n - 1];
  if (aidDocPageCount(n) === 1) return <AidDoc n={n} />;

  return (
    <>
      <AidSheet n={n} title={doc.title}>
        <AidEquilateralTriangles />
      </AidSheet>
      <AidSheet n={n} title={doc.title}>
        <AidSixtyDegreeAngles />
      </AidSheet>
    </>
  );
}
