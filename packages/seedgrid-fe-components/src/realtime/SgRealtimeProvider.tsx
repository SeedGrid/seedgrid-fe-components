"use client";

import React from "react";
import {
  PulseSubscriberClient,
  type ConnectInput,
  type ConnectionState,
  type PulseConnectToken,
  type PulseIncomingMessage
} from "@seedgrid/pulse-subscriber-react/core";

/**
 * Estado do realtime, do ponto de vista da tela:
 *
 * - `disabled`: o backend respondeu `{enabled:false}` (realtime desligado) — use o polling.
 * - `connecting` / `reconnecting`: ainda sem conexão — use o polling.
 * - `connected`: avisos chegando — dispense o polling.
 * - `unavailable`: o pedido de token falhou (401, 503, rede) ou a conexão caiu de vez — use o polling.
 * - `auth-error`: o Pulse recusou a credencial (chave revogada, 4403) — use o polling.
 */
export type SgRealtimeStatus = "idle" | "disabled" | "connecting" | "connected" | "reconnecting" | "unavailable" | "auth-error";

/** Resposta do `POST /realtime/connect` das extensões de realtime (Java e Rust). */
export type SgRealtimeConnectResponse = {
  enabled: boolean;
  token?: string;
  /** Segundos desde a época. */
  expiresAt?: number;
  connectUrl?: string;
  channels?: string[];
};

/** Aviso recebido. `data` só traz identificadores: busque o registro pela API de sempre. */
export type SgRealtimeEvent = {
  channel: string;
  event: string;
  data: unknown;
  messageId: string;
  publishedAt: string;
};

export type SgRealtimeProviderProps = {
  children: React.ReactNode;
  /** Channels que a tela quer ouvir (ex.: `["backup"]`). */
  channels: string[];
  /**
   * Rota que entrega o token de conexão do usuário logado. Default: `/api/realtime/connect` (a BFF, na
   * mesma origem — o navegador manda o cookie da sessão).
   */
  tokenEndpoint?: string;
  /** Opções do `fetch` do token (ex.: `headers: { Authorization: ... }` quando não há cookie). */
  tokenRequestInit?: RequestInit;
  /** Substitui o pedido de token inteiro (apps sem BFF, testes). */
  fetchToken?: () => Promise<SgRealtimeConnectResponse>;
  /** Endereço do Pulse, usado quando o token não traz `connectUrl` (Pulse sem endereço público). */
  pulseUrl?: string;
  /** Liga/desliga (ex.: `false` enquanto não há usuário logado). Default: `true`. */
  enabled?: boolean;
  /** Opções avançadas do cliente do Pulse (reconexão, `webSocketImpl` em testes...). */
  connectOptions?: Omit<ConnectInput, "getToken" | "accountKey" | "baseUrl">;
};

type Listener = (event: SgRealtimeEvent) => void;

type SgRealtimeContextValue = {
  status: SgRealtimeStatus;
  addListener: (listener: Listener) => () => void;
};

const SgRealtimeContext = React.createContext<SgRealtimeContextValue | null>(null);

const DEFAULT_TOKEN_ENDPOINT = "/api/realtime/connect";

function mapState(state: ConnectionState): SgRealtimeStatus {
  switch (state) {
    case "connected":
    case "subscribed":
      return "connected";
    case "connecting":
      return "connecting";
    case "reconnecting":
      return "reconnecting";
    case "auth-error":
      return "auth-error";
    case "idle":
      return "idle";
    default:
      return "unavailable";
  }
}

async function requestToken(endpoint: string, init?: RequestInit): Promise<SgRealtimeConnectResponse> {
  const response = await fetch(endpoint, { method: "POST", credentials: "same-origin", ...init });
  if (!response.ok) {
    throw new Error(`token de realtime indisponivel (HTTP ${response.status})`);
  }
  return (await response.json()) as SgRealtimeConnectResponse;
}

/**
 * Avisos em tempo real para o usuário logado, pelo SeedGrid Pulse.
 *
 * Monte uma vez (no layout) e ouça com {@link useSgRealtimeEvent}. Pede o token de conexão ao backend
 * (que o emite para o usuário DA SESSÃO), conecta direto no Pulse, reconecta sozinho e para se a
 * credencial for revogada. O token fica só em memória. Quando o realtime não está conectado,
 * {@link useSgRealtimeStatus} diz isso e a tela volta ao polling.
 */
