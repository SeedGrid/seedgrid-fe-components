// Logica pura do SgNotificationBell (P129). Sem React, sem rede, sem relogio: tudo recebe o que precisa por
// parametro, para que o Flutter (notification_bell_logic.dart) produza exatamente o mesmo resultado. Os vetores de
// paridade sao gerados DESTE arquivo (seedgrid-fe-flutter/.../notification_bell_vectors/generate.mjs).
//
// Contrato das rotas: extension `user-notifications` (P130). O aviso do Pulse so traz identificadores; o historico
// (fonte de verdade) vem da API.

/** Item da caixa do usuario, como a API devolve. `payload` so tem identificadores. */
export type SgNotification = {
  publicId: string;
  /** Livre (ex.: `report.ready`); o sino nao interpreta, so mapeia para icone e acao. */
  type: string;
  title: string;
  message?: string | null;
  payload?: Record<string, unknown> | null;
  read: boolean;
  readAt?: string | null;
  /** ISO-8601 com offset. */
  createdAt: string;
  expiresAt?: string | null;
};

export const NOTIFICATIONS_CHANNEL = "user-notifications";
export const DEFAULT_EVENT_PATTERN = "user-notification.*";
export const DEFAULT_MAX_VISIBLE = 100;
export const BADGE_MAX = 99;
export const DEFAULT_POLL_INTERVAL_MS = 45000;
export const MIN_POLL_INTERVAL_MS = 30000;
export const MAX_POLL_INTERVAL_MS = 60000;
export const MAX_POLL_BACKOFF_MS = 300000;

/** ISO-8601 em ms. Frações além de 3 dígitos (microssegundos do servidor) são truncadas, igual nas duas plataformas. */
function time(iso: string): number {
  const t = Date.parse(iso.replace(/(\.\d{3})\d+/, "$1"));
  return Number.isNaN(t) ? 0 : t;
}

/** Mais nova primeiro; empate pelo `publicId` decrescente (como o servidor: ORDER BY created_at DESC, id DESC). */
export function sortNotifications(items: readonly SgNotification[]): SgNotification[] {
  return [...items].sort((a, b) => {
    const d = time(b.createdAt) - time(a.createdAt);
    if (d !== 0) return d;
    return a.publicId < b.publicId ? 1 : a.publicId > b.publicId ? -1 : 0;
  });
}

/** Teto da lista: de 1 a 100 (uma pagina da rota); sem valor ou invalido, 100. */
export function clampMaxVisible(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_MAX_VISIBLE;
  return Math.min(DEFAULT_MAX_VISIBLE, Math.max(1, Math.trunc(value)));
}

/** Vencida (`expiresAt` ate agora): o servidor nao as lista, o sino tambem nao as mostra. */
export function isExpired(item: SgNotification, now: string): boolean {
  return !!item.expiresAt && time(item.expiresAt) <= time(now);
}

/** Lista que o sino mostra: sem repetidos (vale o ultimo), sem vencidas (se `now` vier), ordenada, no maximo `max` itens. */
export function normalizeList(
  items: readonly SgNotification[],
  max: number = DEFAULT_MAX_VISIBLE,
  now?: string
): SgNotification[] {
  const byId = new Map<string, SgNotification>();
  for (const item of items) if (!now || !isExpired(item, now)) byId.set(item.publicId, item);
  return sortNotifications([...byId.values()]).slice(0, Math.max(0, max));
}

/** Contador mostrado: o do servidor (`GET /unread-count`) quando se sabe, senao as nao lidas da lista local. */
export function displayUnread(serverCount: number | null | undefined, items: readonly SgNotification[]): number {
  return typeof serverCount === "number" && serverCount >= 0 ? Math.trunc(serverCount) : unreadCount(items);
}

/** So conta as nao lidas. */
export function unreadCount(items: readonly SgNotification[]): number {
  return items.reduce((n, item) => (item.read ? n : n + 1), 0);
}

/** Texto do contador: vazio com zero, `99+` acima de 99. */
export function badgeText(count: number): string {
  const n = Math.trunc(count);
  if (!Number.isFinite(n) || n < 1) return "";
  return n > BADGE_MAX ? `${BADGE_MAX}+` : String(n);
}

export function markRead(items: readonly SgNotification[], publicId: string, readAt: string): SgNotification[] {
  return items.map((item) => (item.publicId === publicId && !item.read ? { ...item, read: true, readAt } : item));
}

export function markAllRead(items: readonly SgNotification[], readAt: string): SgNotification[] {
  return items.map((item) => (item.read ? item : { ...item, read: true, readAt }));
}

export function removeNotification(items: readonly SgNotification[], publicId: string): SgNotification[] {
  return items.filter((item) => item.publicId !== publicId);
}

/**
 * Itens nao lidos que chegaram de verdade: desconhecidos e mais novos que o mais novo da lista anterior (uma nao lida
 * antiga que so apareceu agora, por teto ou por reler, nao e noticia). Sao eles que fazem o sino animar.
 */
