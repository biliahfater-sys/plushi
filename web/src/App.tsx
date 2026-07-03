import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollProgress } from "@/components/system/ScrollProgress";
import { IconSprite } from "@/components/system/IconSprite";
import { BackToTop } from "@/components/system/BackToTop";
import { CookieBanner } from "@/components/system/CookieBanner";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Catalog } from "@/components/sections/Catalog";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { Tips } from "@/components/sections/Tips";
import { About } from "@/components/sections/About";
import { Subscribe } from "@/components/sections/Subscribe";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/sections/CartDrawer";

export default function App() {
  useSmoothScroll();

  return (
    <>
      <IconSprite />
      <GlassFilter />
      <div className="grain" aria-hidden />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Catalog />
        <Gallery />
        <Reviews />
        <Tips />
        <About />
        <Subscribe />
      </main>
      <Footer />
      <CartDrawer />
      <BackToTop />
      <CookieBanner />
    </>
  );
}
