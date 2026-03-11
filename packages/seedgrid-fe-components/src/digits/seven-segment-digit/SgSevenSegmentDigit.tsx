import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type SegmentName = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const SEGMENT_ORDER: readonly SegmentName[] = ["a", "b", "c", "d", "e", "f", "g"] as const;

const GLYPHS: Record<string, readonly SegmentName[]> = {
  " ": [],
  "-": ["g"],
  _: ["d"],
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "d", "e", "g"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["b", "c", "f", "g"],
  "5": ["a", "c", "d", "f", "g"],
  "6": ["a", "c", "d", "e", "f", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
  A: ["a", "b", "c", "e", "f", "g"],
  B: ["c", "d", "e", "f", "g"],
  C: ["a", "d", "e", "f"],
  D: ["b", "c", "d", "e", "g"],
  E: ["a", "d", "e", "f", "g"],
  F: ["a", "e", "f", "g"],
  H: ["b", "c", "e", "f", "g"],
  J: ["b", "c", "d", "e"],
  L: ["d", "e", "f"],
  P: ["a", "b", "e", "f", "g"],
  U: ["b", "c", "d", "e", "f"],
  Y: ["b", "c", "d", "f", "g"]
};

export type SgSevenSegmentDigitPalette = "red" | "blue" | "yellow" | "green" | "white";

const PALETTES: Record<
  SgSevenSegmentDigitPalette,
  { color: string; backgroundColor: string; offColor: string }
> = {
  red: {
    color: "#ef4444",
    backgroundColor: "#120909",
    offColor: "rgba(127, 29, 29, 0.28)"
  },
  blue: {
    color: "#60a5fa",
    backgroundColor: "#061226",
    offColor: "rgba(30, 64, 175, 0.3)"
  },
  yellow: {
    color: "#facc15",
    backgroundColor: "#1a1303",
    offColor: "rgba(161, 98, 7, 0.32)"
  },
  green: {
    color: "#22c55e",
    backgroundColor: "#04120a",
    offColor: "rgba(20, 83, 45, 0.28)"
  },
  white: {
    color: "#f8fafc",
    backgroundColor: "#111827",
    offColor: "rgba(148, 163, 184, 0.3)"
  }
};

export type SgSevenSegmentDigitProps = {
  /** Character rendered by the component (first character is used). */
  value: string;
  /** Preset visual palette for active, inactive and background colors. */
  palette?: SgSevenSegmentDigitPalette;
  /** Color of active segments. */
  color?: string;
  /** Background color of the component panel. */
  backgroundColor?: string;
  /** Color of inactive segments. */
  offColor?: string;
  /** Component height in pixels. */
  size?: number;
  /** Component width in pixels. By default, derived from `size`. */
  width?: number;
  /** Segment thickness in pixels. */
  thickness?: number;
  /** Internal panel padding in pixels. */
  padding?: number;
  /** Border radius of the panel in pixels. */
  rounded?: number;
  /** Applies a subtle skew to mimic classic LED displays. */
  skew?: number;
  /** Enables glow effect on active segments. */
  glow?: boolean;
  /** Segment transition duration in milliseconds. */
  transitionMs?: number;
  /** Additional classes on outer wrapper. */
  className?: string;
  /** Additional inline styles on outer wrapper. */
  style?: React.CSSProperties;
};

function segmentSetFor(value: string): ReadonlySet<SegmentName> {
  const char = (value ?? " ").charAt(0).toUpperCase();
  const segments = GLYPHS[char] ?? GLYPHS[" "] ?? [];
  return new Set(segments);
}

export function SgSevenSegmentDigit({
  value,
  palette = "red",
  color,
  backgroundColor,
  offColor,
  size = 108,
  width,
  thickness = 14,
  padding = 10,
  rounded = 12,
  skew = -8,
  glow = true,
  transitionMs = 180,
  className,
  style
}: Readonly<SgSevenSegmentDigitProps>) {
  const active = React.useMemo(() => segmentSetFor(value), [value]);
  const paletteTokens = PALETTES[palette];
  const activeColor = color ?? paletteTokens.color;
  const panelBackground = backgroundColor ?? paletteTokens.backgroundColor;
  const inactiveColor = offColor ?? paletteTokens.offColor;

  const h = Math.max(48, Math.round(size));
  const w = Math.max(28, Math.round(width ?? h * 0.62));
  const t = Math.max(4, Math.round(thickness));
  const p = Math.max(2, Math.round(padding));
  const innerW = Math.max(1, w - p * 2);
  const innerH = Math.max(1, h - p * 2);
  const halfInner = Math.floor(innerH / 2);
  const segmentLength = Math.max(1, innerW - t);
  const verticalLength = Math.max(1, halfInner - t);
  const glowSize = Math.max(4, Math.round(t * 1.25));

  const horizontalStyle = (top: number): React.CSSProperties => ({
    left: p + t / 2,
    top,
    width: segmentLength,
    height: t,
    borderRadius: t / 2
  });

  const verticalStyle = (left: number, top: number): React.CSSProperties => ({
    left,
    top,
    width: t,
    height: verticalLength,
    borderRadius: t / 2
  });

  const segmentStyles: Record<SegmentName, React.CSSProperties> = {
    a: horizontalStyle(p),
    b: verticalStyle(w - p - t, p + t / 2),
    c: verticalStyle(w - p - t, p + halfInner + t / 2),
    d: horizontalStyle(h - p - t),
    e: verticalStyle(p, p + halfInner + t / 2),
    f: verticalStyle(p, p + t / 2),
    g: horizontalStyle(p + halfInner - t / 2)
  };

  return (
    <div
      role="img"
      aria-label={value}
      className={cn("inline-flex", className)}
      style={{
        width: w,
        height: h,
        borderRadius: rounded,
        overflow: "hidden",
        backgroundColor: panelBackground,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 10px 20px rgba(0,0,0,0.16)",
        ...style
      }}
    >
      <div className="relative h-full w-full" style={{ transform: `skewX(${skew}deg)` }}>
        {SEGMENT_ORDER.map((segmentName) => {
          const isOn = active.has(segmentName);
          return (
            <span
              key={segmentName}
              aria-hidden="true"
              style={{
                position: "absolute",
                ...segmentStyles[segmentName],
                backgroundColor: isOn ? activeColor : inactiveColor,
                boxShadow: isOn && glow ? `0 0 ${glowSize}px ${activeColor}` : "none",
                transition: `background-color ${transitionMs}ms ease, box-shadow ${transitionMs}ms ease`
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
