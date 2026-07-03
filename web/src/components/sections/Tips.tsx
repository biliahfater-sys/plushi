import { motion } from "framer-motion";
import { Droplets, Sun, Brush, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/i18n/I18nProvider";

const TIPS: { icon: LucideIcon; title: string; text: string; tint: string }[] = [
  { icon: Droplets, title: "tips.washTitle", text: "tips.washText", tint: "bg-mint-soft text-mint-deep" },
  { icon: Sun, title: "tips.dryTitle", text: "tips.dryText", tint: "bg-peach text-peach-deep" },
  { icon: Brush, title: "tips.brushTitle", text: "tips.brushText", tint: "bg-pink-soft text-rose" },
  { icon: Package, title: "tips.storeTitle", text: "tips.storeText", tint: "bg-lavender-soft text-accent" },
];

export function Tips() {
  const { t } = useI18n();

  return (
    <section id="tips" className="relative scroll-mt-24 bg-gradient-to-b from-bg to-cream py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)]">
        <SectionHeading eyebrow={t("tips.eyebrow")} title={t("tips.title")} lead={t("tips.lead")} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map(({ icon: I, title, text, tint }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-3xl bg-surface p-7 shadow-soft-sm ring-1 ring-[rgba(122,112,138,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-lg"
            >
              <span className={`grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 ${tint}`}>
                <I size={26} strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{t(title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(text)}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
