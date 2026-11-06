import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

// P129 - SgNotificationBell no DOM: contador, lista, abrir/ler, excluir, aviso do Pulse, estados e polling.
// A logica pura tem os vetores em notification-bell-logic.test.mjs.
const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgNotificationBell, SgRealtimeProvider } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

class FakePulseSocket {
  static instances = [];
  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.sent = [];
    FakePulseSocket.instances.push(this);
  }
  static get last() {
    return FakePulseSocket.instances.at(-1);
  }
  send(data) {
    this.sent.push(JSON.parse(data));
  }
  close() {
    this.readyState = 3;
  }
  emit(frame) {
    this.onmessage?.({ data: JSON.stringify(frame) });
  }
  handshake() {
    this.readyState = 1;
    this.onopen?.({});
    this.emit({ type: "connected", protocolVersion: 1, connectionId: "c1" });
  }
}

const TOKEN = { enabled: true, token: "t", expiresAt: 1791119100, connectUrl: "ws://pulse.test/api/v1/connect" };
const note = (id, createdAt, extra = {}) => ({
  publicId: id,
  type: "report.ready",
  title: "Titulo " + id,
  message: "Mensagem " + id,
  payload: null,
  read: false,
  readAt: null,
  createdAt,
  expiresAt: null,
  ...extra
});

/** API de mentira: guarda a caixa em memoria e registra as chamadas. */
function fakeApi(initial) {
  const state = { items: [...initial], calls: [], fail: false };
  const fetchImpl = async (url, init = {}) => {
    const method = init.method ?? "GET";
    state.calls.push(method + " " + url);
    const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
    if (state.fail) return json({}, 500);
    const path = String(url).split("?")[0];
    if (method === "GET") {
      const only = String(url).includes("unreadOnly=true");
      const list = only ? state.items.filter((i) => !i.read) : state.items;
      return json({ items: list, page: 0, size: 100, total: list.length });
    }
    if (method === "POST" && path.endsWith("/read-all")) {
      state.items = state.items.map((i) => ({ ...i, read: true }));
      return json({ updated: 1 });
    }
    if (method === "POST" && path.endsWith("/read")) {
      const id = path.split("/").at(-2);
      state.items = state.items.map((i) => (i.publicId === id ? { ...i, read: true } : i));
      return { ok: true, status: 204, json: async () => ({}) };
    }
    if (method === "DELETE" && path.endsWith("/api/user-notifications")) {
      state.items = [];
      return json({ deleted: 1 });
    }
    if (method === "DELETE") {
      const id = path.split("/").at(-1);
      state.items = state.items.filter((i) => i.publicId !== id);
      return { ok: true, status: 204, json: async () => ({}) };
    }
    return json({}, 404);
  };
  return { state, fetchImpl };
}

const recent = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString();
const NO_PULSE = (children) =>
  React.createElement(SgRealtimeProvider, { channels: ["user-notifications"], enabled: false }, children);

async function settle(times = 4) {
  for (let i = 0; i < times; i += 1) await flushDom();
}
const bell = (h) => h.document.querySelector("button[aria-haspopup]");
const click = async (h, el) => {
  await act(async () => {
    el.dispatchEvent(new h.window.MouseEvent("click", { bubbles: true }));
  });
  await settle();
};
const byLabel = (h, text) => [...h.document.querySelectorAll("button")].find((b) => (b.getAttribute("aria-label") ?? b.textContent).includes(text));

