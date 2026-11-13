// Traducao dos textos do bloco "IA-ready" (descricao, casos de uso, descricao de props).
// A chave do dicionario e o proprio texto em PT do manifesto (sem acentos); pt-BR usa o campo "pt-BR" (acentuado) quando existe; sem traducao cai no PT.
// Manutencao: `node scripts/ai-meta-i18n.mjs --check` (cobertura) e `--merge <arquivo>` (acrescenta lote).
import dictionary from "./ai-meta.json";

type Entry = Partial<Record<"pt-BR" | "en-US" | "pt-PT" | "es" | "fr", string>>;
const RAW_DICTIONARY = dictionary as Record<string, Entry>;
// Chaves normalizadas (CRLF -> LF): o manifesto pode ter quebras de linha diferentes das do dicionario.
const normalizeKey = (text: string) => text.replace(/\r\n/g, "\n");
const DICTIONARY: Record<string, Entry> = Object.fromEntries(
  Object.entries(RAW_DICTIONARY).map(([key, entry]) => [normalizeKey(key), entry])
);

export function aiMetaText(locale: string, pt: string): string;
export function aiMetaText(locale: string, pt: string | undefined): string | undefined;
export function aiMetaText(locale: string, pt: string | undefined): string | undefined {
  if (!pt) return pt;
  const entry = DICTIONARY[normalizeKey(pt)];
  const value = entry ? (entry as Record<string, string | undefined>)[locale] : undefined;
  return value && value.trim() ? value : pt;
}
