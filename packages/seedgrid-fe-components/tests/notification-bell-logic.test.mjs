import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// P129 - SgNotificationBell, logica pura. Os vetores sao gerados DESTE codigo pelo repo Flutter; o teste confirma
// que o React ainda produz o gravado (se o repo irmao nao estiver ao lado, e' pulado).
const require = createRequire(import.meta.url);
const L = require("../dist/notifications/notificationBellLogic.js");

const VECTORS = join(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_components", "test", "widgets", "notification_bell_vectors", "vectors.json");
const available = existsSync(VECTORS);
const V = available ? JSON.parse(readFileSync(VECTORS, "utf8")) : null;
const num = (v) => (v === "NaN" ? Number.NaN : v === "Infinity" ? Number.POSITIVE_INFINITY : v);
const ids = (l) => l.map((i) => i.publicId);

test("vetores compartilhados: React produz exatamente o que foi gravado", { skip: !available }, () => {
  for (const c of V.sort) assert.deepEqual(ids(L.sortNotifications(c.items)), c.out);
  for (const c of V.normalize) assert.deepEqual(L.normalizeList(c.items, c.max), c.out);
  for (const c of V.micros) assert.deepEqual(ids(L.sortNotifications(c.items)), c.out);
  for (const c of V.expired) assert.deepEqual(ids(L.normalizeList(c.items, c.max, c.now)), c.out);
  for (const c of V.display) assert.equal(L.displayUnread(c.server, c.items), c.out);
  for (const c of V.clamp) assert.equal(L.clampMaxVisible(c.value === "NaN" ? Number.NaN : c.value), c.out);
  for (const c of V.unread) assert.equal(L.unreadCount(c.items), c.out);
  for (const c of V.badge) assert.equal(L.badgeText(num(c.count)), c.out);
  for (const c of V.uuidTie) assert.deepEqual(ids(L.sortNotifications(c.items)), c.out);
  for (const c of V.invalid) assert.deepEqual(ids(L.sortNotifications(c.items)), c.out);
  for (const c of V.valid) assert.equal(L.isValidInstant(c.iso), c.out);
  for (const c of V.read) assert.deepEqual(L.markRead(c.items, c.id, c.at), c.out);
  for (const c of V.readAll) assert.deepEqual(L.markAllRead(c.items, c.at), c.out);
  for (const c of V.remove) assert.deepEqual(ids(L.removeNotification(c.items, c.id)), c.out);
  for (const c of V.newUnread) assert.deepEqual(ids(L.newUnread(c.previous, c.next)), c.out);
  for (const c of V.event) assert.deepEqual(L.planEvent(c.pattern, c.channel, c.event, c.data), c.out);
  for (const c of V.pollingReason) assert.equal(L.pollingReason(c.status), c.out);
  for (const c of V.refreshOnStatus) assert.equal(L.shouldRefreshOnStatus(c.previous, c.next), c.out);
  for (const c of V.interval) assert.equal(L.clampPollInterval(c.ms), c.out);
  for (const c of V.delay) assert.equal(L.nextPollDelay(c.base, num(c.failures), num(c.random)), c.out);
  for (const c of V.pollingStats) assert.deepEqual(L.recordPollingTick(c.before, c.at, c.reason), c.out);
  for (const c of V.view) assert.equal(L.viewState({ loaded: c.loaded, failed: c.failed, count: c.count, unreadOnly: c.unreadOnly }), c.out);
  for (const c of V.unreadMode.visible) assert.deepEqual(L.visibleItems(c.items, c.unreadOnly).map((i) => i.publicId), c.out);
  for (const c of V.unreadMode.query) assert.equal(L.listQuery(c.page, c.size, c.unreadOnly), c.out);
  for (const c of V.unreadMode.open) assert.deepEqual(L.afterOpen(c.items, c.id, c.unreadOnly, c.readAt), c.out);
  for (const c of V.unreadMode.initial) assert.equal(L.initialUnreadOnly(c.show ?? undefined, c.def ?? undefined), c.out);
  for (const c of V.relative) assert.deepEqual(L.relativeTime(c.createdAt, c.now), c.out);
  for (const c of V.panel) assert.deepEqual(L.panelPosition(c.anchor, c.panel, c.viewport, c.placement), c.out);
});

test("regras basicas independentes dos vetores", () => {
  assert.equal(L.badgeText(0), "");
  assert.equal(L.badgeText(100), "99+");
  assert.ok(L.nextPollDelay(45000, 0, 0.5) === 45000);
  assert.ok(L.nextPollDelay(45000, 20, 1) <= 300000 * 1.1);
});