export function newUnread(previous: readonly SgNotification[], next: readonly SgNotification[]): SgNotification[] {
  const known = new Set(previous.map((item) => item.publicId));
  const newest = previous.reduce((max, item) => Math.max(max, time(item.createdAt)), Number.NEGATIVE_INFINITY);
  return next.filter((item) => !item.read && !known.has(item.publicId) && time(item.createdAt) >= newest);
}

/** `user-notification.*` casa `user-notification.created` e `user-notification.changed`. */
export function matchesEventPattern(pattern: string, event: string): boolean {
  if (pattern === "*" || pattern === event) return true;
  if (pattern.endsWith(".*")) return event.startsWith(pattern.slice(0, -1));
  return false;
}

/** O que fazer com um aviso do Pulse. */
export type SgNotificationEventPlan =
  | { action: "fetch"; publicId: string }
  | { action: "refresh" }
  | { action: "ignore" };

/**
 * `created` com o identificador: busca so a nova. `created` sem identificador e `changed` (ler, excluir, limpar em
 * outra aba): le a lista de novo. Outro canal ou evento fora do padrao: ignora.
 */
export function planEvent(pattern: string, channel: string, event: string, data: unknown): SgNotificationEventPlan {
  if (channel !== NOTIFICATIONS_CHANNEL || !matchesEventPattern(pattern, event)) return { action: "ignore" };
  if (event === "user-notification.created") {
    const id = data && typeof data === "object" ? (data as Record<string, unknown>).notificationPublicId : undefined;
    if (typeof id === "string" && id.length > 0) return { action: "fetch", publicId: id };
  }
  return { action: "refresh" };
}

/** Estado da conexao em tempo real (o mesmo do `SgRealtimeProvider`). */
export type SgNotificationStatus =
  | "idle"
  | "disabled"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "unavailable"
  | "auth-error";

/** Por que o polling foi acionado: realtime desligado na configuracao, ou Pulse fora do ar. */
export type SgPollingReason = "disabled" | "unavailable";

/**
 * Polling so quando nao ha tempo real nem esperanca de ter logo: `disabled` (enabled:false) e `unavailable` /
 * `auth-error` (Pulse fora do ar). Conectando ou reconectando, o SDK resolve sozinho.
 */
export function pollingReason(status: SgNotificationStatus): SgPollingReason | null {
  if (status === "disabled") return "disabled";
  if (status === "unavailable" || status === "auth-error") return "unavailable";
  return null;
}

/** Ao (re)conectar, le a lista uma vez para recuperar o que passou enquanto estava fora. */
export function shouldRefreshOnStatus(previous: SgNotificationStatus, next: SgNotificationStatus): boolean {
  return next === "connected" && previous !== "connected";
}

/** Intervalo pedido, preso entre 30 e 60 s (padrao 45 s). */
export function clampPollInterval(ms?: number | null): number {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return DEFAULT_POLL_INTERVAL_MS;
  return Math.min(MAX_POLL_INTERVAL_MS, Math.max(MIN_POLL_INTERVAL_MS, Math.round(ms)));
}

/**
 * Espera ate a proxima consulta: intervalo, dobrado a cada falha seguida (ate 5 min), com jitter de -10% a +10%, e nunca acima de 5 min (o teto vale depois do jitter).
 * `random` entra de fora (0 a 1) para o resultado ser testavel.
 */
export function nextPollDelay(baseMs: number | null | undefined, failures: number, random: number): number {
  const base = clampPollInterval(baseMs);
  const doublings = Number.isFinite(failures) ? Math.min(Math.max(0, Math.trunc(failures)), 6) : 0;
  const backoff = Math.min(base * 2 ** doublings, MAX_POLL_BACKOFF_MS);
  const r = Number.isFinite(random) ? Math.min(1, Math.max(0, random)) : 0.5;
  return Math.min(MAX_POLL_BACKOFF_MS, Math.round(backoff * (0.9 + 0.2 * r)));
}

/** Metrica do polling, exposta por `onPollingTick`. */
export type SgPollingStats = { count: number; lastAt: string | null; reason: SgPollingReason | null };

export const EMPTY_POLLING_STATS: SgPollingStats = { count: 0, lastAt: null, reason: null };

export function recordPollingTick(stats: SgPollingStats, at: string, reason: SgPollingReason): SgPollingStats {
  return { count: stats.count + 1, lastAt: at, reason };
}

export type SgNotificationViewState = "loading" | "error" | "empty" | "caughtUp" | "list";

/**
 * Qual das telas mostrar. Com erro e lista ja carregada, a lista continua (a falha vira aviso); sem nada para
 * mostrar, erro vence vazio.
 */
export function viewState(input: { loaded: boolean; failed: boolean; count: number; unreadOnly?: boolean }): SgNotificationViewState {
  if (input.count > 0) return "list";
  if (input.failed) return "error";
  if (!input.loaded) return "loading";
  return input.unreadOnly ? "caughtUp" : "empty";
}