export function SgRealtimeProvider({
  children,
  channels,
  tokenEndpoint = DEFAULT_TOKEN_ENDPOINT,
  tokenRequestInit,
  fetchToken,
  pulseUrl,
  enabled = true,
  connectOptions
}: SgRealtimeProviderProps) {
  const [status, setStatus] = React.useState<SgRealtimeStatus>("idle");
  const listenersRef = React.useRef(new Set<Listener>());

  // Lidos sempre o mais recente, sem reconectar a cada render.
  const optionsRef = React.useRef({ tokenEndpoint, tokenRequestInit, fetchToken, connectOptions });
  optionsRef.current = { tokenEndpoint, tokenRequestInit, fetchToken, connectOptions };

  const channelsKey = channels.join(",");

  React.useEffect(() => {
    if (typeof window === "undefined" || !enabled || channelsKey.length === 0) {
      setStatus(enabled ? "idle" : "disabled");
      return undefined;
    }

    let cancelled = false;
    const client = new PulseSubscriberClient();
    const getConnectResponse = () => {
      const { tokenEndpoint: endpoint, tokenRequestInit: init, fetchToken: custom } = optionsRef.current;
      return custom ? custom() : requestToken(endpoint, init);
    };
    const offState = client.onStateChange((state) => {
      if (!cancelled) setStatus(mapState(state));
    });
    const offMessage = client.onMessage((message: PulseIncomingMessage) => {
      const event: SgRealtimeEvent = {
        channel: message.channel,
        event: message.event,
        data: message.data,
        messageId: message.messageId,
        publishedAt: message.publishedAt
      };
      listenersRef.current.forEach((listener) => {
        try {
          listener(event);
        } catch {
          // Um handler com defeito não derruba os outros.
        }
      });
    });

    void (async () => {
      setStatus("connecting");
      let first: SgRealtimeConnectResponse;
      try {
        first = await getConnectResponse();
      } catch {
        if (!cancelled) setStatus("unavailable");
        return;
      }
      if (cancelled) return;
      if (!first.enabled || !first.token) {
        setStatus("disabled");
        return;
      }

      // O primeiro token já está em mãos; as reconexões pedem um novo (ele vale só para entrar).
      let pending: SgRealtimeConnectResponse | null = first;
      const getToken = async (): Promise<PulseConnectToken> => {
        const response = pending ?? (await getConnectResponse());
        pending = null;
        if (!response.enabled || !response.token) {
          throw new Error("realtime desligado");
        }
        return { token: response.token, expiresAt: response.expiresAt, connectUrl: response.connectUrl };
      };

      try {
        await client.connect({
          ...optionsRef.current.connectOptions,
          getToken,
          ...(pulseUrl ? { baseUrl: pulseUrl } : {})
        });
        if (cancelled) return;
        await client.subscribe({ channels: channelsKey.split(",") });
      } catch {
        // O estado já reflete a falha (onStateChange); a tela fica no polling.
      }
    })();

    return () => {
      cancelled = true;
      offState();
      offMessage();
      void client.disconnect().catch(() => undefined);
    };
  }, [enabled, channelsKey, pulseUrl]);

  const addListener = React.useCallback((listener: Listener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const value = React.useMemo(() => ({ status, addListener }), [status, addListener]);
  return <SgRealtimeContext.Provider value={value}>{children}</SgRealtimeContext.Provider>;
}

/** `backup.finished.*` casa `backup.finished.success` e `backup.finished.error`. */
export function matchesSgRealtimeEvent(pattern: string, event: string): boolean {
  if (pattern === "*" || pattern === event) return true;
  if (pattern.endsWith(".*")) {
    const prefix = pattern.slice(0, -1);
    return event.startsWith(prefix);
  }
  return false;
}

/**
 * Chama `handler` a cada aviso do `channel` cujo nome casa `events` (aceita `prefixo.*`). Fora de um
 * {@link SgRealtimeProvider}, não faz nada.
 */
export function useSgRealtimeEvent(
  channel: string,
  events: string | string[],
  handler: (event: SgRealtimeEvent) => void
): void {
  const context = React.useContext(SgRealtimeContext);
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;
  const patterns = Array.isArray(events) ? events.join("|") : events;

  React.useEffect(() => {
    if (!context) return undefined;
    const list = patterns.split("|");
    return context.addListener((event) => {
      if (event.channel === channel && list.some((pattern) => matchesSgRealtimeEvent(pattern, event.event))) {
        handlerRef.current(event);
      }
    });
  }, [context, channel, patterns]);
}

/** Estado do realtime. `connected` falso ⇒ a tela usa o polling de reserva. */
export function useSgRealtimeStatus(): { status: SgRealtimeStatus; connected: boolean } {
  const context = React.useContext(SgRealtimeContext);
  const status = context?.status ?? "disabled";
  return { status, connected: status === "connected" };
}
