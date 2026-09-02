import { HeroAngleVideo } from "./HeroAngleVideo";

// אין טקסט דמו/מציין־מקום. נשמר רק נכס המדיה האמיתי הקיים.
export function HeroSection() {
  return (
    <section className="section hero-media-only">
      <div className="container">
        <HeroAngleVideo />
      </div>
    </section>
  );
}
