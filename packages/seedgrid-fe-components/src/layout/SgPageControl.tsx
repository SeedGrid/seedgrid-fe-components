"use client";

import * as React from "react";
import { t, useComponentsI18n } from "../i18n";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgPageControlPageProps = {
  id?: string;
  title: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  hidden?: boolean;
  disabled?: boolean;
  keepMounted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  tabClassName?: string;
  children: React.ReactNode;
};

export type SgPageControlProps = {
  children: React.ReactNode;

  activePageId?: string;
  activeIndex?: number;
  defaultActivePageId?: string;
  defaultActiveIndex?: number;
  onActivePageIdChange?: (
    pageId: string,
    context: { index: number; page: SgPageControlPageProps }
  ) => void;
  onActiveIndexChange?: (
    index: number,
    context: { pageId: string; page: SgPageControlPageProps }
  ) => void;

  hiddenPageIds?: string[];

  keepMounted?: boolean;
  pageControlStyle?: "underline" | "pills";
  size?: "sm" | "md" | "lg";
  /**
   * Distribui as abas em larguras iguais a partir do tablet (`md`, 768px).
   * No celular as abas mantem a largura natural e a lista rola — abas iguais numa
   * tela estreita espremem os rotulos ate ninguem conseguir ler.
   */
  fullWidthTabs?: boolean;
  /**
   * Comportamento das abas no celular (abaixo de `md`, 768px).
   * - `"scroll"` (default): continuam abas, com rolagem horizontal, e a aba ativa
   *   e trazida para a area visivel sozinha.
   * - `"select"`: viram um `<select>` nativo, util quando sao muitas abas ou os
   *   rotulos sao longos. Tablet e desktop nao mudam.
   */
  mobilePageControl?: "scroll" | "select";
  keyboardNavigation?: boolean;

  ariaLabel?: string;
  emptyMessage?: React.ReactNode;

  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  panelClassName?: string;
  style?: React.CSSProperties;
};

type PageRecord = {
  id: string;
  props: SgPageControlPageProps;
  element: React.ReactElement<SgPageControlPageProps>;
  hidden: boolean;
};

function resolveRecords(
  children: React.ReactNode,
  hiddenPageIds?: string[]
): PageRecord[] {
  const hiddenSet = new Set(hiddenPageIds ?? []);
  const pageElements = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<SgPageControlPageProps> =>
      React.isValidElement(child) &&
      (child.type === SgPageControlPage || (child.type as any)?.displayName === "SgPageControlPage")
  );

  return pageElements.map((element, index) => {
    const id = element.props.id ?? `sg-page-control-page-${index + 1}`;
    const hidden = !!element.props.hidden || hiddenSet.has(id);
    return { id, props: element.props, element, hidden };
  });
}

// <option> so aceita texto. `title` e ReactNode (pode vir com icone/markup), entao
// caimos para `hint` e, por ultimo, para o id — nunca para string vazia, que deixaria
// a opcao invisivel no select do celular.
function optionLabel(record: PageRecord) {
  const { title, hint } = record.props;
  if (typeof title === "string" && title.trim()) return title;
  if (typeof title === "number") return String(title);
  if (hint?.trim()) return hint;
  return record.id;
}

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(length - 1, Math.floor(index)));
}

