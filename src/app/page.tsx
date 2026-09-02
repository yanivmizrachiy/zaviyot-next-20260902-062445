import { TopBar } from "@/components/TopBar";
import { SiteNav } from "@/components/SiteNav";
import { HeroSection } from "@/components/HeroSection";
import { JerusalemPanoramaSection } from "@/components/JerusalemPanoramaSection";
import { VideoSection } from "@/components/VideoSection";
import { WorksheetsBookletBook } from "@/components/WorksheetsBookletBook";
import { PresentationViewer } from "@/components/PresentationViewer";
import { FinaleSection } from "@/components/FinaleSection";
import { SiteFooter } from "@/components/SiteFooter";

// HOME V2: הספר הוא המוצר הראשי. כל התוכן הקיים נשמר, אך משני לספר.
export default function HomePage() {
  return (
    <>
      <TopBar />
      <SiteNav />
      <main id="main">
        <WorksheetsBookletBook />
        <HeroSection />
        <JerusalemPanoramaSection />
        <VideoSection />
        <PresentationViewer />
        <FinaleSection />
      </main>
      <SiteFooter />
    </>
  );
}
