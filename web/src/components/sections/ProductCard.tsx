import { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Heart, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/store/CartProvider";
import { PRODUCT_META, BADGE_LABELS } from "@/data/site";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

const BADGE_STYLE: Record<string, string> = {
  hit: "bg-rose text-white",
  new: "bg-accent text-white",
  soft: "bg-mint-deep text-ink",
};

export function ProductCard({
  product,
  isFav,
  onToggleFav,
}: {
  product: Product;
  isFav: boolean;
  onToggleFav: (id: string) => void;
}) {
  const { t, lang } = useI18n();
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const meta = PRODUCT_META[product.id] ?? {};

  // Subtle pointer-driven 3D tilt.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 16, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 160, damping: 16, mass: 0.4 });

  const onTilt = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 5);
    rx.set(-py * 5);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  const handleAdd = () => {
    add(product.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={onTilt}
      onPointerLeave={resetTilt}
      whileHover={{ y: -6 }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-soft-sm ring-1 ring-[rgba(122,112,138,0.06)] transition-shadow duration-500 hover:shadow-glow-lavender"
    >
      {meta.badge && (
        <span className={`absolute left-4 top-4 z-10 rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-soft-sm ${BADGE_STYLE[meta.badge]}`}>
          {BADGE_LABELS[lang][meta.badge]}
        </span>
      )}

      <button
        type="button"
        onClick={() => onToggleFav(product.id)}
        aria-label={t("catalog.fav")}
        aria-pressed={isFav}
        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-pill bg-white/80 text-ink-muted shadow-soft-sm backdrop-blur transition-all hover:scale-110 hover:text-rose"
      >
        <Heart size={18} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-rose" : ""} />
      </button>

      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-ink">{product.name}</h3>
          {meta.rating && (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink-soft">
              <Star size={14} className="text-pink-deep" fill="currentColor" />
              {meta.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{product.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            {meta.oldPrice && (
              <span className="text-sm text-ink-muted line-through">{formatPrice(meta.oldPrice)}</span>
            )}
            <span className="font-display text-xl font-bold text-accent-deep">{formatPrice(product.price)}</span>
          </div>
          <Button size="sm" variant={justAdded ? "soft" : "primary"} onClick={handleAdd} disabled={justAdded}>
            {justAdded ? (
              <>
                <Check size={16} /> {t("catalog.added")}
              </>
            ) : (
              t("catalog.add")
            )}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