test("contador so conta as nao lidas, com 99+ e rotulo acessivel", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1)), note("b", recent(2), { read: true })]);
    globalThis.fetch = api.fetchImpl;
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, {})));
    await settle();
    assert.match(bell(h).getAttribute("aria-label"), /1 unread/);
    assert.equal(bell(h).textContent.trim(), "1");

    const many = Array.from({ length: 120 }, (_, i) => note("n" + String(i).padStart(3, "0"), recent(i + 1)));
    api.state.items = many;
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, {})));
    await settle();
    const labels = [...h.document.querySelectorAll("button[aria-haspopup]")].map((b) => b.textContent.trim());
    assert.ok(labels.includes("99+"), labels.join("|"));
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("abrir: marca como lida na API, chama onOpen do tipo e o global, e fecha", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1))]);
    globalThis.fetch = api.fetchImpl;
    const opened = [];
    await h.render(
      NO_PULSE(
        React.createElement(SgNotificationBell, {
          types: { "report.ready": { onOpen: (n) => opened.push("tipo:" + n.publicId) } },
          onOpen: (n) => opened.push("global:" + n.publicId)
        })
      )
    );
    await settle();
    await click(h, bell(h));
    assert.ok(h.document.querySelector('[role="dialog"]'));
    await click(h, byLabel(h, "Titulo a"));
    assert.deepEqual(opened, ["tipo:a", "global:a"]);
    assert.ok(api.state.calls.includes("POST /api/user-notifications/a/read"), api.state.calls.join(","));
    assert.equal(h.document.querySelector('[role="dialog"]'), null);
    assert.match(bell(h).getAttribute("aria-label"), /none unread/);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("excluir: chama DELETE, onNotificationDelete e tira da lista; marcar todas e limpar", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1)), note("b", recent(2))]);
    globalThis.fetch = api.fetchImpl;
    const deleted = [];
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, { defaultUnreadOnly: false, onNotificationDelete: (n) => deleted.push(n.publicId) })));
    await settle();
    await click(h, bell(h));
    await click(h, byLabel(h, "Delete notification: Titulo a"));
    assert.deepEqual(deleted, ["a"]);
    assert.ok(api.state.calls.includes("DELETE /api/user-notifications/a"));
    assert.equal(h.document.querySelectorAll("li").length, 1);

    await click(h, byLabel(h, "Mark all as read"));
    assert.ok(api.state.calls.includes("POST /api/user-notifications/read-all"));
    assert.match(bell(h).getAttribute("aria-label"), /none unread/);

    await click(h, byLabel(h, "Clear all"));
    assert.ok(api.state.calls.includes("DELETE /api/user-notifications"));
    assert.ok(h.document.body.textContent.includes("No notifications"));
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("aviso do Pulse: user-notification.created busca a nova, chama onNotification e avisa no aria-live", async () => {
  FakePulseSocket.instances = [];
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(5))]);
    globalThis.fetch = api.fetchImpl;
    const arrived = [];
    await h.render(
      React.createElement(
        SgRealtimeProvider,
        { channels: ["user-notifications"], fetchToken: async () => TOKEN, connectOptions: { webSocketImpl: FakePulseSocket } },
        React.createElement(SgNotificationBell, { onNotification: (n) => arrived.push(n.publicId) })
      )
    );
    await settle();
    const socket = FakePulseSocket.last;
    socket.handshake();
    await settle();
    socket.emit({ type: "subscribed", channels: ["user-notifications"], groups: [], accountId: "acc" });
    await settle();
    assert.match(bell(h).getAttribute("aria-label"), /1 unread/);

    api.state.items = [note("z", recent(0)), ...api.state.items];
    socket.emit({
      type: "message", messageId: "m1", protocolVersion: 1, channel: "user-notifications", event: "user-notification.created",
      target: { user: "u" }, data: { notificationPublicId: "z", type: "report.ready" }, createdAt: "2026-11-04T12:00:00Z",
      publishedAt: "2026-11-04T12:00:00Z", deliveryMode: "notification", requiresAck: false
    });
    await settle();
    assert.deepEqual(arrived, ["z"]);
    assert.match(bell(h).getAttribute("aria-label"), /2 unread/);
    assert.match(h.document.querySelector('[role="status"][aria-live="polite"]').textContent, /New notification: Titulo z/);

    // aviso de outro canal nao mexe
    const before = api.state.calls.length;
    socket.emit({
      type: "message", messageId: "m2", protocolVersion: 1, channel: "backup", event: "user-notification.created",
      target: { user: "u" }, data: { notificationPublicId: "q" }, createdAt: "2026-11-04T12:00:00Z",
      publishedAt: "2026-11-04T12:00:00Z", deliveryMode: "notification", requiresAck: false
    });
    await settle();
    assert.equal(api.state.calls.length, before);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("sem SgRealtimeProvider acima: o sino abre a propria conexao (autonomo)", async () => {
  FakePulseSocket.instances = [];
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([]);
    globalThis.fetch = async (url, init) => {
      if (String(url) === "/api/realtime/connect") return { ok: true, status: 200, json: async () => ({ enabled: false }) };
      return api.fetchImpl(url, init);
    };
    await h.render(React.createElement(SgNotificationBell, {}));
    await settle();
    assert.ok(api.state.calls.some((c) => c.startsWith("GET /api/user-notifications")));
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("estados: vazio e erro com 'Try again'", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([]);
    api.state.fail = true;
    globalThis.fetch = api.fetchImpl;
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, { defaultUnreadOnly: false })));
    await settle();
    await click(h, bell(h));
    assert.ok(h.document.querySelector('[role="alert"]'));
    api.state.fail = false;
    await click(h, byLabel(h, "Try again"));
    assert.ok(h.document.body.textContent.includes("No notifications"));
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("polling de reserva: Pulse desligado dispara onPollingTick com o motivo e conta as consultas", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  const realTimeout = globalThis.setTimeout;
  try {
    const api = fakeApi([note("a", recent(1))]);
    globalThis.fetch = api.fetchImpl;
    const ticks = [];
    // jsdom sem tela diz document.hidden = true; aqui a aba esta visivel
    Object.defineProperty(h.document, "hidden", { configurable: true, value: false });
    // o primeiro timer do polling (>= 27 s) dispara na hora; os demais seguem normais
    globalThis.setTimeout = (fn, ms, ...rest) => (ms >= 27000 ? realTimeout(fn, 0, ...rest) : realTimeout(fn, ms, ...rest));
    await h.render(
      React.createElement(
        SgRealtimeProvider,
        { channels: ["user-notifications"], fetchToken: async () => ({ enabled: false }) },
        React.createElement(SgNotificationBell, { onPollingTick: (s) => ticks.push(s) })
      )
    );
    await settle(8);
    globalThis.setTimeout = realTimeout;
    assert.ok(ticks.length >= 1, "houve ao menos uma consulta de polling");
    assert.equal(ticks[0].reason, "disabled");
    assert.equal(ticks[0].count, 1);
    assert.ok(typeof ticks[0].lastAt === "string");
  } finally {
    globalThis.setTimeout = realTimeout;
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("contador vem do GET /unread-count, nao so da lista local (teto)", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1))]);
    globalThis.fetch = async (url, init) => {
      if (String(url).endsWith("/unread-count")) return { ok: true, status: 200, json: async () => ({ count: 250 }) };
      return api.fetchImpl(url, init);
    };
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, {})));
    await settle();
    assert.equal(bell(h).textContent.trim(), "99+");
    assert.match(bell(h).getAttribute("aria-label"), /250 unread/);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("404 ao ler ou excluir: a notificacao ja nao existe e sai da lista, sem erro", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1)), note("b", recent(2))]);
    globalThis.fetch = async (url, init) => {
      if ((init?.method === "DELETE" || String(url).endsWith("/read")) && String(url).includes("/b")) return { ok: false, status: 404, json: async () => ({}) };
      return api.fetchImpl(url, init);
    };
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, {})));
    await settle();
    await click(h, bell(h));
    await click(h, byLabel(h, "Delete notification: Titulo b"));
    assert.equal(h.document.querySelectorAll("li").length, 1);
    assert.equal(h.document.querySelector('[role="alert"]'), null);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("provider acima que nao assina user-notifications: o sino abre a propria conexao", async () => {
  FakePulseSocket.instances = [];
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([]);
    globalThis.fetch = async (url, init) => {
      if (String(url) === "/api/realtime/connect") return { ok: true, status: 200, json: async () => TOKEN };
      return api.fetchImpl(url, init);
    };
    await h.render(
      React.createElement(
        SgRealtimeProvider,
        { channels: ["backup"], enabled: false },
        React.createElement(SgNotificationBell, { requestInit: {} })
      )
    );
    await settle(6);
    // sem provider proprio, o sino ficaria "disabled" e sem conexao; com o proprio, pediu o token
    assert.ok(api.state.calls.length >= 1);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("realtime/connect falhando (503): o provider tenta de novo e conecta quando volta", async () => {
  FakePulseSocket.instances = [];
  const h = setupDomHarness();
  const realTimeout = globalThis.setTimeout;
  try {
    let calls = 0;
    globalThis.setTimeout = (fn, ms, ...rest) => (ms >= 5000 ? realTimeout(fn, 0, ...rest) : realTimeout(fn, ms, ...rest));
    const Probe = () => React.createElement("span", { "data-testid": "s" }, "x");
    await h.render(
      React.createElement(
        SgRealtimeProvider,
        {
          channels: ["user-notifications"],
          fetchToken: async () => {
            calls += 1;
            if (calls === 1) throw new Error("HTTP 503");
            return TOKEN;
          },
          connectOptions: { webSocketImpl: FakePulseSocket }
        },
        React.createElement(Probe)
      )
    );
    await settle(8);
    assert.ok(calls >= 2, "pediu o token de novo");
    assert.ok(FakePulseSocket.instances.length >= 1, "abriu a conexao depois que o backend voltou");
  } finally {
    globalThis.setTimeout = realTimeout;
    h.restore();
  }
});

test("ETag/304: a releitura manda If-None-Match e, em 304, mantem a lista; ETag novo troca a lista", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    let version = 1;
    let items = [note("a", recent(1))];
    const seen = [];
    globalThis.fetch = async (url, init = {}) => {
      const method = init.method ?? "GET";
      const path = String(url).split("?")[0];
      if (method === "GET" && path.endsWith("/unread-count")) {
        return { ok: true, status: 200, json: async () => ({ count: items.filter((i) => !i.read).length }) };
      }
      if (method === "GET") {
        const sent = new Headers(init.headers).get("If-None-Match");
        seen.push(sent);
        const etag = 'W/"v' + version + '"';
        if (sent === etag) return { ok: false, status: 304, headers: new Headers({ ETag: etag }), json: async () => { throw new Error("304 nao tem corpo"); } };
        return { ok: true, status: 200, headers: new Headers({ ETag: etag }), json: async () => ({ items, page: 0, size: 100, total: items.length }) };
      }
      return { ok: true, status: 204, json: async () => ({}) };
    };
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, {})));
    await settle();
    assert.equal(bell(h).textContent.trim(), "1");
    assert.deepEqual(seen, [null]);

    // abrir o painel relê: o servidor responde 304 e a lista continua a mesma
    await click(h, bell(h));
    assert.equal(seen.at(-1), 'W/"v1"');
    assert.match(h.document.body.textContent, /Titulo a/);

    // a caixa mudou: ETag novo, 200 com a lista nova
    version = 2;
    items = [note("b", recent(0)), ...items];
    await click(h, bell(h));
    await click(h, bell(h));
    assert.equal(seen.at(-1), 'W/"v1"');
    assert.match(h.document.body.textContent, /Titulo b/);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("placement: auto abre embaixo e o lado forcado e respeitado; o painel e fixo na janela", async () => {
  for (const [placement, side] of [[undefined, "bottom"], ["top", "top"], ["left", "left"], ["right", "right"]]) {
    const h = setupDomHarness();
    const realFetch = globalThis.fetch;
    try {
      const api = fakeApi([note("a", recent(1))]);
      globalThis.fetch = api.fetchImpl;
      await h.render(NO_PULSE(React.createElement(SgNotificationBell, placement ? { placement } : {})));
      await settle();
      await click(h, bell(h));
      const panel = h.document.querySelector("[role=dialog]");
      assert.ok(panel, "painel aberto");
      assert.equal(panel.getAttribute("data-side"), side, String(placement));
      assert.match(panel.className, /\bfixed\b/);
      assert.equal(panel.style.visibility, "visible");
    } finally {
      globalThis.fetch = realFetch;
      h.restore();
    }
  }
});

