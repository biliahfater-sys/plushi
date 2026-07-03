import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";

const SOCIALS = ["TG", "IG", "VK", "PT"];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer id="contacts" className="relative scroll-mt-24 overflow-hidden bg-ink text-cream/90">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-[var(--container)] gap-10 px-[var(--gutter)] py-16 [--gutter:clamp(16px,4vw,32px)] md:grid-cols-3">
        <div>
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-pill bg-cream/15 text-pink">
              <Icon id="i-flower" size={20} />
            </span>
            <span className="font-display text-xl font-bold text-cream">Плюши</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">{t("footer.about")}</p>
        </div>

        <div>
          <h4 className="font-display text-base font-bold text-cream">{t("footer.contacts")}</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li><a className="transition-colors hover:text-pink" href="mailto:hello@plushi.ru">hello@plushi.ru</a></li>
            <li><a className="transition-colors hover:text-pink" href="tel:+74950000000">+7 (495) 000-00-00</a></li>
            <li>{t("footer.schedule")}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-bold text-cream">{t("footer.socials")}</h4>
          <ul className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <li key={s}>
                <a
                  href="#"
                  aria-label={s}
                  className="grid h-11 w-11 place-items-center rounded-pill bg-cream/10 text-sm font-bold text-cream/80 transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto max-w-[var(--container)] border-t border-cream/10 px-[var(--gutter)] py-6 text-xs leading-relaxed text-cream/50 [--gutter:clamp(16px,4vw,32px)]">
        <p className="max-w-3xl">{t("footer.legal")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>{t("footer.rights")}</span>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-pink">
            {t("footer.privacyLink")}
          </a>
        </div>
      </div>
    </footer>
  );
}
