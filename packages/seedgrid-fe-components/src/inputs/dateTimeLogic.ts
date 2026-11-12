// Logica pura do SgInputDateTime (P132): conversao entre instante (ISO 8601 em UTC) e "relogio de parede" no
// fuso pedido, snap de minutos, validacao e texto de exibicao. Sem DOM: os vetores de paridade com o Flutter
// (`seedgrid_components/test/widgets/datetime_vectors`) sao gerados DESTE modulo.
//
// Fusos aceitos (`timeZone`): omitido ou "local" (o do navegador/dispositivo), "UTC", deslocamento fixo
// ("+03:00", "-0300", "+5:30") e, so no React, nome IANA ("America/Sao_Paulo"). O Flutter nao traz banco de
// fusos (sem dependencia nova): la nome IANA cai em "local" (ver DIVERGENCIAS_DO_REACT.md).

export type DateTimeErrorCode = "required" | "invalid" | "min" | "max" | "range";

const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const OFFSET_RE = /^([+-])(\d{1,2})(?::?(\d{2}))?$/;

function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}

/** Deslocamento fixo em minutos ("+03:00" => 180) ou null se nao for um deslocamento. */
export function parseFixedOffset(timeZone: string): number | null {
  const m = OFFSET_RE.exec(timeZone.trim());
  if (!m) return null;
  const minutes = Number(m[2]) * 60 + Number(m[3] ?? 0);
  if (Number(m[2]) > 14 || Number(m[3] ?? 0) > 59) return null;
  return (m[1] === "-" ? -1 : 1) * minutes;
}

function isLocalZone(timeZone?: string) {
  return !timeZone || timeZone.trim() === "" || timeZone.trim().toLowerCase() === "local";
}

/** Minutos a somar ao UTC para obter o relogio de parede de `instantMs` no fuso. */
export function zoneOffsetMinutes(instantMs: number, timeZone?: string): number {
  if (isLocalZone(timeZone)) return -new Date(instantMs).getTimezoneOffset();
  const tz = timeZone!.trim();
  if (tz.toUpperCase() === "UTC" || tz.toUpperCase() === "Z") return 0;
  const fixed = parseFixedOffset(tz);
  if (fixed !== null) return fixed;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).formatToParts(new Date(instantMs));
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    return Math.round((asUtc - Math.floor(instantMs / 1000) * 1000) / 60000);
  } catch {
    return -new Date(instantMs).getTimezoneOffset();
  }
}

