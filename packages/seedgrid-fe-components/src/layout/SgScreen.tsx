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
  const ref = React.useRef<HTMLDivElement>(null);
  const [measuredSize, setMeasuredSize] = React.useState<{
    width?: number;
    height?: number;
  }>({});

  React.useLayoutEffect(() => {
    if (!fullscreen) {
      setMeasuredSize({});
      return;
    }

    const element = ref.current;
    const parent = element?.parentElement;

    if (!element || !parent) return;

    const update = () => {
      setMeasuredSize({
        width: parent.clientWidth || undefined,
        height: parent.clientHeight || undefined
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(parent);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [fullscreen]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative box-border flex flex-1 self-stretch min-h-0 min-w-0 max-h-full max-w-full overflow-hidden",
        className
      )}
      style={{
        ...style,
        ...(width !== undefined
          ? { width: toCssSpace(width) }
          : fullscreen && measuredSize.width !== undefined
            ? { width: `${measuredSize.width}px` }
            : null),
        ...(height !== undefined
          ? { height: toCssSpace(height) }
          : fullscreen && measuredSize.height !== undefined
            ? { height: `${measuredSize.height}px` }
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
