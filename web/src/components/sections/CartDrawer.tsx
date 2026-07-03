import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/store/CartProvider";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { t } = useI18n();
  const { items, catalog, isOpen, close, total, changeQty, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const lines = items
    .map((i) => ({ item: i, product: catalog.get(i.id) }))
    .filter((l): l is { item: typeof l.item; product: NonNullable<typeof l.product> } => Boolean(l.product));

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setState("error");
      setMsg(t("cart.needConsent"));
      return;
    }
    setState("sending");
    setMsg(t("cart.sending"));
    try {
      const res = await api.checkout({
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          note: form.note.trim() || undefined,
        },
        items,
        consent: true,
      });
      setState("ok");
      setMsg(res.message);
      setForm({ name: "", email: "", phone: "", note: "" });
      setConsent(false);
      clear();
      window.setTimeout(close, 1800);
    } catch (err) {
      setState("error");
      if (err instanceof ApiError && err.details && typeof err.details === "object") {
        setMsg(Object.values(err.details as Record<string, string>).join(" • "));
      } else {
        setMsg(err instanceof Error ? err.message : t("subscribe.errMsg"));
      }
    }
  };

  const inputCls =
    "w-full rounded-xl border-0 bg-cream px-4 py-3 text-sm text-ink outline-none ring-1 ring-inset ring-[rgba(122,112,138,0.14)] placeholder:text-ink-muted focus:ring-2 focus:ring-accent/60";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="fixed inset-0 z-[200]"
          aria-label={t("cart.title")}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            onClick={close}
          />
          <motion.div
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-glow-lavender"
            variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-[rgba(122,112,138,0.1)] px-6 py-5">
              <h3 className="font-display text-xl font-bold text-ink">{t("cart.title")}</h3>
              <button
                type="button"
                onClick={close}
                aria-label={t("cart.close")}
                className="grid h-10 w-10 place-items-center rounded-pill bg-cream text-ink-soft transition-colors hover:text-rose"
              >
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-ink-muted">
                  <Icon id="i-bunny" size={64} className="text-lavender-deep" />
                  <p className="max-w-[12rem]">{t("cart.empty")}</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {lines.map(({ item, product }) => (
                    <li key={product.id} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                      <img src={product.image} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-ink">{product.name}</p>
                        <p className="text-sm text-ink-muted">{formatPrice(product.price)} × {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => changeQty(product.id, -1)} aria-label={t("cart.less")} className="grid h-7 w-7 place-items-center rounded-pill bg-white text-ink-soft hover:text-accent-deep">
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                        <button type="button" onClick={() => changeQty(product.id, 1)} aria-label={t("cart.more")} className="grid h-7 w-7 place-items-center rounded-pill bg-white text-ink-soft hover:text-accent-deep">
                          <Plus size={14} />
                        </button>
                        <button type="button" onClick={() => remove(product.id)} aria-label={t("cart.remove")} className="ml-1 grid h-7 w-7 place-items-center rounded-pill text-ink-muted hover:text-rose">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-[rgba(122,112,138,0.1)] px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-ink-soft">{t("cart.total")}</span>
                  <strong className="font-display text-xl text-accent-deep">{formatPrice(total)}</strong>
                </div>
                <form onSubmit={onCheckout} className="space-y-2.5">
                  <input className={inputCls} placeholder={t("cart.name")} required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className={inputCls} type="email" placeholder={t("cart.email")} required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input className={inputCls} type="tel" placeholder={t("cart.phone")} autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <textarea className={`${inputCls} resize-none`} rows={2} placeholder={t("cart.note")} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />

                  <label className="flex items-start gap-2 py-1 text-xs text-ink-muted">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-accent" />
                    <span>{t("cart.consent")}</span>
                  </label>

                  <Button type="submit" full size="md" disabled={state === "sending"}>
                    {t("cart.order")}
                  </Button>
                  {msg && (
                    <p role="status" className={`text-sm font-medium ${state === "ok" ? "text-mint-deep" : state === "error" ? "text-rose" : "text-ink-muted"}`}>
                      {msg}
                    </p>
                  )}
                </form>
              </footer>
            )}
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