function toMs(value: string | Date | undefined | null): number | null {
  if (value === undefined || value === null || value === "") return null;
  const ms = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/** Instante (ISO UTC ou Date) => "YYYY-MM-DDTHH:mm[:ss]" no fuso; "" se invalido/vazio. */
export function instantToWallClock(
  value: string | Date | undefined | null,
  timeZone?: string,
  showSeconds = false
): string {
  const ms = toMs(value);
  if (ms === null) return "";
  const shifted = new Date(ms + zoneOffsetMinutes(ms, timeZone) * 60000);
  const base = `${pad(shifted.getUTCFullYear(), 4)}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}`;
  return showSeconds ? `${base}:${pad(shifted.getUTCSeconds())}` : base;
}

/** "YYYY-MM-DDTHH:mm[:ss]" no fuso => ISO 8601 UTC ("...Z", ms = 000); null se invalido. */
export function wallClockToInstant(local: string, timeZone?: string): string | null {
  const m = LOCAL_RE.exec(local.trim());
  if (!m) return null;
  const [y, mo, d, h, mi] = [m[1], m[2], m[3], m[4], m[5]].map(Number) as [number, number, number, number, number];
  const s = Number(m[6] ?? 0);
  if (mo < 1 || mo > 12 || d < 1 || h > 23 || mi > 59 || s > 59) return null;
  const naive = Date.UTC(y, mo - 1, d, h, mi, s);
  if (new Date(naive).getUTCDate() !== d) return null; // 31/02 e afins
  // Resolve o deslocamento do fuso nesse relogio de parede (duas passadas cobrem a virada de horario de verao).
  let offset = zoneOffsetMinutes(naive, timeZone);
  let instant = naive - offset * 60000;
  const again = zoneOffsetMinutes(instant, timeZone);
  if (again !== offset) {
    offset = again;
    instant = naive - offset * 60000;
  }
  return new Date(instant).toISOString();
}

/**
 * Formato do valor entregue/aceito pelo campo: `local` (relogio de parede no fuso do campo, "2026-01-15T10:30"),
 * `utc` (instante em UTC, "2026-01-15T13:30:00Z") ou `offset` (relogio de parede com o deslocamento do fuso,
 * "2026-01-15T10:30:00-03:00").
 */
export type DateTimeValueMode = "local" | "utc" | "offset";

/** "+hh:mm" / "-hh:mm" a partir de minutos. */
function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/**
 * Relogio de parede do campo ("YYYY-MM-DDTHH:mm[:ss]", no fuso) => valor no formato pedido; `null` se vazio/invalido.
 * `local` devolve o proprio texto; `utc` e `offset` sempre com segundos.
 */
export function formatDateTimeValue(local: string, mode: DateTimeValueMode = "local", timeZone?: string): string | null {
  const text = local.trim();
  if (!text) return null;
  const instant = wallClockToInstant(text, timeZone);
  if (!instant) return null;
  if (mode === "local") return text;
  if (mode === "utc") return instant.replace(/\.\d{3}Z$/, "Z");
  const m = LOCAL_RE.exec(text)!;
  const wall = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}`;
  return `${wall}${formatOffset(zoneOffsetMinutes(new Date(instant).getTime(), timeZone))}`;
}

/**
 * Valor de qualquer formato (texto local sem fuso, ISO com "Z" ou deslocamento, `Date`) => relogio de parede no fuso do campo.
 * Texto sem fuso ("2026-01-15T10:30") ja e o relogio do campo e nao e convertido.
 */
export function parseDateTimeValue(value: string | Date | undefined | null, timeZone?: string, showSeconds = false): string {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string") {
    const m = LOCAL_RE.exec(value.trim());
    if (m) {
      const base = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
      return showSeconds ? `${base}:${m[6] ?? "00"}` : base;
    }
  }
  return instantToWallClock(value, timeZone, showSeconds);
}

/** Arredonda os minutos ao multiplo de `step` mais proximo (passo invalido ou <= 1 mantem o valor). */
export function snapMinutes(local: string, step?: number): string {
  const m = LOCAL_RE.exec(local.trim());
  if (!m || !step || !Number.isFinite(step) || step <= 1 || step > 60) return local;
  const minutes = Number(m[5]);
  let snapped = Math.round(minutes / step) * step;
  let hour = Number(m[4]);
  let dayShift = 0;
  if (snapped >= 60) {
    snapped = 0;
    hour += 1;
  }
  if (hour >= 24) {
    hour = 0;
    dayShift = 1;
  }
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + dayShift));
  const day = `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  return `${day}T${pad(hour)}:${pad(snapped)}${m[6] !== undefined ? `:${m[6]}` : ""}`;
}

export type DateTimeValidationInput = {
  required?: boolean;
  min?: string | Date;
  max?: string | Date;
  timeZone?: string;
};

/** Codigo do erro (null = valido). `local` e o texto do campo ("" = vazio). min/max sao instantes. */
export function validateDateTime(local: string, input: DateTimeValidationInput = {}): DateTimeErrorCode | null {
  if (!local) return input.required ? "required" : null;
  const instant = wallClockToInstant(local, input.timeZone);
  if (!instant) return "invalid";
  const ms = new Date(instant).getTime();
  const min = toMs(input.min);
  const max = toMs(input.max);
  const belowMin = min !== null && ms < min;
  const aboveMax = max !== null && ms > max;
  if (!belowMin && !aboveMax) return null;
  if (min !== null && max !== null) return "range";
  return belowMin ? "min" : "max";
}

/** Data no idioma (Intl.DateTimeFormat): pt-BR/pt-PT 05/11/2026, en-US 11/5/2026, es 5/11/2026, fr 05/11/2026. */
export function formatLocalizedDate(year: number, month: number, day: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { timeZone: "UTC", year: "numeric", month: "numeric", day: "numeric" }).format(
      new Date(Date.UTC(year, month - 1, day))
    );
  } catch {
    const two = (v: number) => String(v).padStart(2, "0");
    return `${two(day)}/${two(month)}/${year}`;
  }
}

/**
 * Texto de exibicao de um relogio de parede, no idioma ativo: a data vem do `Intl.DateTimeFormat` (pt-BR/pt-PT 05/11/2026,
 * en-US 11/5/2026, es 5/11/2026, fr 05/11/2026) e a hora e sempre 24h (HH:mm[:ss]), separadas por um espaco. Assim a saida
 * nao depende do separador que cada navegador usa entre data e hora, e o Flutter (`intl`) produz o mesmo texto.
 */
export function formatWallClock(local: string, locale: string, showSeconds = false): string {
  const m = LOCAL_RE.exec(local.trim());
  if (!m) return local;
  const time = `${m[4]}:${m[5]}${showSeconds ? `:${m[6] ?? "00"}` : ""}`;
  const date = formatLocalizedDate(Number(m[1]), Number(m[2]), Number(m[3]), locale);
  return `${date} ${time}`;
}
