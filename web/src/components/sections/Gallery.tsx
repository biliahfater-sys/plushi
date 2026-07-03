import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/i18n/I18nProvider";
import { GALLERY_IMAGES } from "@/data/site";

export function Gallery() {
  const { t } = useI18n();

  return (
    <section id="gallery" className="relative scroll-mt-24">
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-bg py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[110vmin] w-[110vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,179,240,0.22),transparent_55%)] blur-2xl"
        />
        <div className="relative px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)]">
          <SectionHeading eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} lead={t("gallery.lead")} />
        </div>
      </div>

      <ZoomParallax images={GALLERY_IMAGES} />
    </section>
  );
}
