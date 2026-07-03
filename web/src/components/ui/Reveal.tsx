import { motion, type HTMLMotionProps } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

/** Fade + rise on scroll into view. Respects reduced-motion via framer-motion. */
export function Reveal({ children, delay = 0, y = 28, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
