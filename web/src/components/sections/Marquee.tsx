import { Scissors, Leaf, Camera, Gift, Heart, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const ITEMS: { icon: LucideIcon; key: string }[] = [
  { icon: Scissors, key: "marquee.handmade" },
  { icon: Leaf, key: "marquee.hypoallergenic" },
  { icon: Camera, key: "marquee.delivery" },
  { icon: Gift, key: "marquee.packaging" },
  { icon: Heart, key: "marquee.eco" },
  { icon: Sparkles, key: "marquee.experience" },
];

export function Marquee() {
  const { t } = useI18n();
  const sequence = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative overflow-hidden border-y border-[rgba(122,112,138,0.1)] bg-gradient-to-r from-pink-soft via-lavender-soft to-mint-soft py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="flex w-max [animation:var(--animate-marquee)] hover:[animation-play-state:paused]">
        {sequence.map(({ icon: I, key }, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap px-7">
            <I size={20} className="text-accent-deep" />
            <span className="font-display text-base font-semibold text-ink">{t(key)}</span>
            <Sparkles size={14} className="ml-4 text-pink-deep" />
          </div>
        ))}
      </div>
    </div>
  );
}
