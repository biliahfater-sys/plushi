import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Leaf, Camera, Gift } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/store/CartProvider";
import { useFavorites } from "@/hooks/useFavorites";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

type Filter = "all" | Category;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "catalog.all" },
  { key: "rabbits", label: "catalog.rabbits" },
  { key: "bears", label: "catalog.bears" },
  { key: "cats", label: "catalog.cats" },
];

export function Catalog() {
  const { t } = useI18n();
  const { setCatalog } = useCart();
  const { favorites, toggle } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let alive = true;
    api
      .getProducts()
      .then(({ items }) => {
        if (!alive) return;
        setProducts(items);
        setCatalog(items);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [setCatalog]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length, rabbits: 0, bears: 0, cats: 0 };
    for (const p of products) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [products]);

  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="catalog" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] [--gutter:clamp(16px,4vw,32px)]">
        <SectionHeading eyebrow={t("catalog.eyebrow")} title={t("catalog.title")} lead={t("catalog.lead")} />

        <Reveal delay={0.05} className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-ink-soft">
          <span className="inline-flex items-center gap-2 rounded-pill bg-mint-soft px-4 py-2"><Leaf size={16} className="text-mint-deep" />{t("hero.assureMaterials")}</span>
          <span className="inline-flex items-center gap-2 rounded-pill bg-pink-soft px-4 py-2"><Camera size={16} className="text-rose" />{t("hero.statPhoto")}</span>
          <span className="inline-flex items-center gap-2 rounded-pill bg-lavender-soft px-4 py-2"><Gift size={16} className="text-accent" />{t("hero.assurePackaging")}</span>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-2" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                filter === f.key
                  ? "bg-accent text-white shadow-soft-md"
                  : "bg-white/70 text-ink-soft ring-1 ring-inset ring-[rgba(122,112,138,0.12)] hover:-translate-y-0.5 hover:text-accent-deep",
              )}
            >
              {t(f.label)}
              <span className={cn("rounded-pill px-2 py-0.5 text-xs", filter === f.key ? "bg-white/25" : "bg-pink-soft text-accent-deep")}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </Reveal>

        <div className="mt-12 min-h-[300px]">
          {status === "loading" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-white/60" />
              ))}
            </div>
          )}

          {status === "error" && (
            <p className="rounded-3xl bg-pink-soft p-10 text-center text-ink-soft">{t("catalog.error")}</p>
          )}

          {status === "ready" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} isFav={favorites.has(p.id)} onToggleFav={toggle} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {status === "ready" && visible.length === 0 && (
            <p className="py-16 text-center text-ink-muted">{t("catalog.empty")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
