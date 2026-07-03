import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";

export function BackToTop() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label={t("nav.toTop")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="fixed bottom-6 right-6 z-[150] grid h-12 w-12 place-items-center rounded-pill bg-accent text-white shadow-soft-lg transition-colors hover:bg-accent-deep"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
