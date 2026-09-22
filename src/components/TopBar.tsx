import Image from "next/image";
import { SITE } from "@/config/site";

// כותרת עליונה — מבנה זהה לחלוטין ל«מספרים מכוונים»: הלוגו בעמודת ההתחלה
// בגודל קבוע וחד (--logo-s), והטקסט ממורכז בדף; עמודות הצד ברשת שומרות
// מינימום ברוחב הלוגו — חפיפה עם הטקסט בלתי אפשרית. אחידות מלאה בין האתרים.
export function TopBar() {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <span className="topbar__logobox">
          <Image
            className="topbar__logo"
            src={SITE.logo.src}
            alt={SITE.logo.alt}
            width={220}
            height={220}
            sizes="(max-width: 760px) 100px, 124px"
            quality={90}
            priority
          />
        </span>
        <div className="topbar__text">
          <span className="topbar__lead">
            {SITE.headerLead}
          </span>
          <span className="topbar__year">{SITE.academicYear}</span>
          <span className="topbar__credit">{SITE.managerCredit}</span>
        </div>
      </div>
    </header>
  );
}
