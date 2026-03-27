"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSpace(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function toCssPercent(value?: SgPanelPercent) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}%` : value;
}

export type SgPanelAlign = "top" | "left" | "bottom" | "right" | "client";
export type SgPanelBorderStyle = "none" | "solid" | "dashed";
export type SgPanelScrollable = boolean | "auto" | "y" | "x";
export type SgPanelPercent = number | `${number}%`;

export type SgPanelContentDirection = "row" | "column";
export type SgPanelContentJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type SgPanelContentAlign = "start" | "center" | "end" | "stretch";

export type SgPanelProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "align" | "children"
> & {
  align?: SgPanelAlign;
  width?: SgPanelPercent;
  height?: SgPanelPercent;
  span?: number;
  rowSpan?: number;
  borderStyle?: SgPanelBorderStyle;
  padding?: number | string;
  scrollable?: SgPanelScrollable;
  scrollbarGutter?: boolean;

  contentDirection?: SgPanelContentDirection;
  contentGap?: number | string;
  contentJustify?: SgPanelContentJustify;
  contentAlign?: SgPanelContentAlign;
  contentWrap?: boolean;

  contentClassName?: string;
  contentStyle?: React.CSSProperties;

  children?: React.ReactNode;
};

function getScrollClass(scrollable: SgPanelScrollable | undefined) {
  if (!scrollable) return "";
  if (scrollable === true || scrollable === "auto") return "overflow-auto";
  if (scrollable === "y") return "overflow-y-auto overflow-x-hidden";
  return "overflow-x-auto overflow-y-hidden";
}

function getDefaultContentDirection(
  align: SgPanelAlign | undefined
): SgPanelContentDirection {
  return align === "top" || align === "bottom" ? "row" : "column";
}

function getDefaultContentAlign(
  align: SgPanelAlign | undefined
): SgPanelContentAlign {
  return align === "top" || align === "bottom" ? "start" : "stretch";
}

function getDefaultContentGap() {
  return 10;
}

function getJustifyClass(justify: SgPanelContentJustify) {
  const map: Record<SgPanelContentJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  };
  return map[justify];
}

function getAlignClass(align: SgPanelContentAlign) {
  const map: Record<SgPanelContentAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch"
  };
  return map[align];
}

export function SgPanel(props: Readonly<SgPanelProps>) {
  const {
    align = "client",
    width,
    height,
    borderStyle = "solid",
    padding,
    scrollable = false,
    scrollbarGutter = false,

    contentDirection,
    contentGap,
    contentJustify,
    contentAlign,
    contentWrap,
    contentClassName,
    contentStyle,

    className,
    style,
    children,
    ...rest
  } = props;

  const resolvedContentDirection =
    contentDirection ?? getDefaultContentDirection(align);

  const resolvedContentGap = contentGap ?? getDefaultContentGap();

  const resolvedContentJustify = contentJustify ?? "start";

  const resolvedContentAlign =
    contentAlign ?? getDefaultContentAlign(align);

  const resolvedContentWrap = contentWrap ?? false;

  const borderClass =
    borderStyle === "none"
      ? "border border-transparent"
      : borderStyle === "dashed"
        ? "border border-dashed border-border"
        : "border border-solid border-border";

  const widthCss = toCssPercent(width);
  const heightCss = toCssPercent(height);

  return (
    <div
      className={cn(
        "min-h-0 min-w-0 bg-background",
        borderClass,
        getScrollClass(scrollable),
        className
      )}
      style={{
        ...style,
        ...(widthCss !== undefined ? { width: widthCss } : null),
        ...(heightCss !== undefined ? { height: heightCss } : null),
        padding: toCssSpace(padding),
        ...(scrollbarGutter
          ? ({ scrollbarGutter: "stable" } as React.CSSProperties)
          : null)
      }}
      {...rest}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0",
          resolvedContentDirection === "row" ? "flex-row" : "flex-col",
          getJustifyClass(resolvedContentJustify),
          getAlignClass(resolvedContentAlign),
          resolvedContentWrap ? "flex-wrap" : "",
          contentClassName
        )}
        style={{
          gap: toCssSpace(resolvedContentGap),
          ...contentStyle
        }}
      >
        {children}
      </div>
    </div>
  );
}

SgPanel.displayName = "SgPanel";