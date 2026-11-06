"use client";

import React from "react";
import { Bell, Trash2 } from "lucide-react";
import { t, useComponentsI18n } from "../i18n";
import { SgBadge } from "../commons/SgBadge";
import { SgToggleSwitch } from "../inputs/SgToggleSwitch";
import {
  SgRealtimeProvider,
  type SgRealtimeConnectResponse,
  useHasSgRealtimeProvider,
  useSgRealtimeEvent,
  useSgRealtimeStatus
} from "../realtime/SgRealtimeProvider";
import {
  DEFAULT_EVENT_PATTERN,
  DEFAULT_MAX_VISIBLE,
  EMPTY_POLLING_STATS,
  NOTIFICATIONS_CHANNEL,
  badgeText,
  clampMaxVisible,
  afterOpen,
  displayUnread,
  initialUnreadOnly,
  listQuery,
  visibleItems,
  isValidInstant,
  markAllRead,
  newUnread,
  nextPollDelay,
  normalizeList,
  PANEL_MAX_HEIGHT,
  PANEL_WIDTH,
  panelPosition,
  planEvent,
  pollingReason,
  recordPollingTick,
  relativeTime,
  removeNotification,
  shouldRefreshOnStatus,
  viewState,
  type SgNotification,
  type SgNotificationPlacement,
  type SgNotificationStatus,
  type SgPanelPosition,
  type SgPollingStats
} from "./notificationBellLogic";

export type { SgNotification, SgNotificationPlacement, SgPollingStats } from "./notificationBellLogic";

/** Como um tipo de notificacao aparece (icone) e o que faz ao abrir. */
export type SgNotificationTypeConfig = {
  icon?: React.ReactNode;
  onOpen?: (notification: SgNotification) => void;
};

export type SgNotificationBellProps = {
  /** Base das rotas da extension `user-notifications`. Default: `/api/user-notifications` (BFF, mesma origem). */
  apiUrl?: string;
  /** Rota que entrega o token do Pulse (usada se nao houver `SgRealtimeProvider` acima). Default: `/api/realtime/connect`. */
  tokenEndpoint?: string;
  /** Opcoes do `fetch` (ex.: `headers: { Authorization }` quando nao ha cookie). */
  requestInit?: RequestInit;
  /** Substitui o `fetch` (apps sem BFF, testes, demonstracao). Default: `fetch` global. */
  fetcher?: (input: string, init?: RequestInit) => Promise<Response>;
  /** Tipo -> icone e acao ao abrir. O sino nao conhece o negocio: relatorio e so um tipo. */
  types?: Record<string, SgNotificationTypeConfig>;
  /** Evento do Pulse que dispara a leitura. Default: `user-notification.*`. */
  eventPattern?: string;
  /** Intervalo do polling de reserva (so com o Pulse desligado ou fora do ar), preso entre 30 e 60 s. Default: 45000. */
  pollIntervalMs?: number;
  /** Maximo de notificacoes na lista. Default e maximo: 100 (uma pagina da rota). */
  maxVisible?: number;
  /** De que lado do sino o painel abre (como o `placement` do SgPopup). `auto` escolhe o lado em que cabe. Default: `auto`. */
  placement?: SgNotificationPlacement;
  /** Mostra o interruptor "Nao lidas" no topo do painel. `false` esconde so o interruptor (o sino fica) e o painel lista tudo. Default: true. */
  showUnreadToggle?: boolean;
  /** O painel abre em "Nao lidas" (ainda nao clicadas). Ignorada com `showUnreadToggle=false`. Nao persiste entre recargas. Default: true. */
  defaultUnreadOnly?: boolean;
  /** Chegou uma notificacao nova (aviso do Pulse). */
  onNotification?: (notification: SgNotification) => void;
  /** O usuario excluiu uma notificacao. */
  onNotificationDelete?: (notification: SgNotification) => void;
  /** O usuario abriu uma notificacao (depois do `onOpen` do tipo). */
  onOpen?: (notification: SgNotification) => void;
  /** O polling consultou a API: contador, instante e motivo. Para medir o custo. */
  onPollingTick?: (stats: SgPollingStats) => void;
  className?: string;
};

type ListResponse = { items: SgNotification[]; page: number; size: number; total: number };

const DEFAULT_API_URL = "/api/user-notifications";
const PAGE_SIZE = 100;

function reducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function SgNotificationBellInner(props: Readonly<SgNotificationBellProps>) {
  const {
    apiUrl = DEFAULT_API_URL,
    requestInit,
    types,
    eventPattern = DEFAULT_EVENT_PATTERN,
    pollIntervalMs,
    placement = "auto",
    showUnreadToggle = true,
    className
  } = props;
  const maxVisible = clampMaxVisible(props.maxVisible);
  const i18n = useComponentsI18n();
  const { status } = useSgRealtimeStatus();

  const [items, setItems] = React.useState<SgNotification[]>([]);
  const [total, setTotal] = React.useState(0);
  /** Contador do servidor (GET /unread-count); a lista local pode estar limitada pelo teto. */
  const [serverUnread, setServerUnread] = React.useState<number | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [actionFailed, setActionFailed] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [unreadOnly, setUnreadOnly] = React.useState(() => initialUnreadOnly(props.showUnreadToggle, props.defaultUnreadOnly));
  const unreadOnlyRef = React.useRef(unreadOnly);
  unreadOnlyRef.current = unreadOnly;
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState<SgPanelPosition | null>(null);
  const [announce, setAnnounce] = React.useState("");

  const loadedRef = React.useRef(false);
  const notifiedRef = React.useRef(new Set<string>());
  const itemsRef = React.useRef<SgNotification[]>([]);
  itemsRef.current = items;
  const latest = React.useRef(props);
  latest.current = props;
  const bellRef = React.useRef<HTMLButtonElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const base = apiUrl.replace(/\/+$/, "");

  /** ETag fraca + corpo de cada pagina da lista (chave: query). Em 304 vale o corpo guardado. */
  const listCache = React.useRef(new Map<string, { etag: string; body: ListResponse }>());

  const request = React.useCallback(
    async (path: string, method: string, ifNoneMatch?: string): Promise<Response> => {
      const init: RequestInit = { credentials: "same-origin", ...latest.current.requestInit, method };
      if (ifNoneMatch) {
        const headers = new Headers(init.headers);
        headers.set("If-None-Match", ifNoneMatch);
        init.headers = headers;
      }
      const response = await (latest.current.fetcher ?? fetch)(base + path, init);
      if (response.status === 304 && ifNoneMatch) return response;
      if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
      return response;
    },
    [base]
  );

  const ring = React.useCallback(() => {
    const el = bellRef.current;
    if (!el || reducedMotion() || typeof el.animate !== "function") return;
    el.animate(
      [{ transform: "rotate(0)" }, { transform: "rotate(14deg)" }, { transform: "rotate(-12deg)" }, { transform: "rotate(8deg)" }, { transform: "rotate(0)" }],
      { duration: 700, easing: "ease-in-out" }
    );
  }, []);

  /** Le a lista (ate maxVisible, em paginas de 100). `announceNew`: chegou por aviso, entao anima e avisa. */
  const load = React.useCallback(
    async (opts?: { notifyId?: string; announceNew?: boolean; unreadOnly?: boolean }): Promise<boolean> => {
      try {
        const only = opts?.unreadOnly ?? unreadOnlyRef.current;
        const wanted = Math.max(1, maxVisible);
        const collected: SgNotification[] = [];
        let reported = 0;
        for (let page = 0; collected.length < wanted; page += 1) {
          const size = Math.min(PAGE_SIZE, wanted - collected.length);
          const query = listQuery(page, size, only);
          const cached = listCache.current.get(query);
          const response = await request(query, "GET", cached?.etag);
          let res: ListResponse;
          if (response.status === 304 && cached) {
            res = cached.body;
          } else {
            res = (await response.json()) as ListResponse;
            const etag = response.headers?.get?.("ETag");
            if (etag) listCache.current.set(query, { etag, body: res });
            else listCache.current.delete(query);
          }
          collected.push(...res.items);
          reported = res.total;
          if (res.items.length < size || collected.length >= reported) break;
        }
        let unreadFromServer: number | null = null;
        try {
          const body = (await (await request("/unread-count", "GET")).json()) as { count?: number };
          if (typeof body.count === "number") unreadFromServer = body.count;
        } catch {
          // sem o contador do servidor, vale a lista local
        }
        const previous = itemsRef.current;
        const next = normalizeList(collected, maxVisible, new Date().toISOString());
        const fresh = newUnread(previous, next);
        const wasLoaded = loadedRef.current;
        loadedRef.current = true;
        setServerUnread(unreadFromServer);
        setItems(next);
        setTotal(reported);
        setFailed(false);
        setLoaded(true);
        if (opts?.announceNew && wasLoaded && fresh.length > 0) {
          ring();
          setAnnounce(t(i18n, "components.notifications.bell.announce", { title: fresh[0]?.title ?? "" }));
        }
        if (opts?.notifyId) {
          const arrived = next.find((n) => n.publicId === opts.notifyId);
          if (arrived && !notifiedRef.current.has(arrived.publicId) && !previous.some((n) => n.publicId === arrived.publicId)) {
            notifiedRef.current.add(arrived.publicId);
            latest.current.onNotification?.(arrived);
          }
        }
        return true;
      } catch {
        setFailed(true);
        setLoaded(true);
        return false;
      }
    },
    [i18n, maxVisible, request, ring]
  );

  // Leitura inicial.
  React.useEffect(() => {
    void load();
  }, [load]);

  // Aviso do Pulse.
  useSgRealtimeEvent(NOTIFICATIONS_CHANNEL, eventPattern, (event) => {
    const plan = planEvent(eventPattern, event.channel, event.event, event.data);
    if (plan.action === "fetch") void load({ notifyId: plan.publicId, announceNew: true });
    else if (plan.action === "refresh") void load();
  });

  // Ao (re)conectar, le uma vez para recuperar o que passou.
  const previousStatus = React.useRef<SgNotificationStatus>(status);
  React.useEffect(() => {
    if (shouldRefreshOnStatus(previousStatus.current, status)) void load();
    previousStatus.current = status;
  }, [status, load]);

  // Polling de reserva: so com o Pulse desligado ou fora do ar; para com a aba oculta.
  const reason = pollingReason(status);
  const stats = React.useRef<SgPollingStats>(EMPTY_POLLING_STATS);
  React.useEffect(() => {
    if (!reason || typeof document === "undefined") return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;
    let stopped = false;
    let inFlight = false;
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
      if (stopped || document.hidden) return;
      timer = setTimeout(() => void tick(), nextPollDelay(pollIntervalMs, failures, Math.random()));
    };
    // Uma consulta por vez: trocar de aba durante uma consulta nao abre um segundo laco.
    const tick = async () => {
      if (inFlight || stopped) return;
      inFlight = true;
      if (timer) clearTimeout(timer);
      timer = undefined;
      try {
        stats.current = recordPollingTick(stats.current, new Date().toISOString(), reason);
        latest.current.onPollingTick?.(stats.current);
        failures = (await load({ announceNew: true })) ? 0 : failures + 1;
      } finally {
        inFlight = false;
      }
      schedule();
    };
    const onVisibility = () => {
      if (document.hidden) {
        if (timer) clearTimeout(timer);
        timer = undefined;
      } else {
        void tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    schedule();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reason, pollIntervalMs, request, load]);

  // Fecha com Esc e com clique fora.
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        bellRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  /** 404 em ler/excluir: a notificacao ja nao existe no servidor (outra aba, retencao); sai da lista local. */
  const act = async (fn: () => Promise<void>, target?: SgNotification) => {
    try {
      await fn();
      setActionFailed(false);
    } catch (error) {
      if (target && (error as { status?: number }).status === 404) {
        setItems((list) => removeNotification(list, target.publicId));
        setTotal((v) => Math.max(0, v - 1));
        if (!target.read) setServerUnread((v) => (v === null ? v : Math.max(0, v - 1)));
        setActionFailed(false);
      } else {
        setActionFailed(true);
      }
    }
  };

  const openItem = (n: SgNotification) =>
    act(async () => {
      if (!n.read) {
        await request(`/${encodeURIComponent(n.publicId)}/read`, "POST");
        setItems((list) => afterOpen(list, n.publicId, unreadOnlyRef.current, new Date().toISOString()));
        setServerUnread((v) => (v === null ? v : Math.max(0, v - 1)));
      }
      setOpen(false);
      types?.[n.type]?.onOpen?.(n);
      latest.current.onOpen?.(n);
    }, n);

  const deleteItem = (n: SgNotification) =>
    act(async () => {
      await request(`/${encodeURIComponent(n.publicId)}`, "DELETE");
      setItems((list) => removeNotification(list, n.publicId));
      setTotal((v) => Math.max(0, v - 1));
      if (!n.read) setServerUnread((v) => (v === null ? v : Math.max(0, v - 1)));
      latest.current.onNotificationDelete?.(n);
    }, n);

  const readAll = () =>
    act(async () => {
      await request("/read-all", "POST");
      setItems((list) => markAllRead(list, new Date().toISOString()));
      setServerUnread(0);
    });

  const clearAll = () =>
    act(async () => {
      await request("", "DELETE");
      setItems([]);
      setTotal(0);
      setServerUnread(0);
    });

  const shown = visibleItems(items, unreadOnly);
  const count = displayUnread(serverUnread, items);
  const view = viewState({ loaded, failed, count: shown.length, unreadOnly });

  const changeUnreadOnly = (checked: boolean) => {
    setUnreadOnly(checked);
    unreadOnlyRef.current = checked;
    void load({ unreadOnly: checked });
  };
  const now = new Date().toISOString();
  const ageText = (n: SgNotification) => {
    const r = relativeTime(n.createdAt, now);
    if (r.unit === "now") return t(i18n, "components.notifications.bell.now");
    if (r.unit === "minute") return t(i18n, "components.notifications.bell.minutes", { n: r.value });
    if (r.unit === "hour") return t(i18n, "components.notifications.bell.hours", { n: r.value });
    if (r.unit === "day") return t(i18n, "components.notifications.bell.days", { n: r.value });
    return isValidInstant(n.createdAt) ? new Date(n.createdAt).toLocaleDateString(i18n.locale) : "";
  };

  const bellLabel =
    count > 0
      ? t(i18n, "components.notifications.bell.unread", { count })
      : t(i18n, "components.notifications.bell.none");

  // Posicao do painel na janela: o lado vem de `placement`; `auto` escolhe onde cabe. Recalcula ao abrir, ao mudar a
  // lista, ao redimensionar e ao rolar.
  React.useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const place = () => {
      const anchor = bellRef.current?.getBoundingClientRect();
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const height = Math.min(panel.scrollHeight, PANEL_MAX_HEIGHT);
      setPosition(
        panelPosition(
          anchor,
          { width: Math.min(PANEL_WIDTH, panel.offsetWidth || PANEL_WIDTH), height },
          { width: window.innerWidth, height: window.innerHeight },
          placement
        )
      );
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, placement, items.length, loaded, failed]);

  return (
    <div ref={rootRef} className={["relative inline-block", className].filter(Boolean).join(" ")}>
      <button
        ref={bellRef}
        type="button"
        aria-label={bellLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (!open) void load();
          setOpen((v) => !v);
        }}
        className="relative inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted/60 focus-visible:outline focus-visible:outline-2"
      >
        <Bell className="size-5" aria-hidden="true" />
        {count > 0 ? (
          <span className="pointer-events-none absolute right-1 top-1">
            <SgBadge value={badgeText(count)} severity="danger" size="xs" rounded />
          </span>
        ) : null}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {announce}
      </span>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t(i18n, "components.notifications.bell.label")}
          data-side={position?.side}
          style={{ top: position?.top ?? 0, left: position?.left ?? 0, maxHeight: position?.maxHeight ?? PANEL_MAX_HEIGHT, visibility: position ? "visible" : "hidden" }}
          className="fixed z-50 flex w-[min(26rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">{t(i18n, "components.notifications.bell.label")}</span>
              {count > 0 ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                  {t(i18n, "components.notifications.bell.news", { count })}
                </span>
              ) : null}
            </div>
            {count > 0 ? (
              <button type="button" onClick={() => void readAll()} className="min-h-11 px-1 text-sm font-medium text-primary">
                {t(i18n, "components.notifications.bell.markAll")}
              </button>
            ) : null}
          </div>

          {showUnreadToggle ? (
            <div className="flex items-center border-b border-border px-4 py-1">
              <SgToggleSwitch
                id="sg-notification-unread-only"
                label={t(i18n, "components.notifications.bell.unreadOnly")}
                checked={unreadOnly}
                onChange={changeUnreadOnly}
              />
            </div>
          ) : null}

          {actionFailed ? (
            <div role="alert" className="border-b border-border px-4 py-2 text-sm text-destructive">
              {t(i18n, "components.notifications.bell.actionFailed")}
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {view === "loading" ? (
              <div role="status" className="px-4 py-6 text-center text-sm text-muted-foreground">
                {t(i18n, "components.notifications.bell.loading")}
              </div>
            ) : null}
            {view === "error" ? (
              <div role="alert" className="flex flex-col items-center gap-2 px-4 py-6 text-center text-sm">
                <span>{t(i18n, "components.notifications.bell.error")}</span>
                <button type="button" onClick={() => void load()} className="min-h-11 px-3 font-medium text-primary">
                  {t(i18n, "components.notifications.bell.retry")}
                </button>
              </div>
            ) : null}
            {view === "empty" ? (
              <div className="px-4 py-8 text-center">
                <div className="text-sm font-medium">{t(i18n, "components.notifications.bell.empty")}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t(i18n, "components.notifications.bell.emptyHint")}</div>
              </div>
            ) : null}
            {view === "caughtUp" ? (
              <div className="px-4 py-8 text-center">
                <div className="text-sm font-medium">{t(i18n, "components.notifications.bell.caughtUp")}</div>
                <button type="button" onClick={() => changeUnreadOnly(false)} className="mt-1 min-h-11 px-3 text-sm font-medium text-primary">
                  {t(i18n, "components.notifications.bell.seeAll")}
                </button>
              </div>
            ) : null}
            {view === "list" ? (
              <ul className="m-0 list-none p-0">
                {shown.map((n) => (
                  <li
                    key={n.publicId}
                    data-unread={n.read ? "false" : "true"}
                    className={["flex items-start gap-3 border-b border-border px-4 py-3", n.read ? "" : "bg-muted/40"].join(" ")}
                  >
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      {types?.[n.type]?.icon ?? <Bell className="size-4" aria-hidden="true" />}
                    </span>
                    <button type="button" onClick={() => void openItem(n)} className="min-w-0 flex-1 text-left">
                      <span className={["block truncate text-sm", n.read ? "font-medium" : "font-semibold"].join(" ")}>{n.title}</span>
                      {n.message ? <span className="block text-sm text-muted-foreground">{n.message}</span> : null}
                      <span className="mt-1 block text-xs text-muted-foreground">{ageText(n)}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={t(i18n, "components.notifications.bell.delete", { title: n.title })}
                      onClick={() => void deleteItem(n)}
                      className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {view === "list" ? (
            <div className="flex items-center justify-between border-t border-border px-4">
              <span className="text-xs text-muted-foreground">
                {t(i18n, "components.notifications.bell.footer", { shown: shown.length, total: Math.max(total, shown.length) })}
              </span>
              <button type="button" onClick={() => void clearAll()} className="min-h-11 px-1 text-sm font-medium text-destructive">
                {t(i18n, "components.notifications.bell.clear")}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Sino de notificacoes do usuario logado (P129). Autonomo: se nao houver `SgRealtimeProvider` acima, abre a propria
 * conexao com o Pulse (token por `tokenEndpoint`, nunca a apikey no front); com o Pulse desligado ou fora do ar, faz
 * polling de reserva. Sem regra de negocio: o que cada `type` mostra e faz vem de `types`.
 */
export function SgNotificationBell(props: Readonly<SgNotificationBellProps>) {
  const hasProvider = useHasSgRealtimeProvider(NOTIFICATIONS_CHANNEL);
  const { fetcher, tokenEndpoint = "/api/realtime/connect", requestInit } = props;
  const fetchToken = React.useMemo(
    () =>
      fetcher
        ? async () => {
            const response = await fetcher(tokenEndpoint, { credentials: "same-origin", ...requestInit, method: "POST" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return (await response.json()) as SgRealtimeConnectResponse;
          }
        : undefined,
    [fetcher, tokenEndpoint, requestInit]
  );
  if (hasProvider) return <SgNotificationBellInner {...props} />;
  return (
    <SgRealtimeProvider channels={[NOTIFICATIONS_CHANNEL]} tokenEndpoint={tokenEndpoint} tokenRequestInit={requestInit} fetchToken={fetchToken}>
      <SgNotificationBellInner {...props} />
    </SgRealtimeProvider>
  );
}

SgNotificationBell.displayName = "SgNotificationBell";