export function SgPageControl(props: Readonly<SgPageControlProps>) {
  const {
    children,
    activePageId,
    activeIndex,
    defaultActivePageId,
    defaultActiveIndex = 0,
    onActivePageIdChange,
    onActiveIndexChange,
    hiddenPageIds,
    keepMounted = false,
    pageControlStyle = "underline",
    size = "md",
    fullWidthTabs = false,
    mobilePageControl = "scroll",
    keyboardNavigation = true,
    ariaLabel,
    emptyMessage,
    className,
    tabListClassName,
    tabClassName,
    panelClassName,
    style
  } = props;

  const i18n = useComponentsI18n();
  const resolvedAriaLabel = ariaLabel ?? t(i18n, "components.pageControl.ariaLabel");
  const resolvedEmptyMessage = emptyMessage ?? t(i18n, "components.pageControl.empty");

  const records = React.useMemo(
    () => resolveRecords(children, hiddenPageIds),
    [children, hiddenPageIds]
  );
  const visiblePages = React.useMemo(
    () => records.filter((record) => !record.hidden),
    [records]
  );

  const isControlled = activePageId !== undefined || activeIndex !== undefined;

  const defaultIdFromProps =
    defaultActivePageId !== undefined
      ? defaultActivePageId
      : visiblePages[clampIndex(defaultActiveIndex, visiblePages.length)]?.id;

  const [internalActiveId, setInternalActiveId] = React.useState<string | undefined>(
    defaultIdFromProps ?? visiblePages[0]?.id
  );

  const controlledId =
    activePageId !== undefined
      ? activePageId
      : activeIndex !== undefined
      ? visiblePages[clampIndex(activeIndex, visiblePages.length)]?.id
      : undefined;

  const tentativeActiveId = controlledId ?? internalActiveId;
  const resolvedActiveId =
    tentativeActiveId && visiblePages.some((record) => record.id === tentativeActiveId)
      ? tentativeActiveId
      : visiblePages[0]?.id;

  React.useEffect(() => {
    if (isControlled) return;
    if (resolvedActiveId === internalActiveId) return;
    setInternalActiveId(resolvedActiveId);
  }, [isControlled, internalActiveId, resolvedActiveId]);

  const activeIndexResolved = React.useMemo(
    () => visiblePages.findIndex((record) => record.id === resolvedActiveId),
    [resolvedActiveId, visiblePages]
  );

  const activePage = activeIndexResolved >= 0 ? visiblePages[activeIndexResolved] : undefined;

  const fireOnChange = React.useCallback(
    (nextId: string) => {
      const nextIndex = visiblePages.findIndex((record) => record.id === nextId);
      if (nextIndex < 0) return;
      const nextPage = visiblePages[nextIndex]?.props;
      if (!nextPage) return;
      onActivePageIdChange?.(nextId, { index: nextIndex, page: nextPage });
      onActiveIndexChange?.(nextIndex, { pageId: nextId, page: nextPage });
    },
    [onActiveIndexChange, onActivePageIdChange, visiblePages]
  );

  const selectPage = React.useCallback(
    (nextId: string) => {
      const next = visiblePages.find((record) => record.id === nextId);
      if (!next || next.props.disabled) return;
      if (!isControlled) setInternalActiveId(nextId);
      fireOnChange(nextId);
    },
    [fireOnChange, isControlled, visiblePages]
  );

  const tabsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const tabListRef = React.useRef<HTMLDivElement | null>(null);
  const rootId = React.useId();

  // Com rolagem horizontal a aba ativa pode estar fora da area visivel — ao trocar de
  // pagina por teclado, por codigo (modo controlado) ou pelo select do celular, ela
  // precisa aparecer. Mexemos em scrollLeft em vez de scrollIntoView de proposito:
  // scrollIntoView sobe pelos ancestrais e rola a PAGINA junto.
  React.useEffect(() => {
    const list = tabListRef.current;
    const tab = tabsRef.current[activeIndexResolved];
    if (!list || !tab) return;
    if (list.scrollWidth <= list.clientWidth) return;

    const margin = 8;
    const tabStart = tab.offsetLeft;
    const tabEnd = tabStart + tab.offsetWidth;
    const viewStart = list.scrollLeft;
    const viewEnd = viewStart + list.clientWidth;

    if (tabStart < viewStart) {
      list.scrollLeft = Math.max(0, tabStart - margin);
    } else if (tabEnd > viewEnd) {
      list.scrollLeft = tabEnd - list.clientWidth + margin;
    }
  }, [activeIndexResolved]);

  const sizeClasses =
    size === "sm"
      ? {
          tab: "h-8 px-3 text-xs gap-1.5",
          icon: "size-4",
          panel: "p-3",
          select: "h-8 text-xs"
        }
      : size === "lg"
      ? {
          tab: "h-11 px-4 text-sm gap-2.5",
          icon: "size-5",
          panel: "p-5",
          select: "h-11 text-sm"
        }
      : {
          tab: "h-9 px-3.5 text-sm gap-2",
          icon: "size-4.5",
          panel: "p-4",
          select: "h-9 text-sm"
        };

  const tabStyle =
    pageControlStyle === "pills"
      ? {
          base: cn(
            "rounded-full border border-transparent text-muted-foreground",
            "hover:bg-muted/70 hover:text-foreground"
          ),
          active: "bg-primary text-primary-foreground border-primary shadow-sm",
          inactive: ""
        }
      : {
          base: cn(
            "rounded-t-md border-b-2 border-transparent text-muted-foreground",
            "hover:text-foreground hover:bg-muted/40"
          ),
          active: "border-primary text-primary bg-muted/30",
          inactive: ""
        };

  return (
    <div className={cn("w-full", className)} style={style}>
      {mobilePageControl === "select" && visiblePages.length > 0 ? (
        // Alternativa do celular: as abas viram um select nativo. Fica escondido a partir
        // do tablet, e a troca e feita por CSS (nao por media query em JS) para nao
        // depender do tamanho da janela na primeira renderizacao.
        <div className="mb-2 md:hidden">
          <select
            aria-label={resolvedAriaLabel}
            value={resolvedActiveId ?? ""}
            onChange={(event) => selectPage(event.target.value)}
            className={cn(
              "w-full rounded-md border border-border bg-background px-3 font-medium text-foreground",
              sizeClasses.select
            )}
          >
            {visiblePages.map((record) => (
              <option key={record.id} value={record.id} disabled={record.props.disabled}>
                {optionLabel(record)}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div
        role="tablist"
        ref={tabListRef}
        aria-label={resolvedAriaLabel}
        className={cn(
          "min-h-0 items-end gap-1 overflow-x-auto border-b border-border pb-0.5",
          // Um unico utilitario de display por breakpoint. Antes `flex` e `grid` saiam
          // juntos no mesmo elemento e quem vencia dependia da ordem no CSS gerado.
          mobilePageControl === "select" ? "hidden" : "flex",
          fullWidthTabs ? "md:grid md:auto-cols-fr md:grid-flow-col" : "md:flex",
          tabListClassName
        )}
        onKeyDown={(event) => {
          if (!keyboardNavigation || visiblePages.length === 0) return;
          const focused = document.activeElement as HTMLElement | null;
          const focusedIndex = tabsRef.current.findIndex((tab) => tab === focused);
          if (focusedIndex < 0) return;

          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            const nextIndex = (focusedIndex + 1) % visiblePages.length;
            tabsRef.current[nextIndex]?.focus();
            return;
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            const nextIndex = (focusedIndex - 1 + visiblePages.length) % visiblePages.length;
            tabsRef.current[nextIndex]?.focus();
            return;
          }
          if (event.key === "Home") {
            event.preventDefault();
            tabsRef.current[0]?.focus();
            return;
          }
          if (event.key === "End") {
            event.preventDefault();
            tabsRef.current[visiblePages.length - 1]?.focus();
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const record = visiblePages[focusedIndex];
            if (record) selectPage(record.id);
          }
        }}
      >
        {visiblePages.map((record, index) => {
          const isActive = record.id === resolvedActiveId;
          const tabId = `${rootId}-tab-${record.id}`;
          const panelId = `${rootId}-panel-${record.id}`;
          return (
            <button
              key={record.id}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              type="button"
              id={tabId}
              role="tab"
              aria-controls={panelId}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              title={record.props.hint}
              disabled={record.props.disabled}
              onClick={() => selectPage(record.id)}
              className={cn(
                "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-colors",
                sizeClasses.tab,
                tabStyle.base,
                isActive ? tabStyle.active : tabStyle.inactive,
                // No celular a lista e flex com rolagem: `w-full` faria cada aba ocupar a
                // largura toda do container.
                fullWidthTabs ? "md:w-full" : "",
                record.props.disabled ? "cursor-not-allowed opacity-45" : "",
                tabClassName,
                record.props.tabClassName
              )}
            >
              {record.props.icon ? (
                <span className={cn("inline-flex items-center justify-center", sizeClasses.icon)}>
                  {record.props.icon}
                </span>
              ) : null}
              <span className="truncate">{record.props.title}</span>
            </button>
          );
        })}
      </div>

      <div className={cn("rounded-b-md border border-t-0 border-border bg-background", panelClassName)}>
        {visiblePages.length === 0 ? (
          <div className={cn(sizeClasses.panel, "text-sm text-muted-foreground")}>{resolvedEmptyMessage}</div>
        ) : keepMounted ? (
          visiblePages.map((record) => {
            const isActive = record.id === resolvedActiveId;
            const tabId = `${rootId}-tab-${record.id}`;
            const panelId = `${rootId}-panel-${record.id}`;
            return (
              <div
                key={record.id}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                hidden={!isActive}
                style={record.props.style}
                className={cn(
                  sizeClasses.panel,
                  !isActive ? "hidden" : "",
                  record.props.className
                )}
              >
                {record.props.children}
              </div>
            );
          })
        ) : (
          <div
            id={`${rootId}-panel-${activePage?.id ?? "empty"}`}
            role="tabpanel"
            aria-labelledby={`${rootId}-tab-${activePage?.id ?? "empty"}`}
            style={activePage?.props.style}
            className={cn(sizeClasses.panel, activePage?.props.className)}
          >
            {activePage?.props.children}
          </div>
        )}
      </div>
    </div>
  );
}

SgPageControl.displayName = "SgPageControl";

export function SgPageControlPage(props: Readonly<SgPageControlPageProps>) {
  return <>{props.children}</>;
}

SgPageControlPage.displayName = "SgPageControlPage";
