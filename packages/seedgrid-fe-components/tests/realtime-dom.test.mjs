import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return {
      extend() {
        return {
          configure() {
            return this;
          }
        };
      }
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

const { SgRealtimeProvider, useSgRealtimeEvent, useSgRealtimeStatus, matchesSgRealtimeEvent } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

/** WebSocket no papel do Pulse: nunca toca a rede; o teste dirige os quadros. */
class FakePulseSocket {
  static instances = [];

  constructor(url, protocols, options) {
    this.url = url;
    this.protocols = protocols;
    this.options = options;
    this.readyState = 0;
    this.sent = [];
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    FakePulseSocket.instances.push(this);
  }

  static get last() {
    return FakePulseSocket.instances.at(-1);
  }

  send(data) {
    this.sent.push(JSON.parse(data));
  }

  close(code = 1000, reason = "") {
    if (this.readyState === 3) return;
    this.readyState = 3;
    this.onclose?.({ code, reason });
  }

  emit(frame) {
    this.onmessage?.({ data: JSON.stringify(frame) });
  }

  handshake() {
    this.readyState = 1;
    this.onopen?.({});
    this.emit({ type: "connected", protocolVersion: 1, connectionId: "conn_1" });
  }

  serverClose(code, reason = "") {
    this.readyState = 3;
    this.onclose?.({ code, reason });
  }
}

const TOKEN = { enabled: true, token: "pct_token_de_teste", expiresAt: 1791119100, connectUrl: "ws://pulse.test/api/v1/connect" };

function message(channel, event, data) {
  return {
    type: "message",
    messageId: `msg_${event}`,
    protocolVersion: 1,
    channel,
    event,
    target: { user: "usuario-1" },
    data,
    createdAt: "2026-10-08T12:00:00Z",
    publishedAt: "2026-10-08T12:00:00Z",
    deliveryMode: "notification",
    requiresAck: false
  };
}

function Probe(props) {
  const { status } = useSgRealtimeStatus();
  useSgRealtimeEvent("backup", "backup.finished.*", (event) => props.received.push(event));
  return React.createElement("span", { "data-testid": "status" }, status);
}

function renderProvider(harness, fetchToken, received) {
  return harness.render(
    React.createElement(
      SgRealtimeProvider,
      { channels: ["backup"], fetchToken, connectOptions: { webSocketImpl: FakePulseSocket } },
      React.createElement(Probe, { received })
    )
  );
}

const statusOf = (harness) => harness.document.querySelector('[data-testid="status"]').textContent;

async function settle(times = 3) {
  for (let i = 0; i < times; i += 1) await flushDom();
}

test("conecta com o token do backend e entrega o aviso do channel ao handler", async () => {
  FakePulseSocket.instances = [];
  const harness = setupDomHarness();
  const received = [];
  try {
    await renderProvider(harness, async () => TOKEN, received);
    await settle();

    const socket = FakePulseSocket.last;
    assert.ok(socket, "abriu o WebSocket");
    assert.ok(socket.url.startsWith("ws://pulse.test/api/v1/connect"), socket.url);
    assert.ok(socket.url.includes("access_token=pct_token_de_teste"), "o token vai na query (o navegador nao manda header)");

    socket.handshake();
    await settle();
    assert.deepEqual(socket.sent.at(-1).channels, ["backup"]);
    socket.emit({ type: "subscribed", channels: ["backup"], groups: [], accountId: "acc_1" });
    await settle();
    assert.equal(statusOf(harness), "connected");

    socket.emit(message("backup", "backup.finished.success", { exportPublicId: "exp-1", status: "DONE" }));
    socket.emit(message("backup", "backup.started", {}));
    socket.emit(message("report", "backup.finished.success", {}));
    await settle();

    assert.equal(received.length, 1, "so o evento e o channel pedidos");
    assert.equal(received[0].event, "backup.finished.success");
    assert.deepEqual(received[0].data, { exportPublicId: "exp-1", status: "DONE" });
  } finally {
    harness.restore();
  }
});

test("realtime desligado no backend: status disabled e nenhuma conexao", async () => {
  FakePulseSocket.instances = [];
  const harness = setupDomHarness();
  try {
    await renderProvider(harness, async () => ({ enabled: false }), []);
    await settle();
    assert.equal(statusOf(harness), "disabled");
    assert.equal(FakePulseSocket.instances.length, 0);
  } finally {
    harness.restore();
  }
});

test("pedido de token falhando (401/503): status unavailable, a tela fica no polling", async () => {
  FakePulseSocket.instances = [];
  const harness = setupDomHarness();
  try {
    await renderProvider(harness, async () => {
      throw new Error("HTTP 503");
    }, []);
    await settle();
    assert.equal(statusOf(harness), "unavailable");
    assert.equal(FakePulseSocket.instances.length, 0);
  } finally {
    harness.restore();
  }
});

test("credencial revogada (4403): status auth-error, sem reconectar", async () => {
  FakePulseSocket.instances = [];
  const harness = setupDomHarness();
  let tokens = 0;
  try {
    await renderProvider(harness, async () => {
      tokens += 1;
      return TOKEN;
    }, []);
    await settle();
    FakePulseSocket.last.handshake();
    await settle();
    FakePulseSocket.last.serverClose(4403, "credential_revoked");
    await settle(5);
    assert.equal(statusOf(harness), "auth-error");
    assert.equal(FakePulseSocket.instances.length, 1, "nao reconecta");
    assert.equal(tokens, 1, "nao pede outro token");
  } finally {
    harness.restore();
  }
});

test("sem provider o status e disabled e o hook nao quebra", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(React.createElement(Probe, { received: [] }));
    assert.equal(statusOf(harness), "disabled");
  } finally {
    harness.restore();
  }
});

test("matchesSgRealtimeEvent aceita nome exato, prefixo.* e *", () => {
  assert.equal(matchesSgRealtimeEvent("backup.finished.*", "backup.finished.error"), true);
  assert.equal(matchesSgRealtimeEvent("backup.finished.*", "backup.started"), false);
  assert.equal(matchesSgRealtimeEvent("backup.finished.success", "backup.finished.success"), true);
  assert.equal(matchesSgRealtimeEvent("*", "qualquer"), true);
  assert.equal(matchesSgRealtimeEvent("backup.finished.success", "backup.finished.error"), false);
});
