"use client";

import * as React from "react";
import {
  cn,
  renderDockContent,
  toCssSpace
} from "./sgDocking";

export type SgScreenProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  fullscreen?: boolean;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  children?: React.ReactNode;
};

export function SgScreen(props: Readonly<SgScreenProps>) {
  const {
    fullscreen = true,
    width,
    height,
    padding,
    className,
    style,
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        "relative box-border flex flex-1 self-stretch min-h-0 min-w-0 max-h-full max-w-full overflow-hidden",
        className
      )}
      style={{
        ...style,
        ...(width !== undefined
          ? { width: toCssSpace(width) }
          : fullscreen
            ? { width: "100%" }
            : null),
        ...(height !== undefined
          ? { height: toCssSpace(height) }
          : fullscreen
            ? { height: "100dvh" }
            : null),
        padding: toCssSpace(padding)
      }}
      {...rest}
    >
      <div className="flex flex-1 min-h-0 min-w-0 flex-col">
        {renderDockContent({
          children,
          align: "client"
        })}
      </div>
    </div>
  );
}

SgScreen.displayName = "SgScreen";
