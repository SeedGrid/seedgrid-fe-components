import * as React from "react";
import {
  SgButton,
  SgRealtimeProvider,
  useSgRealtimeEvent,
  useSgRealtimeStatus
} from "@seedgrid/fe-components";

// DEMO WebSocket standing in for SeedGrid Pulse: it never touches the network.
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

  /** O que o backend faz: publica um aviso no canal. */
  publish(channel: string, event: string) {
    const id = `msg-${Date.now()}`;
    this.emit({
      type: "message",
      messageId: id,
      protocolVersion: 1,
      channel,
      event,
      target: { user: "usuario-demo" },
      data: { id },
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      deliveryMode: "notification",
      requiresAck: false
    });
  }
}

const demoToken = async () => ({
  enabled: true,
  token: "pct_demo",
  expiresAt: Math.floor(Date.now() / 1000) + 300,
  connectUrl: "wss://pulse.demo/api/v1/connect"
});

function Listeners() {
  const { connected } = useSgRealtimeStatus();
  const [backups, setBackups] = React.useState(0);
  const [audits, setAudits] = React.useState(0);

  // Nome exato, lista e prefixo.* no canal "backup"; "*" no canal "audit".
  useSgRealtimeEvent("backup", ["backup.started", "backup.finished.*"], () => setBackups((n) => n + 1));
  useSgRealtimeEvent("audit", "*", () => setAudits((n) => n + 1));

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <SgButton enabled={connected} onClick={() => DemoPulseSocket.current?.publish("backup", "backup.finished.error")}>
        backup.finished.error
      </SgButton>
      <SgButton enabled={connected} onClick={() => DemoPulseSocket.current?.publish("backup", "backup.other")}>
        backup.other
      </SgButton>
      <SgButton enabled={connected} onClick={() => DemoPulseSocket.current?.publish("audit", "audit.login")}>
        audit.login
      </SgButton>
      <span>
        backup: {backups} | audit: {audits}
      </span>
    </div>
  );
}

export default function RealtimePatterns() {
  return (
    <SgRealtimeProvider
      channels={["backup", "audit"]}
      fetchToken={demoToken}
      connectOptions={{ webSocketImpl: DemoPulseSocket as never }}
    >
      <Listeners />
    </SgRealtimeProvider>
  );
}
