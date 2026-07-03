import { useRef } from "react";
import { ArrowRight, Leaf, Gift, Scissors, Star, Camera, Heart, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import InkReveal from "@/components/ui/ink-reveal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Counter } from "@/components/ui/Counter";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useI18n } from "@/i18n/I18nProvider";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const lineUp: Variants = {
  hidden: { y: "118%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Decorative twinkling sparkles scattered across the hero.
const SPARKS = [
  { top: "12%", left: "8%", size: 14, delay: 0 },
  { top: "22%", left: "46%", size: 10, delay: 1.1 },
  { top: "68%", left: "14%", size: 12, delay: 2 },
  { top: "16%", left: "92%", size: 12, delay: 0.6 },
  { top: "78%", left: "60%", size: 9, delay: 1.6 },
  { top: "40%", left: "70%", size: 16, delay: 2.4 },
];

export function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { sx, sy } = usePointerParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const artScrollY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyScrollY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const atmoY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Pointer-parallax layer offsets (px).
  const photoX = useTransform(sx, (v) => v * -10);
  const photoY = useTransform(sy, (v) => v * -10);
  const ringX = useTransform(sx, (v) => v * 7);
  const ringY = useTransform(sy, (v) => v * 7);
  const cardAX = useTransform(sx, (v) => v * 30);
  const cardAY = useTransform(sy, (v) => v * 30);
  const cardBX = useTransform(sx, (v) => v * 22);
  const cardBY = useTransform(sy, (v) => v * 22);
  const orbX = useTransform(sx, (v) => v * 44);
  const orbY = useTransform(sy, (v) => v * 44);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pb-12 pt-[calc(var(--header-h)+40px)]">
      {/* soft pastel atmosphere */}
      <motion.div aria-hidden style={{ y: atmoY }} className="pointer-events-none absolute inset-0">
        <span className="absolute -left-24 top-6 h-80 w-80 rounded-full bg-pink/55 blur-3xl [animation:blobDrift_14s_ease-in-out_infinite]" />
        <span className="absolute right-[-7rem] top-20 h-96 w-96 rounded-full bg-lavender/55 blur-3xl [animation:blobDrift_18s_ease-in-out_infinite_reverse]" />
        <span className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-mint/45 blur-3xl [animation:blobDrift_16s_ease-in-out_infinite]" />
        {SPARKS.map((s, i) => (
          <Sparkles
            key={i}
            size={s.size}
            className="absolute text-accent/70"
            style={{ top: s.top, left: s.left, animation: `twinkle 3.2s ease-in-out ${s.delay}s infinite` }}
          />
        ))}
      </motion.div>

      <div className="relative mx-auto grid max-w-[var(--container)] items-center gap-12 px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <motion.div style={{ y: copyScrollY }} variants={container} initial="hidden" animate="show">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-pill bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep shadow-soft-xs backdrop-blur-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose" />
            </span>
            {t("hero.eyebrow")}
          </motion.span>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,5.6vw,4.25rem)] font-bold leading-[1.04] text-ink">
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span variants={lineUp} className="block">
                {t("hero.title1")}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span variants={lineUp} className="block">
                <span className="relative inline-block text-accent-deep">
                  {t("hero.titleEm")}
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-[-0.06em] bottom-[0.06em] -z-10 h-[0.36em] origin-left rounded-full bg-gradient-to-r from-pink-deep/70 to-lavender-deep/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>{" "}
                {t("hero.title2")}
              </motion.span>
            </span>
          </h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {t("hero.subtitle")}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#catalog">
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    {t("hero.ctaPrimary")}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {/* shimmer sweep */}
                  <span className="pointer-events-none absolute inset-0 -z-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.45)_50%,transparent_70%)] bg-[length:220%_100%] [animation:shimmer_3.4s_linear_infinite]" />
                </Button>
              </a>
            </Magnetic>
            <a href="#about">
              <Button size="lg" variant="ghost">
                {t("hero.ctaSecondary")}
              </Button>
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex items-start gap-3 rounded-2xl bg-white/60 p-4 shadow-soft-sm ring-1 ring-white/50 backdrop-blur-sm"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-pill bg-pink-soft text-rose">
              <Star size={20} fill="currentColor" />
            </span>
            <div>
              <p className="font-semibold text-ink">{t("hero.trustTitle")}</p>
              <p className="text-sm text-ink-muted">{t("hero.trustText")}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink-soft">
                <li className="inline-flex items-center gap-1.5"><Leaf size={14} className="text-mint-deep" />{t("hero.assureMaterials")}</li>
                <li className="inline-flex items-center gap-1.5"><Gift size={14} className="text-accent" />{t("hero.assurePackaging")}</li>
                <li className="inline-flex items-center gap-1.5"><Scissors size={14} className="text-rose" />{t("hero.assureNoFactory")}</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Art with parallax depth + ink-reveal */}
        <motion.div style={{ y: artScrollY }} className="relative mx-auto w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square"
          >
            {/* glow */}
            <div aria-hidden className="absolute inset-2 rounded-[2.4rem] bg-gradient-to-br from-pink/60 via-lavender/40 to-mint/50 blur-2xl" />

            {/* rotating dashed orbit ring */}
            <motion.div
              aria-hidden
              style={{ x: ringX, y: ringY }}
              className="absolute -inset-5"
            >
              <div className="h-full w-full rounded-full border border-dashed border-accent/25 [animation:spinSlow_40s_linear_infinite]" />
            </motion.div>

            {/* photo + ink mask */}
            <motion.div
              style={{ x: photoX, y: photoY }}
              className="group relative h-full w-full overflow-hidden rounded-[2.2rem] bg-cream shadow-glow-lavender ring-1 ring-white/60"
            >
              <img
                src="/assets/images/hero-bunny.jpg"
                alt="Кролик — символ мягкости мастерской «Плюши»"
                width={520}
                height={520}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <InkReveal maskColor={[255, 248, 243]} brushSize={120} />
              <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-pill bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-deep shadow-soft-sm backdrop-blur transition-opacity duration-500 group-hover:opacity-0">
                {t("hero.revealHint")}
              </span>
            </motion.div>

            {/* floating cards */}
            <motion.div
              style={{ x: cardAX, y: cardAY }}
              className="absolute -left-5 top-8 flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 shadow-soft-md backdrop-blur [animation:floatSlow_6s_ease-in-out_infinite]"
            >
              <Camera size={18} className="text-rose" />
              <p className="text-xs font-bold text-ink">{t("hero.statPhoto")}</p>
            </motion.div>
            <motion.div
              style={{ x: cardBX, y: cardBY }}
              className="absolute -right-4 bottom-14 flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 shadow-soft-md backdrop-blur [animation:floatSlow_7s_ease-in-out_infinite_reverse]"
            >
              <Gift size={18} className="text-accent" />
              <p className="text-xs font-bold text-ink">{t("hero.assurePackaging")}</p>
            </motion.div>

            {/* orbiting accent badges */}
            <motion.div style={{ x: orbX, y: orbY }} className="pointer-events-none absolute inset-0">
              <span className="absolute -right-2 top-2 grid h-9 w-9 place-items-center rounded-pill bg-white text-pink-deep shadow-soft-sm [animation:floatSlow_5s_ease-in-out_infinite]">
                <Heart size={16} fill="currentColor" />
              </span>
              <span className="absolute -bottom-2 left-6 grid h-8 w-8 place-items-center rounded-pill bg-white text-accent shadow-soft-sm [animation:floatSlow_8s_ease-in-out_infinite]">
                <Sparkles size={15} />
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-14 max-w-[var(--container)] px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)]"
      >
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-[rgba(122,112,138,0.08)] shadow-soft-sm md:grid-cols-4">
          <Stat big={<Counter to={5} />} small={t("hero.statYears")} />
          <Stat big={<Counter to={9} />} small={t("hero.statModels")} />
          <Stat big={t("hero.statPhoto")} small={t("hero.assurePackaging")} />
          <Stat big="100%" small={t("hero.statHandmade")} />
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ big, small }: { big: React.ReactNode; small: string }) {
  return (
    <div className="bg-cream/90 px-6 py-5 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white">
      <p className="font-display text-2xl font-bold text-accent-deep">{big}</p>
      <p className="mt-1 text-sm text-ink-muted">{small}</p>
    </div>
  );
}
