"use client";

import type { ReactNode } from "react";

import { SgBadge, SgCard, SgStack, SgWhistleHost } from "@seedgrid/fe-components";
import { useSgTheme } from "@/theme";

type PageFrameProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  readonlyLabel?: string | null;
};

export function PageFrame({
  title,
  description,
  actions,
  children,
  readonlyLabel,
}: PageFrameProps) {
  const { currentMode } = useSgTheme();
  const isDarkMode = currentMode === "dark";

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-none">
        <SgCard
          cardStyle="elevated"
          size="lg"
          className={`rounded-[2rem] border shadow-xl backdrop-blur ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/95 shadow-black/20"
              : "border-white/70 bg-white/92 shadow-slate-900/5"
          }`}
          title={
            <SgStack gap={8}>
              {readonlyLabel ? (
                <SgBadge
                  value={readonlyLabel}
                  severity="warning"
                  badgeStyle="soft"
                  rounded
                />
              ) : null}
              <div
                className={`text-2xl font-semibold sm:text-3xl ${
                  isDarkMode ? "text-slate-50" : "text-slate-950"
                }`}
              >
                {title}
              </div>
            </SgStack>
          }
          description={description}
          actions={actions}
          headerClassName={
            isDarkMode
              ? "border-b border-slate-800 bg-slate-950/70"
              : "border-b border-slate-200/80 bg-slate-50/80"
          }
        >
          <SgStack gap={16}>
            <SgWhistleHost className="w-full" newestOnTop max={2} />
            {children}
          </SgStack>
        </SgCard>
      </div>
    </section>
  );
}

export function InlineNotice({
  tone = "info",
  children,
}: {
  tone?: "danger" | "info" | "success" | "warning";
  children: ReactNode;
}) {
  const { currentMode } = useSgTheme();
  const isDarkMode = currentMode === "dark";
  const className =
    tone === "danger"
      ? isDarkMode
        ? "border-rose-900/70 bg-rose-950/40 text-rose-100"
        : "border-rose-200 bg-rose-50 text-rose-950"
      : tone === "success"
        ? isDarkMode
          ? "border-emerald-900/70 bg-emerald-950/40 text-emerald-100"
          : "border-emerald-200 bg-emerald-50 text-emerald-950"
        : tone === "warning"
          ? isDarkMode
            ? "border-amber-900/70 bg-amber-950/35 text-amber-100"
            : "border-amber-200 bg-amber-50 text-amber-950"
          : isDarkMode
            ? "border-sky-900/70 bg-sky-950/35 text-sky-100"
            : "border-sky-200 bg-sky-50 text-sky-950";

  return (
    <div className={`rounded-2xl border p-4 text-sm leading-6 ${className}`}>
      {children}
    </div>
  );
}