/** O que a lista mostra: em "Nao lidas" so as ainda nao clicadas; em "Todas", tudo. */
export function visibleItems(items: readonly SgNotification[], unreadOnly: boolean): SgNotification[] {
  return unreadOnly ? items.filter((n) => !n.read) : [...items];
}

/** Query da lista: em "Nao lidas" pede so as nao lidas ao servidor (`unreadOnly=true`, que ja entra na ETag). */
export function listQuery(page: number, size: number, unreadOnly: boolean): string {
  return `?page=${page}&size=${size}${unreadOnly ? "&unreadOnly=true" : ""}`;
}

/** Clicou numa notificacao: em "Nao lidas" ela sai da lista; em "Todas" so perde o destaque. */
export function afterOpen(items: readonly SgNotification[], publicId: string, unreadOnly: boolean, readAt: string): SgNotification[] {
  return unreadOnly ? removeNotification(items, publicId) : markRead(items, publicId, readAt);
}

/** Valor inicial do interruptor: sem interruptor, o painel mostra tudo; com ele, vale `defaultUnreadOnly` (padrao true). */
export function initialUnreadOnly(showUnreadToggle?: boolean | null, defaultUnreadOnly?: boolean | null): boolean {
  if (showUnreadToggle === false) return false;
  return defaultUnreadOnly ?? true;
}

export type SgRelativeTime =
  | { unit: "now" }
  | { unit: "minute" | "hour" | "day"; value: number }
  | { unit: "date" };

/** Idade da notificacao em partes; o texto ("ha 5 min") e do i18n de cada plataforma. */
/** Data que da para mostrar (um `createdAt` invalido nao vira 1970 na tela). */
export function isValidInstant(iso: string): boolean {
  return !Number.isNaN(Date.parse(iso.replace(/(.d{3})d+/, "$1")));
}

export function relativeTime(createdAt: string, now: string): SgRelativeTime {
  if (!isValidInstant(createdAt) || !isValidInstant(now)) return { unit: "date" };
  const seconds = Math.floor((time(now) - time(createdAt)) / 1000);
  if (seconds < 60) return { unit: "now" };
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return { unit: "minute", value: minutes };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { unit: "hour", value: hours };
  const days = Math.floor(hours / 24);
  if (days < 7) return { unit: "day", value: days };
  return { unit: "date" };
}

/** De que lado do sino o painel abre (os mesmos valores do SgPopup). `auto` escolhe o lado em que cabe. */
export type SgNotificationPlacement = "auto" | "top" | "right" | "bottom" | "left";

export type SgPanelSide = Exclude<SgNotificationPlacement, "auto">;

export type SgPanelPosition = { top: number; left: number; side: SgPanelSide; maxHeight: number };

/** Largura do painel (26rem) e altura maxima (32rem), em px. */
export const PANEL_WIDTH = 416;
export const PANEL_MAX_HEIGHT = 512;

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, Math.max(min, max)));
}

/**
 * Onde o painel fica, em coordenadas da janela, sem sair dela. `auto` tenta embaixo, em cima, a direita e a esquerda
 * (nessa ordem) e fica com o primeiro lado em que o painel cabe inteiro; se nenhum couber, usa embaixo ou em cima,
 * o que tiver mais espaco. O lado forcado (`top`, `right`...) e respeitado. O painel se alinha ao fim do sino e e
 * empurrado para dentro da janela. `panelHeight` e a altura real do painel (ate PANEL_MAX_HEIGHT).
 */
export function panelPosition(
  anchor: { left: number; top: number; right: number; bottom: number },
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  placement: SgNotificationPlacement = "auto",
  offset = 8,
  padding = 8
): SgPanelPosition {
  const width = Math.min(panel.width, viewport.width - padding * 2);
  const height = Math.min(panel.height, PANEL_MAX_HEIGHT, viewport.height - padding * 2);
  const space = {
    top: anchor.top - padding,
    bottom: viewport.height - anchor.bottom - padding,
    left: anchor.left - padding,
    right: viewport.width - anchor.right - padding
  };
  const fits = {
    bottom: space.bottom >= height + offset,
    top: space.top >= height + offset,
    right: space.right >= width + offset,
    left: space.left >= width + offset
  };
  let side: SgPanelSide;
  if (placement !== "auto") side = placement;
  else if (fits.bottom) side = "bottom";
  else if (fits.top) side = "top";
  else if (fits.right) side = "right";
  else if (fits.left) side = "left";
  else side = space.bottom >= space.top ? "bottom" : "top";

  let top: number;
  let left: number;
  if (side === "bottom" || side === "top") {
    left = clampNumber(anchor.right - width, padding, viewport.width - width - padding);
    top = side === "bottom" ? anchor.bottom + offset : anchor.top - offset - height;
  } else {
    top = clampNumber(anchor.top, padding, viewport.height - height - padding);
    left = side === "right" ? anchor.right + offset : anchor.left - offset - width;
  }
  top = clampNumber(top, padding, viewport.height - height - padding);
  left = clampNumber(left, padding, viewport.width - width - padding);
  return { top: Math.round(top), left: Math.round(left), side, maxHeight: Math.round(height) };
}
