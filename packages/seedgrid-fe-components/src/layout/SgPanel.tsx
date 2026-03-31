"use client";

import * as React from "react";
import {
  cn,
  renderDockContent,
  toCssPercent,
  toCssSpace,
  type SgDockAlign,
  type SgDockContentAlign,
  type SgDockContentDirection,
  type SgDockContentJustify,
  type SgDockPercent
} from "./sgDocking";

export type SgPanelAlign = SgDockAlign;
export type SgPanelBorderStyle = "none" | "solid" | "dashed";
export type SgPanelScrollable = boolean | "auto" | "y" | "x";
export type SgPanelPercent = SgDockPercent;

export type SgPanelContentDirection = SgDockContentDirection;
export type SgPanelContentJustify = SgDockContentJustify;
export type SgPanelContentAlign = SgDockContentAlign;

export type SgPanelProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "align" | "children"
> & {
  align?: SgPanelAlign;
  width?: SgPanelPercent;
  height?: SgPanelPercent;
  minWidthPx?: number;
  minHeightPx?: number;
  span?: number;
  rowSpan?: number;
  borderStyle?: SgPanelBorderStyle;
  padding?: number | string;
  contentPadding?: number | string;
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
  if (!scrollable) return "overflow-hidden";
  if (scrollable === true || scrollable === "auto") return "overflow-auto";
  if (scrollable === "y") return "overflow-y-auto overflow-x-hidden";
  return "overflow-x-auto overflow-y-hidden";
}

export function SgPanel(props: Readonly<SgPanelProps>) {
  const {
    align = "client",
    width,
    height,
    minWidthPx,
    minHeightPx,
    borderStyle = "dashed",
    padding,
    contentPadding,
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

  const borderClass =
    borderStyle === "none"
      ? "border border-transparent"
      : borderStyle === "solid"
        ? "border border-solid border-border"
        : "border border-dashed border-border";

  const widthCss = toCssPercent(width);
  const heightCss = toCssPercent(height);
  const contentNode = renderDockContent({
    children,
    align,
    contentDirection,
    contentGap,
    contentJustify,
    contentAlign,
    contentWrap,
    contentClassName,
    contentStyle
  });

  return (
    <div
      className={cn(
        "flex box-border min-h-0 min-w-0 max-w-full flex-col bg-background",
        borderClass,
        getScrollClass(scrollable),
        className
      )}
      style={{
        ...style,
        ...(widthCss !== undefined ? { width: widthCss } : null),
        ...(heightCss !== undefined ? { height: heightCss } : null),
        ...(minWidthPx !== undefined ? { minWidth: `${minWidthPx}px` } : null),
        ...(minHeightPx !== undefined ? { minHeight: `${minHeightPx}px` } : null),
        margin: toCssSpace(padding),
        padding: toCssSpace(contentPadding),
        ...(scrollbarGutter
          ? ({ scrollbarGutter: "stable" } as React.CSSProperties)
          : null)
      }}
      {...rest}
    >
      {contentNode}
    </div>
  );
}

SgPanel.displayName = "SgPanel";
