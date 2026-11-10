"use client";

import * as React from "react";

type Severity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger";

type Appearance = "solid" | "outline" | "ghost";

type Size = "sm" | "md" | "lg";

type Shape = "default" | "rounded" | "square" | "circle";

type Elevation = "none" | "sm" | "md";

export type SgButtonCustomColors = {
  bg?: string; // ex: "#2563eb"
  fg?: string; // ex: "white"
  border?: string; // ex: "#1d4ed8"
  hoverBg?: string;
  hoverFg?: string;
  hoverBorder?: string;
  activeBg?: string;
  ring?: string; // ex: "rgba(37,99,235,.35)"
};

export type SgButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "disabled" | "onClick"> & {
  /**
   * Clique do botão. Pode ser síncrono ou assíncrono (`(event) => unknown`).
   *
   * - Síncrono (abrir modal, alternar painel): funciona como sempre, nada muda.
   * - Se DEVOLVER uma Promise (`async () => { await salvar(); }` ou `() => salvar()`), o botão entra em loading
   *   sozinho (spinner, desabilitado, aria-busy), ignora cliques até terminar (inclusive cliques seguidos antes do
   *   re-render) e volta ao normal ao terminar ou falhar. Protege contra duplo clique e reenvio e ajuda na
   *   idempotência da ação na tela (não substitui a chave de idempotência no servidor).
   * - Cuidado: precisa DEVOLVER a Promise. `onClick={() => { salvar(); }}` (chaves sem return) NÃO protege.
   * - Erro: o botão não engole o erro (sai do loading e relança como rejeição não tratada). Trate com try/catch
   *   dentro do onClick e avise o usuário (ex.: `sgWhistle.error`).
   * - Use async só quando a ação puder demorar ou falhar (salvar, enviar, pagar); ações instantâneas ficam síncronas.
   * - A prop `loading` manual continua valendo e vence (loading efetivo = `loading` || Promise pendente).
   *
   * O retorno é `unknown` só para não quebrar handlers existentes de corpo-expressão (`() => lista.push(x)`).
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown;
  /** Quando false, desabilita o botão. Padrão: true. */
  enabled?: boolean;
  severity?: Severity;
  appearance?: Appearance;
  size?: Size;
  shape?: Shape;
  elevation?: Elevation;
  label?: React.ReactNode;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Exibe spinner e bloqueia o clique. Vence o loading automático do onClick: loading efetivo = `loading` || Promise pendente. */
  loading?: boolean;
  customColors?: SgButtonCustomColors;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const PRESET: Record<
  Severity,
  Required<Pick<SgButtonCustomColors, "bg" | "fg" | "border" | "hoverBg" | "hoverFg" | "ring">> & { activeFg: string }
> = {
  primary: {
    bg: "var(--sg-btn-primary-bg, hsl(var(--primary)))",
    fg: "var(--sg-btn-primary-fg, hsl(var(--primary-foreground)))",
    border: "var(--sg-btn-primary-border, hsl(var(--primary)))",
    hoverBg: "var(--sg-btn-primary-hover-bg, hsl(var(--primary)))",
    hoverFg: "var(--sg-btn-primary-hover-fg, var(--sg-btn-primary-fg, hsl(var(--primary-foreground))))",
    activeFg: "var(--sg-btn-primary-active-fg, var(--sg-btn-primary-fg, hsl(var(--primary-foreground))))",
    ring: "var(--sg-btn-primary-ring, hsl(var(--primary)/0.35))"
  },
  secondary: {
    bg: "var(--sg-btn-secondary-bg, hsl(var(--secondary)))",
    fg: "var(--sg-btn-secondary-fg, hsl(var(--secondary-foreground)))",
    border: "var(--sg-btn-secondary-border, hsl(var(--secondary)))",
    hoverBg: "var(--sg-btn-secondary-hover-bg, hsl(var(--secondary)))",
    hoverFg: "var(--sg-btn-secondary-hover-fg, var(--sg-btn-secondary-fg, hsl(var(--secondary-foreground))))",
    activeFg: "var(--sg-btn-secondary-active-fg, var(--sg-btn-secondary-fg, hsl(var(--secondary-foreground))))",
    ring: "var(--sg-btn-secondary-ring, hsl(var(--secondary)/0.35))"
  },
  success: {
    bg: "var(--sg-btn-success-bg, hsl(var(--tertiary, var(--accent))))",
    fg: "var(--sg-btn-success-fg, hsl(var(--tertiary-foreground, var(--accent-foreground, 0 0% 100%))))",
    border: "var(--sg-btn-success-border, hsl(var(--tertiary, var(--accent))))",
    hoverBg: "var(--sg-btn-success-hover-bg, hsl(var(--tertiary, var(--accent))))",
    hoverFg: "var(--sg-btn-success-hover-fg, var(--sg-btn-success-fg, hsl(var(--tertiary-foreground, var(--accent-foreground, 0 0% 100%)))))",
    activeFg: "var(--sg-btn-success-active-fg, var(--sg-btn-success-fg, hsl(var(--tertiary-foreground, var(--accent-foreground, 0 0% 100%)))))",
    ring: "var(--sg-btn-success-ring, hsl(var(--tertiary, var(--accent))/0.35))"
  },
  info: {
    bg: "var(--sg-btn-info-bg, hsl(var(--secondary, var(--primary))))",
    fg: "var(--sg-btn-info-fg, hsl(var(--secondary-foreground, var(--primary-foreground))))",
    border: "var(--sg-btn-info-border, hsl(var(--secondary, var(--primary))))",
    hoverBg: "var(--sg-btn-info-hover-bg, hsl(var(--secondary, var(--primary))))",
    hoverFg: "var(--sg-btn-info-hover-fg, var(--sg-btn-info-fg, hsl(var(--secondary-foreground, var(--primary-foreground)))))",
    activeFg: "var(--sg-btn-info-active-fg, var(--sg-btn-info-fg, hsl(var(--secondary-foreground, var(--primary-foreground)))))",
    ring: "var(--sg-btn-info-ring, hsl(var(--secondary, var(--primary))/0.35))"
  },
  warning: {
    bg: "var(--sg-btn-warning-bg, hsl(var(--secondary, var(--accent))))",
    fg: "var(--sg-btn-warning-fg, hsl(var(--secondary-foreground, var(--accent-foreground, 0 0% 100%))))",
    border: "var(--sg-btn-warning-border, hsl(var(--secondary, var(--accent))))",
    hoverBg: "var(--sg-btn-warning-hover-bg, hsl(var(--secondary, var(--accent))))",
    hoverFg: "var(--sg-btn-warning-hover-fg, var(--sg-btn-warning-fg, hsl(var(--secondary-foreground, var(--accent-foreground, 0 0% 100%)))))",
    activeFg: "var(--sg-btn-warning-active-fg, var(--sg-btn-warning-fg, hsl(var(--secondary-foreground, var(--accent-foreground, 0 0% 100%)))))",
    ring: "var(--sg-btn-warning-ring, hsl(var(--secondary, var(--accent))/0.35))"
  },
  help: {
    bg: "var(--sg-btn-help-bg, hsl(var(--secondary, var(--primary))))",
    fg: "var(--sg-btn-help-fg, hsl(var(--secondary-foreground, var(--primary-foreground))))",
    border: "var(--sg-btn-help-border, hsl(var(--secondary, var(--primary))))",
    hoverBg: "var(--sg-btn-help-hover-bg, hsl(var(--secondary, var(--primary))))",
    hoverFg: "var(--sg-btn-help-hover-fg, var(--sg-btn-help-fg, hsl(var(--secondary-foreground, var(--primary-foreground)))))",
    activeFg: "var(--sg-btn-help-active-fg, var(--sg-btn-help-fg, hsl(var(--secondary-foreground, var(--primary-foreground)))))",
    ring: "var(--sg-btn-help-ring, hsl(var(--secondary, var(--primary))/0.35))"
  },
  danger: {
    bg: "var(--sg-btn-danger-bg, hsl(var(--destructive)))",
    fg: "var(--sg-btn-danger-fg, hsl(var(--destructive-foreground)))",
    border: "var(--sg-btn-danger-border, hsl(var(--destructive)))",
    hoverBg: "var(--sg-btn-danger-hover-bg, hsl(var(--destructive)))",
    hoverFg: "var(--sg-btn-danger-hover-fg, var(--sg-btn-danger-fg, hsl(var(--destructive-foreground))))",
    activeFg: "var(--sg-btn-danger-active-fg, var(--sg-btn-danger-fg, hsl(var(--destructive-foreground))))",
    ring: "var(--sg-btn-danger-ring, hsl(var(--destructive)/0.35))"
  },
};

const SIZE: Record<
  Size,
  { h: string; minH: string; py: string; px: string; text: string; gap: string; icon: string; radius: string }
> = {
  sm: { h: "h-8", minH: "min-h-8", py: "py-1.5", px: "px-3", text: "text-sm", gap: "gap-2", icon: "size-4", radius: "rounded-md" },
  md: { h: "h-10", minH: "min-h-10", py: "py-2", px: "px-4", text: "text-sm", gap: "gap-2", icon: "size-4", radius: "rounded-lg" },
  lg: { h: "h-12", minH: "min-h-12", py: "py-2.5", px: "px-5", text: "text-base", gap: "gap-2.5", icon: "size-5", radius: "rounded-xl" }
};

export function resolveButtonColors(
  severity: Severity,
  custom?: SgButtonCustomColors
): Required<SgButtonCustomColors> & { activeFg: string } {
  const base = PRESET[severity];
  return {
    bg: custom?.bg ?? base.bg,
    fg: custom?.fg ?? base.fg,
    border: custom?.border ?? base.border,
    hoverBg: custom?.hoverBg ?? base.hoverBg,
    // Sem cor customizada, cada estado usa o texto escolhido por contraste sobre o proprio fundo (tokens *-hover-fg/*-active-fg).
    hoverFg: custom?.hoverFg ?? custom?.fg ?? base.hoverFg,
    hoverBorder: custom?.hoverBorder ?? (custom?.border ?? base.border),
    activeBg: custom?.activeBg ?? (custom?.hoverBg ?? base.hoverBg),
    activeFg: custom?.hoverFg ?? custom?.fg ?? base.activeFg,
    ring: custom?.ring ?? base.ring
  };
}

function buildVars(severity: Severity, custom?: SgButtonCustomColors): React.CSSProperties {
  const merged = resolveButtonColors(severity, custom);
  const toneKey = severity === "danger" ? "error" : severity === "help" ? "tertiary" : severity;
  return {
    ["--sg-btn-bg" as any]: merged.bg,
    ["--sg-btn-fg" as any]: merged.fg,
    ["--sg-btn-border" as any]: merged.border,
    ["--sg-btn-hover-bg" as any]: merged.hoverBg,
    ["--sg-btn-hover-fg" as any]: merged.hoverFg,
    ["--sg-btn-hover-border" as any]: merged.hoverBorder,
    ["--sg-btn-active-bg" as any]: merged.activeBg,
    ["--sg-btn-active-fg" as any]: merged.activeFg,
    ["--sg-btn-ring" as any]: merged.ring,
    ["--sg-btn-tint" as any]: `var(--sg-${toneKey}-600)`
  };
}

function appearanceClass(appearance: Appearance) {
  switch (appearance) {
    case "solid":
      return cn(
        "bg-[var(--sg-btn-bg)] text-[var(--sg-btn-fg)] border border-[var(--sg-btn-border)]",
        "hover:bg-[var(--sg-btn-hover-bg)] hover:text-[var(--sg-btn-hover-fg)] hover:border-[var(--sg-btn-hover-border)]",
        "active:bg-[var(--sg-btn-active-bg)] active:text-[var(--sg-btn-active-fg)]"
      );
    case "outline":
      return cn(
        "bg-transparent text-[var(--sg-btn-bg)] border border-[var(--sg-btn-border)]",
        "hover:bg-[rgb(var(--sg-btn-tint)/0.12)]",
        "active:bg-[rgb(var(--sg-btn-tint)/0.18)]"
      );
    case "ghost":
      return cn(
        "bg-transparent text-[var(--sg-btn-bg)] border border-transparent",
        "hover:bg-[rgb(var(--sg-btn-tint)/0.10)]",
        "active:bg-[rgb(var(--sg-btn-tint)/0.16)]"
      );
  }
}

function elevationClass(elevation: Elevation) {
  switch (elevation) {
    case "sm":
      return "shadow-sm hover:shadow-md active:shadow-sm";
    case "md":
      return "shadow-md hover:shadow-lg active:shadow-md";
    default:
      return "";
  }
}

export const SgButton = React.forwardRef<HTMLButtonElement, SgButtonProps>(
  (
    {
      severity = "primary",
      appearance = "solid",
      size,
      shape,
      elevation = "none",
      label,
      iconOnly,
      leftIcon,
      rightIcon,
      loading = false,
      enabled = true,
      className,
      children,
      style,
      customColors,
      type = "button",
      onClick,
      ...rest
    },
    ref
  ) => {
    const [pending, setPending] = React.useState(false);
    const pendingRef = React.useRef(false);
    const mountedRef = React.useRef(true);
    React.useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    const isLoading = loading || pending;
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!onClick || !enabled || loading || pendingRef.current) return;
        const result = onClick(event);
        if (!result || typeof (result as { then?: unknown }).then !== "function") return;
        pendingRef.current = true;
        setPending(true);
        const done = () => {
          pendingRef.current = false;
          if (mountedRef.current) setPending(false);
        };
        // O erro da Promise nao e engolido: segue como rejeicao sem tratamento, como antes.
        void (result as Promise<void>).then(done, (error: unknown) => {
          done();
          throw error;
        });
      },
      [onClick, enabled, loading]
    );

    const resolvedChildren = children ?? label;
    const isDisabled = Boolean(!enabled || isLoading);
    const inferredIconOnly = !resolvedChildren && (leftIcon || rightIcon);
    const isIconOnly = iconOnly ?? inferredIconOnly;
    const resolvedSize = size ?? (isIconOnly ? "sm" : "md");
    const resolvedShape = shape ?? (isIconOnly ? "circle" : "default");
    const s = SIZE[resolvedSize];
    const contentClass = cn(
      "inline-flex min-w-0 items-center justify-center",
      !isIconOnly ? "w-full" : undefined,
      s.gap
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading ? true : undefined}
        style={{ ...buildVars(severity, customColors), ...style }}
        className={cn(
          "inline-flex min-w-0 max-w-full items-center justify-center select-none whitespace-normal break-words text-center",
          "font-medium",
          "transition-[background-color,color,border-color,box-shadow,transform] duration-150",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--sg-btn-ring)]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          isIconOnly ? cn("aspect-square", s.h) : cn(s.minH, s.py, s.px),
          s.text,
          resolvedShape === "rounded" ? "rounded-full" : resolvedShape === "circle" ? "rounded-full" : resolvedShape === "square" ? "rounded-none" : s.radius,
          appearanceClass(appearance),
          elevationClass(elevation),
          !isDisabled ? "active:translate-y-[0.5px]" : false,
          className
        )}
        {...rest}
        onClick={onClick ? handleClick : undefined}
      >
        {isLoading ? (
          <span className={contentClass}>
            <Spinner className={s.icon} />
            {resolvedChildren ? <span className="min-w-0 whitespace-normal break-words">{resolvedChildren}</span> : null}
          </span>
        ) : (
          <span className={contentClass}>
            {leftIcon ? <span className={cn("shrink-0", s.icon)}>{leftIcon}</span> : null}
            {resolvedChildren ? <span className="min-w-0 whitespace-normal break-words">{resolvedChildren}</span> : null}
            {rightIcon ? <span className={cn("shrink-0", s.icon)}>{rightIcon}</span> : null}
          </span>
        )}
      </button>
    );
  }
);

SgButton.displayName = "SgButton";

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
