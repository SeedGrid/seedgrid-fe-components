import * as React from "react";
import {
  SgButton,
  SgRealtimeProvider,
  useSgRealtimeEvent,
  useSgRealtimeStatus,
  type SgRealtimeEvent
} from "@seedgrid/fe-components";

// WebSocket de DEMONSTRACAO no papel do SeedGrid Pulse: nao toca a rede.
// Na aplicacao real, sem `connectOptions`: o provider conecta no Pulse de verdade.
class DemoPulseSocket {
  static current: DemoPulseSocket | null = null;
  readyState = 0;
  onopen: ((event: unknown) => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: ((event: { code: number; reason: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;

  constructor(public url: string) {
    DemoPulseSocket.current = this;
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.({});
      this.emit({ type: "connected", protocolVersion: 1, connectionId: "demo" });
    }, 300);
  }

  send(data: string) {
    const frame = JSON.parse(data);
    if (frame.type === "subscribe") {
      this.emit({ type: "subscribed", channels: frame.channels, groups: [], accountId: "demo" });
    }
  }

  close() {
    this.readyState = 3;
    this.onclose?.({ code: 1000, reason: "" });
  }

  emit(frame: unknown) {
    this.onmessage?.({ data: JSON.stringify(frame) });
  }

  /** O que o backend faz ao terminar o backup: publica para o usuario. */
  backupFinished(ok: boolean) {
    const id = `exp-${Date.now()}`;
    this.emit({
      type: "message",
      messageId: id,
      protocolVersion: 1,
      channel: "backup",
      event: ok ? "backup.finished.success" : "backup.finished.error",
      target: { user: "usuario-demo" },
      data: { exportPublicId: id, status: ok ? "DONE" : "FAILED" },
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      deliveryMode: "notification",
      requiresAck: false
    });
  }
}

// Na aplicacao real o provider chama a BFF (`/api/realtime/connect`); aqui o token e fixo.
const demoToken = async () => ({
  enabled: true,
  token: "pct_demo",
  expiresAt: Math.floor(Date.now() / 1000) + 300,
  connectUrl: "wss://pulse.demo/api/v1/connect"
});

function ExportsScreen() {
  const { status, connected } = useSgRealtimeStatus();
  const [notices, setNotices] = React.useState<SgRealtimeEvent[]>([]);

  useSgRealtimeEvent("backup", "backup.finished.*", (event) => {
    // Na tela real: recarregar a lista de exports pela API de sempre.
    setNotices((previous) => [event, ...previous].slice(0, 5));
  });

  return (
    <div className="space-y-3">
      <div className="text-sm">
        Status: <code>{status}</code> {connected ? "(sem polling)" : "(polling de reserva)"}
      </div>
      <div className="flex gap-2">
        <SgButton disabled={!connected} onClick={() => DemoPulseSocket.current?.backupFinished(true)}>
          Simular backup pronto
        </SgButton>
        <SgButton severity="danger" disabled={!connected} onClick={() => DemoPulseSocket.current?.backupFinished(false)}>
          Simular backup com falha
        </SgButton>
      </div>
      <ul className="space-y-1 text-sm">
        {notices.map((notice) => (
          <li key={notice.messageId}>
            <code>{notice.event}</code> — {JSON.stringify(notice.data)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RealtimeSimulator() {
  return (
    <SgRealtimeProvider
      channels={["backup"]}
      fetchToken={demoToken}
      connectOptions={{ webSocketImpl: DemoPulseSocket as never }}
    >
      <ExportsScreen />
    </SgRealtimeProvider>
  );
}
