import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

export interface PointerParallax {
  /** Spring-smoothed normalized pointer, -1..1 on each axis. */
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}

/**
 * Tracks the pointer position over the whole window as a spring-smoothed
 * normalized value (-1..1 on each axis). Derive layer offsets at the call site
 * with `useTransform(sx, v => v * depth)`. No-ops on touch / reduced-motion.
 */
export function usePointerParallax(stiffness = 90): PointerParallax {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness, damping: 18, mass: 0.5 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return { sx, sy };
}
