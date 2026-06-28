import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import ShowcaseShell from "./ShowcaseShell";
import { SeedThemeProvider } from "@seedgrid/fe-theme";

export const metadata: Metadata = {
  title: "SeedGrid Components Showcase",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <ShowcaseShell initialLocale="pt-BR">{children}</ShowcaseShell>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning no <html>: o SeedThemeProvider (mode "auto" + persistMode, applyTo="html")
  // resolve o tema no client (preferencia do sistema / localStorage), entao os estilos do <html>
  // diferem do SSR ate o mount. Divergencia intencional — mesmo padrao do next-themes.
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-[rgb(var(--sg-bg))] text-[rgb(var(--sg-text))]">
        <SeedThemeProvider
          initialTheme={{
            seed: "#16803D", // Verde SeedGrid
            mode: "auto",
            radius: 8,
            persistMode: true,
          }}
          applyTo="html"
        >
          <RootContent>{children}</RootContent>
        </SeedThemeProvider>
      </body>
    </html>
  );
}
