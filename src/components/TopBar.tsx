import Image from "next/image";

export function TopBar() {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <span className="topbar__logobox">
          <Image
            className="topbar__logo"
            src="/logo.png"
            alt="יחידת מתמטיקה — מחוז ירושלים והעיר ירושלים"
            width={220}
            height={220}
            sizes="(max-width: 760px) 42px, 52px"
            quality={90}
            priority
          />
        </span>
        <div className="topbar__text">
          <span className="topbar__lead">הוראת זוויות בכיתה ז׳</span>
          <span className="topbar__subtitle">הדרכה במחוז ירושלים והעיר ירושלים · בהובלת איילת קריספין</span>
          <span className="topbar__meta">שנה״ל התשפ״ז · האתר מנוהל ע״י יניב רז, מדריך מחוזי חט״ב בעיר ירושלים</span>
        </div>
      </div>
    </header>
  );
}
