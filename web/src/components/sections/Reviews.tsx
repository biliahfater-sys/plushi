import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBasket } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/i18n/I18nProvider";
import { REVIEWS } from "@/data/site";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5500;

export function Reviews() {
  const { t, lang } = useI18n();
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    setIndex((i + REVIEWS.length) % REVIEWS.length);
  }, []);

  const stop = useCallback(() => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    timer.current = window.setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), AUTOPLAY_MS);
  }, [stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <section id="reviews" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)]">
        <SectionHeading eyebrow={t("reviews.eyebrow")} title={t("reviews.title")} lead={t("reviews.lead")} />

        <div
          className="relative mx-auto mt-12 max-w-3xl"
          onMouseEnter={stop}
          onMouseLeave={start}
        >
          <div className="overflow-hidden rounded-[2rem] bg-surface p-1 shadow-soft-md ring-1 ring-[rgba(122,112,138,0.06)]">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {REVIEWS.map((r, i) => (
                <article key={i} className="w-full shrink-0 p-8 md:p-12">
                  <div className="flex items-start gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-pill bg-gradient-to-br from-pink to-lavender font-display text-lg font-bold text-accent-deep">
                      {r.initials}
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold text-ink">{r.name[lang]}</p>
                      <div className="mt-1 flex gap-0.5 text-pink-deep">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} size={16} fill={s < r.stars ? "currentColor" : "none"} className={s < r.stars ? "" : "text-ink-muted/30"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-lg leading-relaxed text-ink-soft">“{r.text[lang]}”</p>
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-muted">
                    <span className="inline-flex items-center gap-1.5"><ShoppingBasket size={15} className="text-accent" />{r.product[lang]}</span>
                    <span className="inline-flex items-center gap-1.5"><Star size={15} className="text-pink-deep" />{r.detail[lang]}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={t("reviews.prev")}
            className="absolute -left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-pill bg-white text-ink shadow-soft-md transition-all hover:-translate-y-[55%] hover:text-accent-deep md:-left-6"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={t("reviews.next")}
            className="absolute -right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-pill bg-white text-ink shadow-soft-md transition-all hover:-translate-y-[55%] hover:text-accent-deep md:-right-6"
          >
            <ChevronRight size={20} />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}`}
                onClick={() => go(i)}
                className={cn(
                  "h-2.5 rounded-pill transition-all duration-300",
                  i === index ? "w-7 bg-accent" : "w-2.5 bg-lavender-deep/50 hover:bg-lavender-deep",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
