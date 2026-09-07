import { TopBar } from "@/components/TopBar";
import { SiteNav } from "@/components/SiteNav";
import { JerusalemPanoramaSection } from "@/components/JerusalemPanoramaSection";
import { WorksheetsBookletBook } from "@/components/WorksheetsBookletBook";
import { FinaleSection } from "@/components/FinaleSection";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "./HomeChrome.module.css";
import navStyles from "./HomeNavDistribution.module.css";

export default function HomePage() {
  return (
    <>
      <div className={`${styles.chrome} ${navStyles.spread} home-chrome`}>
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
