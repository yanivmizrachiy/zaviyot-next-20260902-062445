import { TopBar } from "@/components/TopBar";
import { SiteNav } from "@/components/SiteNav";
import { HeroSection } from "@/components/HeroSection";
import { JerusalemPanoramaSection } from "@/components/JerusalemPanoramaSection";
import { WorksheetsBookletBook } from "@/components/WorksheetsBookletBook";
import { PresentationViewer } from "@/components/PresentationViewer";
import { FinaleSection } from "@/components/FinaleSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <>
      <div className="home-chrome">
        <TopBar />
        <SiteNav />
      </div>
      <main id="main">
        <WorksheetsBookletBook />
        <HeroSection />
        <JerusalemPanoramaSection />
        <PresentationViewer />
        <FinaleSection />
      </main>
      <SiteFooter />
    </>
  );
}
