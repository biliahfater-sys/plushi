/**
 * Single hidden SVG sprite with reusable icons and the brand plush
 * illustrations. Rendered once near the root; referenced via <Icon id=… />.
 */
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path d="M12 21s-7-4.35-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5 4 3.5 7-2.5 4.65-9.5 9-9.5 9z" fill="currentColor" />
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2l2.6 7.3 7.4.6-5.6 4.9 1.7 7.2L12 18l-6.1 4 1.7-7.2L2 9.9l7.4-.6L12 2z" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
        </symbol>
        <symbol id="i-sparkle" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2c.5 4.5 3.5 7.5 8 8-4.5.5-7.5 3.5-8 8-.5-4.5-3.5-7.5-8-8 4.5-.5 7.5-3.5 8-8z" />
        </symbol>
        <symbol id="i-cloud" viewBox="0 0 100 70">
          <path fill="currentColor" d="M30 60 Q5 60 5 40 Q5 22 25 22 Q28 8 45 8 Q62 8 65 22 Q90 22 90 42 Q90 60 70 60 Z" opacity="0.6" />
        </symbol>
        <symbol id="i-flower" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2c-1.5 0-2.8 1-3.2 2.5C7.5 4 6 5 5.5 6.5c-.7 2 .3 4.2 2.2 5-.3 1-.2 2.1.3 3 1 1.8 3.2 2.5 5 1.7.9 1 2.3 1.5 3.7 1.2 2-.4 3.3-2.2 3.3-4.2 0-.4 0-.8-.1-1.2 1.5-1 2.2-2.9 1.6-4.7-.5-1.5-2-2.5-3.6-2.5-.1 0-.2 0-.3 0C14.8 3 13.5 2 12 2zm0 3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.6" />
        </symbol>
        <symbol id="i-thread" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c4-4 8-12 18-12" />
          <circle cx="7.5" cy="9.5" r="2.5" />
          <path d="M8 16c1.5-2.5 4-6 8-7" />
        </symbol>
        <symbol id="i-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.5C13.5 3 20 4 20 4s1 6.5-2.8 10.2A7 7 0 0 1 11 20z" />
          <path d="M12 20v-7" />
          <path d="M12 13l-3-3" />
        </symbol>
        <symbol id="i-box" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </symbol>
        <symbol id="i-envelope" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </symbol>
        <symbol id="i-recycle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 19H4.8a2 2 0 0 1-1.7-3L6 10" />
          <path d="M13.8 19h2.4a2 2 0 0 0 1.7-3L16 15" />
          <path d="M10.2 5h3.6a2 2 0 0 1 1.7 3L12 12l-3.5-4a2 2 0 0 1 1.7-3z" />
        </symbol>
        <symbol id="i-bubbles" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="8" cy="10" r="2" />
          <circle cx="16" cy="15" r="1.5" />
          <circle cx="14" cy="8" r="1" />
        </symbol>
        <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </symbol>
        <symbol id="i-brush" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 19.5V18a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1.5" />
          <path d="M12 16V7" /><path d="M8 8h8" /><path d="M9 11h6" /><path d="M9.5 14h5" />
        </symbol>
        <symbol id="i-basket" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 21h14l1-9H4l1 9z" />
          <path d="M8 12V7a4 4 0 0 1 8 0v5" />
        </symbol>
        <symbol id="i-bunny" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="18" rx="6" ry="5" />
          <ellipse cx="9" cy="8" rx="1.5" ry="4" /><ellipse cx="15" cy="8" rx="1.5" ry="4" />
          <circle cx="10" cy="16" r="1" fill="currentColor" /><circle cx="14" cy="16" r="1" fill="currentColor" />
          <path d="M11 18.5l1 1 1-1" />
        </symbol>
        <symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </symbol>
        <symbol id="i-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </symbol>

        <symbol id="hero-bunny" viewBox="0 0 320 320">
          <ellipse cx="160" cy="290" rx="100" ry="14" fill="#4a3f55" opacity="0.1" />
          <ellipse cx="108" cy="62" rx="22" ry="56" fill="#f7b8cc" transform="rotate(-12 108 62)" />
          <ellipse cx="212" cy="62" rx="22" ry="56" fill="#f7b8cc" transform="rotate(12 212 62)" />
          <ellipse cx="108" cy="72" rx="11" ry="36" fill="#ffe8ee" transform="rotate(-12 108 72)" />
          <ellipse cx="212" cy="72" rx="11" ry="36" fill="#ffe8ee" transform="rotate(12 212 72)" />
          <ellipse cx="160" cy="208" rx="86" ry="80" fill="#ffd9e4" />
          <ellipse cx="100" cy="270" rx="22" ry="14" fill="#ffd9e4" /><ellipse cx="220" cy="270" rx="22" ry="14" fill="#ffd9e4" />
          <ellipse cx="100" cy="270" rx="10" ry="6" fill="#ffe8ee" /><ellipse cx="220" cy="270" rx="10" ry="6" fill="#ffe8ee" />
          <ellipse cx="160" cy="220" rx="48" ry="36" fill="#fff5f8" />
          <circle cx="108" cy="218" r="13" fill="#ffb8cc" opacity="0.55" /><circle cx="212" cy="218" r="13" fill="#ffb8cc" opacity="0.55" />
          <ellipse cx="132" cy="194" rx="9" ry="11" fill="#4a3f55" /><ellipse cx="188" cy="194" rx="9" ry="11" fill="#4a3f55" />
          <ellipse cx="135" cy="190" rx="3" ry="3.5" fill="#fff" /><ellipse cx="191" cy="190" rx="3" ry="3.5" fill="#fff" />
          <path d="M152 218 Q160 226 168 218 Q164 230 160 230 Q156 230 152 218 Z" fill="#e08aa8" />
          <path d="M160 230 Q150 244 144 240" stroke="#a87090" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M160 230 Q170 244 176 240" stroke="#a87090" strokeWidth="2" fill="none" strokeLinecap="round" />
          <g transform="translate(120 38) rotate(-15)">
            <path d="M0 0 L-12 -8 L-10 6 Z" fill="#c5b3f0" /><path d="M0 0 L12 -8 L10 6 Z" fill="#c5b3f0" />
            <circle cx="0" cy="0" r="4.5" fill="#9d72d1" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
