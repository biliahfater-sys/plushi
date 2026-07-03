import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

const KEY = "plushi.cookie.v1";

export function CookieBanner() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      const id = window.setTimeout(() => setShow(true), 1200);
      return () => window.clearTimeout(id);
    }
  }, []);

  const dismiss = (choice: "all" | "necessary") => {
    localStorage.setItem(KEY, choice);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[180] mx-auto max-w-3xl rounded-2xl bg-surface/95 p-5 shadow-soft-lg ring-1 ring-[rgba(122,112,138,0.1)] backdrop-blur-xl md:inset-x-auto md:left-1/2 md:w-full md:-translate-x-1/2"
        >
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <p className="flex-1 text-sm leading-relaxed text-ink-soft">
              {t("cookie.text").split(t("subscribe.consentLink"))[0]}
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-accent-deep underline">
                {t("subscribe.consentLink")}
              </a>
              {t("cookie.text").split(t("subscribe.consentLink"))[1]}
            </p>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" onClick={() => dismiss("all")}>{t("cookie.acceptAll")}</Button>
              <Button size="sm" variant="ghost" onClick={() => dismiss("necessary")}>{t("cookie.necessary")}</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
