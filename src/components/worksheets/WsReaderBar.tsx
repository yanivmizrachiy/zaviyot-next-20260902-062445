"use client";

import Link from "next/link";
import { useEffect } from "react";

// סרגל עליון של עמוד בודד מתוך החוברת הדיגיטלית.
// הסרגל אינו מחליט בעצמו אם העמוד הוא דף עבודה: הסיווג מגיע אך ורק
// מ-registry.ts דרך worksheetNumber. כך עמודי שער/תוכן/פוסטר לעולם לא
// יקבלו בטעות כותרת "דף עבודה".
// autoPrint פותח את חלון ההדפסה מיד עם הטעינה (?print=1) — הורדה כ-PDF / הדפסה.
export function WsReaderBar({
  n,
  total,
  worksheetNumber,
  worksheetTotal,
  autoPrint = false,
}: {
  n: number;
  total: number;
  worksheetNumber?: number;
  worksheetTotal?: number;
  autoPrint?: boolean;
}) {
  useEffect(() => {
    if (!autoPrint) return;
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, [autoPrint]);

  const title = worksheetNumber && worksheetTotal
    ? `דף עבודה מספר ${worksheetNumber} מתוך ${worksheetTotal}`
    : `עמוד ${n} מתוך ${total}`;

  return (
    <div className="wsbar" data-noprint>
      <span className="wsbar__side">
        <Link className="btn btn--ghost btn--sm" href="/#worksheets">
          ‹ חזרה לאתר
        </Link>
        <span className="wsbar__nav">
          <Link
            className={`btn btn--ghost btn--sm${n <= 1 ? " btn--disabled" : ""}`}
            href={n > 1 ? `/worksheets/${n - 1}` : "#"}
            aria-disabled={n <= 1}
          >
            › הקודם
          </Link>
          <Link
            className={`btn btn--ghost btn--sm${n >= total ? " btn--disabled" : ""}`}
            href={n < total ? `/worksheets/${n + 1}` : "#"}
            aria-disabled={n >= total}
          >
            הבא ‹
          </Link>
        </span>
      </span>

      <span className="wsbar__title">{title}</span>

      <span className="wsbar__side wsbar__side--acts">
        <button type="button" className="btn btn--gold btn--sm" onClick={() => window.print()}>
          הורדה / הדפסה
        </button>
      </span>
    </div>
  );
}
