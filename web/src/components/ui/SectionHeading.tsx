import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const lineUp: Variants = {
  hidden: { y: "120%" },
  show: { y: "0%", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-90px" }}
      className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <motion.span
        variants={fade}
        className="inline-flex items-center gap-2 rounded-pill bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep shadow-soft-xs"
      >
        {eyebrow}
      </motion.span>
      <h2 className="mt-4 font-display text-[clamp(1.9rem,3.8vw,2.7rem)] font-bold leading-[1.12] text-ink">
        <span className="block overflow-hidden pb-[0.1em]">
          <motion.span variants={lineUp} className="block">
            {title}
          </motion.span>
        </span>
      </h2>
      {lead && (
        <motion.p variants={fade} className="mt-4 text-lg leading-relaxed text-ink-soft">
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}
