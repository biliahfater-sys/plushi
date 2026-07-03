import { Reveal } from "@/components/ui/Reveal";
import { GlassEffect } from "@/components/ui/liquid-glass";
import { Icon } from "@/components/ui/Icon";
import { Counter } from "@/components/ui/Counter";
import { Heart, Sparkles, Star } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid max-w-[var(--container)] items-center gap-14 px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)] lg:grid-cols-2">
        {/* media */}
        <Reveal y={32} className="relative mx-auto w-full max-w-md">
          <div className="absolute -left-5 -top-5 z-10 grid h-14 w-14 place-items-center rounded-2xl bg-white text-pink-deep shadow-soft-md [animation:floatSlow_6s_ease-in-out_infinite]">
            <Star size={26} />
          </div>
          <div className="absolute -right-4 top-1/3 z-10 grid h-12 w-12 place-items-center rounded-2xl bg-white text-rose shadow-soft-md [animation:floatSlow_7s_ease-in-out_infinite_reverse]">
            <Heart size={22} fill="currentColor" />
          </div>
          <div className="absolute -bottom-4 left-10 z-10 grid h-11 w-11 place-items-center rounded-2xl bg-white text-accent shadow-soft-md [animation:floatSlow_8s_ease-in-out_infinite]">
            <Sparkles size={20} />
          </div>

          <div className="relative overflow-hidden rounded-[2rem] shadow-glow-pink ring-1 ring-white/60">
            <img
              src="/assets/images/about-workshop.jpg"
              alt={t("about.title")}
              width={520}
              height={520}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            {/* liquid-glass badge reused on-brand */}
            <GlassEffect className="absolute bottom-4 left-4 rounded-pill px-5 py-3 text-ink">
              <span className="flex items-center gap-2 font-display text-sm font-bold">
                <Icon id="i-flower" size={18} className="text-accent-deep" />
                100% {t("about.handmade")}
              </span>
            </GlassEffect>
          </div>
        </Reveal>

        {/* content */}
        <Reveal y={32} delay={0.1}>
          <span className="inline-flex items-center gap-2 rounded-pill bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep shadow-soft-xs">
            {t("about.eyebrow")}
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold leading-tight text-ink">
            {t("about.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t("about.p1")}</p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t("about.p2")}</p>

          <ul className="mt-8 grid grid-cols-3 gap-4">
            {[
              { big: <Counter to={5} />, small: t("about.years") },
              { big: <Counter to={9} />, small: t("about.families") },
              { big: "100%", small: t("about.handmade") },
            ].map((f, i) => (
              <li
                key={i}
                className="rounded-2xl bg-surface p-4 text-center shadow-soft-xs ring-1 ring-[rgba(122,112,138,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md"
              >
                <p className="font-display text-2xl font-bold text-accent-deep">{f.big}</p>
                <p className="mt-1 text-xs text-ink-muted">{f.small}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
