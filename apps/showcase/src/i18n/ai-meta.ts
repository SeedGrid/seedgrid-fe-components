// Traducao dos textos do bloco "IA-ready" (descricao, casos de uso, descricao de props).
// A chave do dicionario e o proprio texto em PT do manifesto; sem traducao (ou em pt-BR) cai no PT.
// Manutencao: `node scripts/ai-meta-i18n.mjs --check` (cobertura) e `--merge <arquivo>` (acrescenta lote).
import dictionary from "./ai-meta.json";

type Entry = Partial<Record<"en-US" | "pt-PT" | "es" | "fr", string>>;
const DICTIONARY = dictionary as Record<string, Entry>;

export function aiMetaText(locale: string, pt: string): string;
export function aiMetaText(locale: string, pt: string | undefined): string | undefined;
export function aiMetaText(locale: string, pt: string | undefined): string | undefined {
  if (!pt || locale === "pt-BR") return pt;
  const entry = DICTIONARY[pt];
  const value = entry ? (entry as Record<string, string | undefined>)[locale] : undefined;
  return value && value.trim() ? value : pt;
}