const toggle = (h) => h.document.querySelector('input[id="sg-notification-unread-only"]');

test("interruptor Nao lidas: abre em Nao lidas, clicar remove da lista e baixa o contador, virar mostra todas", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1)), note("b", recent(2)), note("c", recent(3), { read: true })]);
    globalThis.fetch = api.fetchImpl;
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, { types: {} })));
    await settle();
    await click(h, bell(h));
    assert.ok(toggle(h), "interruptor presente");
    assert.equal(toggle(h).checked, true);
    assert.ok(api.state.calls.some((c) => c.includes("unreadOnly=true")), api.state.calls.join(","));
    assert.equal(h.document.querySelectorAll("li").length, 2);
    await click(h, byLabel(h, "Titulo a"));
    assert.match(bell(h).getAttribute("aria-label"), /1 unread/);
    await click(h, bell(h));
    assert.equal(h.document.querySelectorAll("li").length, 1);
    assert.ok(!h.document.body.textContent.includes("Titulo a"));
    await click(h, toggle(h));
    assert.equal(h.document.querySelectorAll("li").length, 3);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("interruptor Nao lidas: lista vazia mostra 'All caught up' e 'See all' mostra todas", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("c", recent(3), { read: true })]);
    globalThis.fetch = api.fetchImpl;
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, {})));
    await settle();
    await click(h, bell(h));
    assert.ok(h.document.body.textContent.includes("All caught up"));
    await click(h, byLabel(h, "See all"));
    assert.equal(toggle(h).checked, false);
    assert.equal(h.document.querySelectorAll("li").length, 1);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("showUnreadToggle=false esconde so o interruptor: o sino fica e o painel lista tudo", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1)), note("c", recent(3), { read: true })]);
    globalThis.fetch = api.fetchImpl;
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, { showUnreadToggle: false, defaultUnreadOnly: true })));
    await settle();
    assert.ok(bell(h));
    await click(h, bell(h));
    assert.equal(toggle(h), null);
    assert.equal(h.document.querySelectorAll("li").length, 2);
    assert.ok(!api.state.calls.some((c) => c.includes("unreadOnly=true")));
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});

test("defaultUnreadOnly=false: o painel abre em Todas, com o interruptor desligado", async () => {
  const h = setupDomHarness();
  const realFetch = globalThis.fetch;
  try {
    const api = fakeApi([note("a", recent(1)), note("c", recent(3), { read: true })]);
    globalThis.fetch = api.fetchImpl;
    await h.render(NO_PULSE(React.createElement(SgNotificationBell, { defaultUnreadOnly: false })));
    await settle();
    await click(h, bell(h));
    assert.equal(toggle(h).checked, false);
    assert.equal(h.document.querySelectorAll("li").length, 2);
  } finally {
    globalThis.fetch = realFetch;
    h.restore();
  }
});
