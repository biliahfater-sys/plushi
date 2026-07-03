import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/store/CartProvider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#top", key: "nav.home" },
  { href: "#catalog", key: "nav.catalog" },
  { href: "#gallery", key: "nav.gallery" },
  { href: "#reviews", key: "nav.reviews" },
  { href: "#about", key: "nav.about" },
  { href: "#contacts", key: "nav.contacts" },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="top"
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
        scrolled
          ? "bg-cream/80 shadow-[0_8px_30px_rgba(180,140,224,0.12)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[var(--container)] items-center justify-between px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)]">
        <a href="#top" className="flex items-center gap-2" aria-label="Плюши">
          <span className="grid h-9 w-9 place-items-center rounded-pill bg-gradient-to-br from-pink to-lavender text-accent-deep shadow-soft-sm">
            <Icon id="i-flower" size={20} />
          </span>
          <span className="font-display text-xl font-bold text-ink">Плюши</span>
        </a>

        <nav
          className={cn(
            "absolute inset-x-3 top-[calc(var(--header-h)-6px)] flex-col gap-1 rounded-xl bg-cream/95 p-3 shadow-soft-lg backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:gap-1 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none",
            menuOpen ? "flex" : "hidden md:flex",
          )}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-pill px-4 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:bg-white/70 hover:text-accent-deep"
            >
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-pill bg-white/70 p-0.5 ring-1 ring-inset ring-[rgba(122,112,138,0.12)] backdrop-blur-sm">
            {(["ru", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={cn(
                  "rounded-pill px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  lang === l ? "bg-accent text-white shadow-soft-sm" : "text-ink-muted hover:text-ink",
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={open}
            aria-label={t("nav.cart")}
            className="relative grid h-11 w-11 place-items-center rounded-pill bg-white/70 text-ink ring-1 ring-inset ring-[rgba(122,112,138,0.12)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:text-accent-deep hover:shadow-soft-md"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-pill bg-rose px-1 text-[11px] font-bold text-white shadow-soft-sm">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={t("nav.openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-pill bg-white/70 text-ink ring-1 ring-inset ring-[rgba(122,112,138,0.12)] backdrop-blur-sm md:hidden"
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-5 rounded bg-ink" />
              <span className="block h-0.5 w-5 rounded bg-ink" />
              <span className="block h-0.5 w-5 rounded bg-ink" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
