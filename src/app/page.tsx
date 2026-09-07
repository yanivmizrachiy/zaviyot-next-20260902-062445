import { TopBar } from "@/components/TopBar";
import { SiteNav } from "@/components/SiteNav";
import { JerusalemPanoramaSection } from "@/components/JerusalemPanoramaSection";
import { WorksheetsBookletBook } from "@/components/WorksheetsBookletBook";
import { FinaleSection } from "@/components/FinaleSection";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "./HomeChrome.module.css";

export default function HomePage() {
  return (
    <>
      <div className={`${styles.chrome} home-chrome`}>
        <TopBar />
        <SiteNav />
      </div>
      <main id="main">
        <WorksheetsBookletBook />
        <JerusalemPanoramaSection />
        <FinaleSection />
      </main>
      <SiteFooter />
    </>
  );
}
