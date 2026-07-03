import { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/i18n/I18nProvider";
import { api } from "@/lib/api";

// Three.js shader is heavy — code-split it so it doesn't bloat the initial bundle.
const ShaderAnimation = lazy(() =>
  import("@/components/ui/shader-animation").then((m) => ({ default: m.ShaderAnimation })),
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Subscribe() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      setMsg(t("subscribe.needEmail"));
      return;
    }
    if (!consent) {
      setState("error");
      setMsg(t("subscribe.needConsent"));
      return;
    }
    setState("sending");
    setMsg("");
    try {
      await api.subscribe(email.trim(), consent);
      setState("ok");
      setMsg(t("subscribe.okMsg"));
      setEmail("");
      setConsent(false);
    } catch {
      setState("error");
      setMsg(t("subscribe.errMsg"));
    }
  };

  return (
    <section className="relative px-[var(--gutter)] py-20 [--gutter:clamp(16px,4vw,32px)] md:py-24">
      <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] shadow-glow-lavender ring-1 ring-white/50">
        {/* pastel shader backdrop — soft but visibly alive */}
        <div aria-hidden className="absolute inset-0">
          <Suspense fallback={<div className="h-full w-full bg-gradient-to-br from-pink-soft via-lavender-soft to-mint-soft" />}>
            <ShaderAnimation className="h-full w-full opacity-90" />
          </Suspense>
          <div className="absolute inset-0 bg-cream/35 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_85%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/70 via-cream/20 to-cream/40" />
        </div>

        <div className="relative px-6 py-14 text-center md:px-16">
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold text-ink">{t("subscribe.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{t("subscribe.lead")}</p>

          <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("subscribe.placeholder")}
                autoComplete="email"
                aria-label={t("cart.email")}
                className="flex-1 rounded-pill border-0 bg-white/85 px-5 py-3.5 text-ink shadow-soft-sm outline-none ring-1 ring-inset ring-[rgba(122,112,138,0.12)] backdrop-blur placeholder:text-ink-muted focus:ring-2 focus:ring-accent/60"
              />
              <Button type="submit" size="lg" disabled={state === "sending"}>
                {state === "sending" ? "…" : t("subscribe.submit")}
              </Button>
            </div>

            <label className="mt-4 flex items-start justify-center gap-2 text-left text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
              />
              <span>
                {t("subscribe.consent").split(t("subscribe.consentLink"))[0]}
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-accent-deep underline">
                  {t("subscribe.consentLink")}
                </a>
                {t("subscribe.consent").split(t("subscribe.consentLink"))[1]}
              </span>
            </label>

            {msg && (
              <p
                role="status"
                className={`mt-4 text-sm font-medium ${state === "ok" ? "text-mint-deep" : "text-rose"}`}
              >
                {msg}
              </p>
            )}
          </form>
        </div>
      </Reveal>
    </section>
  );
}
