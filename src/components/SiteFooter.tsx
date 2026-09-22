import Image from "next/image";
import { SITE } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">
          <Image
            className="footer__logo"
            src={SITE.logo.src}
            alt={SITE.logo.alt}
            width={52}
            height={52}
            sizes="52px"
          />
          <span>חוברת הוראת הזוויות לכיתה ז׳</span>
        </span>
        <span>{SITE.managerCredit}</span>
      </div>
    </footer>
  );
}
