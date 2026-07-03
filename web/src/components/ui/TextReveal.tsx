import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const line: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Cinematic line-by-line headline reveal. Each line wipes up from inside an
 * overflow-hidden mask. Pass each line as a child.
 */
export function TextReveal({
  lines,
  className,
  as: Tag = "h1",
  animate = true,
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2";
  animate?: boolean;
}) {
  const MotionTag = Tag === "h1" ? motion.h1 : motion.h2;
  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      {...(animate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-80px" } })}
    >
      {lines.map((node, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <motion.span variants={line} className="block">
            {node}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
