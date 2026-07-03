import type { CSSProperties } from "react";

/** References a symbol from <IconSprite/> by id, e.g. <Icon id="i-heart" />. */
export function Icon({
  id,
  size = 24,
  className,
  style,
}: {
  id: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg width={size} height={size} className={className} style={style} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}
