// Authored line-icon set for the marketing pages (M1 redesign pass).
// Replaces raw emoji used as functional icons -- category tiles, feature
// cards, the About page's tech/principles cards, and the contact methods --
// with a single consistent visual language: one stroke weight, rounded
// caps/joins, no fill except where a small solid accent reads better than an
// outline (kept to a minimum). Every icon takes the same two props so it can
// drop into an existing `{ icon: IconX }` data shape and render as `<icon.icon
// width={22} height={22} />` without special-casing per icon.
//
// Deliberately NOT used for: the hero's compass-rose (already bespoke, in
// app/page.tsx), the GitHub mark and the search/send icons already inline in
// contact/page.tsx and ContactForm.tsx (same authored style, no need to
// duplicate them here), or the hub's own nav emoji (a separate surface with
// its own established pattern, out of scope for this pass).

export interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

// ---- AI category tiles (home) ----

export function IconPen({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function IconCode({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M9 18 3 12l6-6" />
      <path d="M15 6l6 6-6 6" />
    </svg>
  );
}

export function IconImage({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M21 16.5 16 11l-4.5 5L9 14 3 19" />
    </svg>
  );
}

export function IconTrendingUp({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M3 17 9.5 10.5 14 15 21 7" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function IconClapper({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M4 9.5 19.5 5 21 8l-15.5 4.5Z" />
      <rect x="3" y="10.5" width="18" height="9.5" rx="2" />
    </svg>
  );
}

export function IconNotepad({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

export function IconLayout({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  );
}

export function IconArrowRight({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

// ---- Tech category tiles (home) ----

export function IconWindow({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.3" cy="6.7" r=".4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconServer({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="3" y="4" width="18" height="6.5" rx="1.6" />
      <rect x="3" y="13.5" width="18" height="6.5" rx="1.6" />
      <path d="M7 7.25h.01M7 16.75h.01" strokeWidth={2.4} />
    </svg>
  );
}

export function IconDatabase({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}

export function IconCloud({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M7 18a4.5 4.5 0 0 1-1-8.88A5.5 5.5 0 0 1 16.5 8 4 4 0 0 1 17 16H7Z" />
    </svg>
  );
}

export function IconPhone({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 19h3" />
    </svg>
  );
}

export function IconFlask({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M9 2h6M10 2v6.5L4.8 18a2 2 0 0 0 1.75 3h10.9a2 2 0 0 0 1.75-3L14 8.5V2" />
      <path d="M7.5 14.5h9" />
    </svg>
  );
}

export function IconShieldLock({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <rect x="9.3" y="11" width="5.4" height="4.2" rx="1" />
      <path d="M10.2 11V9.6a1.8 1.8 0 0 1 3.6 0V11" />
    </svg>
  );
}

// ---- Feature cards (home) ----

export function IconSearch({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.6-4.6" />
    </svg>
  );
}

export function IconScales({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M12 3v17M7 21h10" />
      <path d="M4 7h6M14 7h6" />
      <path d="M4 7l-2 5a2.5 2.5 0 0 0 5 0Z" />
      <path d="M20 7l-2 5a2.5 2.5 0 0 0 5 0Z" />
    </svg>
  );
}

export function IconStar({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M12 3.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.8L12 16.6l-5.3 2.9 1.1-5.8-4.3-4.1 5.9-.7Z" />
    </svg>
  );
}

export function IconLink({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5l1.1-1.1a4 4 0 0 1 5.6 5.6L16.5 12" />
      <path d="M13 17.5l-1.1 1.1a4 4 0 0 1-5.6-5.6L7.5 12" />
    </svg>
  );
}

export function IconShield({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="M9 12l2.2 2.2L15.5 9.5" />
    </svg>
  );
}

// ---- About: "How it's built" ----

export function IconTriangle({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M12 4 21 19H3Z" />
    </svg>
  );
}

export function IconAtom({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function IconBrush({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M9.5 14.5 18 6a2.1 2.1 0 0 1 3 3l-8.5 8.5" />
      <path d="M9.5 14.5c.6 1.8-.2 3.6-2 4.3-1.6.6-3.3.2-4.3-1-.9-1-1-2.5-.2-3.6.9-1.3 2.6-1.8 4-1.2.9.4 1.9 1 2.5 1.5Z" />
    </svg>
  );
}

export function IconSave({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M5 3h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M8 3v5h7V3" />
      <path d="M7 21v-6h10v6" />
    </svg>
  );
}

export function IconGlobe({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18Z" />
    </svg>
  );
}

// ---- About: "Principles" ----

export function IconGauge({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l4-4.5" />
      <path d="M4 15h1.5M18.5 15H20M6.5 8.5l1 1M17.5 8.5l-1 1" />
    </svg>
  );
}

export function IconUnlock({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </svg>
  );
}

export function IconBadgeCheck({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M12 2.5l2.3 1.3 2.6-.2 1 2.4 2.1 1.5-.6 2.5.6 2.5-2.1 1.5-1 2.4-2.6-.2L12 17.9l-2.3-1.3-2.6.2-1-2.4-2.1-1.5.6-2.5-.6-2.5 2.1-1.5 1-2.4 2.6.2Z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  );
}

export function IconKeyboard({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="2.5" y="6.5" width="19" height="12" rx="2" />
      <path d="M6 10.5h.01M9.5 10.5h.01M13 10.5h.01M16.5 10.5h.01M6 14h12" />
    </svg>
  );
}

// ---- Contact methods ----

export function IconWrench({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2Z" />
    </svg>
  );
}

export function IconBug({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <rect x="7.5" y="8" width="9" height="10" rx="4" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M12 8v10M4.5 11l3 1.5M19.5 11l-3 1.5M4.5 18l3-1.5M19.5 18l-3-1.5" />
    </svg>
  );
}

export function IconClock({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <circle cx="12" cy="12.5" r="8.5" />
      <path d="M12 8v5l3 2" />
      <path d="M9.5 2.5h5" />
    </svg>
  );
}

export function IconCheckCircle({ width = 22, height = 22, className }: IconProps) {
  return (
    <svg {...base} width={width} height={height} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16.5 9" />
    </svg>
  );
}
