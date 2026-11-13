// API de demonstracao do SgNotificationBell: guarda a caixa em memoria e responde as mesmas rotas da extension
// user-notifications. Numa aplicacao real nao existe: o sino usa o fetch e o `apiUrl` do backend.
import type React from "react";
import type { SgNotification, SgRealtimeProvider } from "@seedgrid/fe-components";

export type DemoFetcher = ((input: string, init?: RequestInit) => Promise<Response>) & {
  /** Cria uma notificacao nova (como se o backend a tivesse gravado). */
  notify: (type: string, title: string, message: string) => string;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

export type DemoSeedText = {
  reportTitle: string; reportMessage: string;
  backupTitle: string; backupMessage: string;
  inviteTitle: string; inviteMessage: string;
};

const DEFAULT_SEED_TEXT: DemoSeedText = {
  reportTitle: "Relatório de vendas pronto", reportMessage: "O relatório de outubro terminou de gerar.",
  backupTitle: "Backup concluído", backupMessage: "O backup diário terminou sem erros.",
  inviteTitle: "Convite aceito", inviteMessage: "Marina entrou na sua equipe."
};

export function createDemoFetcher(seed: boolean = true, text: DemoSeedText = DEFAULT_SEED_TEXT): DemoFetcher {
  let counter = 0;
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();
  let items: SgNotification[] = seed
    ? [
        { publicId: "demo-1", type: "report.ready", title: text.reportTitle, message: text.reportMessage, read: false, createdAt: minutesAgo(2) },
        { publicId: "demo-2", type: "backup.finished", title: text.backupTitle, message: text.backupMessage, read: false, createdAt: minutesAgo(18) },
        { publicId: "demo-3", type: "invite.accepted", title: text.inviteTitle, message: text.inviteMessage, read: true, createdAt: minutesAgo(1500) }
      ]
    : [];

  const fetcher = (async (input: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    const path = input.split("?")[0] ?? "";
    if (path.endsWith("/realtime/connect")) return json({ enabled: false });
    if (method === "GET") {
      const list = input.includes("unreadOnly=true") ? items.filter((item) => !item.read) : items;
      return json({ items: list, page: 0, size: 100, total: list.length });
    }
    if (method === "POST" && path.endsWith("/read-all")) {
      items = items.map((item) => ({ ...item, read: true }));
      return json({ updated: items.length });
    }
    if (method === "POST" && path.endsWith("/read")) {
      const id = path.split("/").at(-2);
      items = items.map((item) => (item.publicId === id ? { ...item, read: true } : item));
      return new Response(null, { status: 204 });
    }
    if (method === "DELETE" && path.endsWith("/user-notifications")) {
      const deleted = items.length;
      items = [];
      return json({ deleted });
    }
    if (method === "DELETE") {
      const id = path.split("/").at(-1);
      items = items.filter((item) => item.publicId !== id);
      return new Response(null, { status: 204 });
    }
    return json({}, 404);
  }) as DemoFetcher;

  fetcher.notify = (type, title, message) => {
    counter += 1;
    const publicId = `demo-new-${counter}`;
    items = [{ publicId, type, title, message, read: false, createdAt: new Date().toISOString() }, ...items];
    return publicId;
  };
  return fetcher;
}

/** Resposta do token do Pulse da demonstracao (o servidor de verdade e o BFF; aqui nao ha servidor). */
export const demoPulseToken = async () => ({
  enabled: true,
  token: "demo",
  expiresAt: Math.floor(Date.now() / 1000) + 3600,
  connectUrl: "ws://demo.local/pulse"
});

/**
 * Pulse de mentira: um WebSocket que fala o protocolo do Pulse dentro da pagina (conecta, assina e entrega o que
 * `publish` mandar). Assim o aviso "chegou notificacao" aparece na hora, como com o Pulse de verdade.
 */
export function createDemoPulse() {
  const sockets = new Set<DemoSocket>();
  class DemoSocket {
    readyState = 0;
    onopen: ((event: unknown) => void) | null = null;
    onmessage: ((event: { data: string }) => void) | null = null;
    onclose: ((event: unknown) => void) | null = null;
    onerror: ((event: unknown) => void) | null = null;
    constructor(_url: string) {
      sockets.add(this);
      queueMicrotask(() => {
        this.readyState = 1;
        this.onopen?.({});
        this.emit({ type: "connected", protocolVersion: 1, connectionId: "demo" });
      });
    }
    send(data: string) {
      const frame = JSON.parse(data) as { type?: string; channels?: string[] };
      if (frame.type === "subscribe") this.emit({ type: "subscribed", channels: frame.channels ?? [], groups: [], accountId: "demo" });
    }
    close() {
      this.readyState = 3;
      sockets.delete(this);
    }
    emit(frame: unknown) {
      this.onmessage?.({ data: JSON.stringify(frame) });
    }
  }
  let sequence = 0;
  return {
    webSocketImpl: DemoSocket as unknown as NonNullable<NonNullable<React.ComponentProps<typeof SgRealtimeProvider>["connectOptions"]>["webSocketImpl"]>,
    /** Entrega um evento do canal `user-notifications` a quem estiver conectado. */
    publish(event: string, data: Record<string, unknown>) {
      sequence += 1;
      const now = new Date().toISOString();
      for (const socket of sockets) {
        socket.emit({
          type: "message", messageId: `demo-${sequence}`, protocolVersion: 1, channel: "user-notifications", event,
          target: { user: "demo" }, data, createdAt: now, publishedAt: now, deliveryMode: "notification", requiresAck: false
        });
      }
    }
  };
}
