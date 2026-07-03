import { useEffect, useState } from "react";

/** Thin gradient reading-progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[9998] h-[3px] origin-left"
      style={{
        transform: `scaleX(${progress})`,
        background:
          "linear-gradient(90deg, var(--color-pink-deep), var(--color-accent), var(--color-mint-deep))",
        transition: "transform 120ms linear",
      }}
    />
  );
}
