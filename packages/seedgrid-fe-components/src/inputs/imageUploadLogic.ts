// Logica pura do SgImageUpload (P133): tipos aceitos, validacao (tipo, tamanho, dimensao minima, proporcao) e
// texto de tamanho. Sem DOM: os vetores de paridade com o Flutter (`seedgrid_components/test/widgets/
// image_upload_vectors`) sao gerados DESTE modulo.

export type ImageErrorCode = "type" | "size" | "dimension" | "aspect";

export type ImageFacts = {
  name: string;
  /** Tipo MIME (`image/png`); pode vir vazio. */
  type: string;
  size: number;
  /** Dimensoes em px; ausentes quando nao foi possivel ler (as regras de dimensao/proporcao so rodam se existirem). */
  width?: number;
  height?: number;
};

export type ImageRules = {
  /** Lista separada por virgula: `image/*`, `image/png`, `.png`. Padrao: `image/*`. */
  accept?: string;
  maxSizeBytes?: number;
  minWidth?: number;
  minHeight?: number;
  /** Proporcao largura/altura exigida (`1`, `16 / 9`). */
  aspect?: number;
  /** Tolerancia relativa da proporcao (padrao 0.02 = 2%). */
  aspectTolerance?: number;
};

export const DEFAULT_ACCEPT = "image/*";

/** O arquivo satisfaz `accept`? Compara extensao (`.png`), tipo exato (`image/png`) e curinga (`image/*`). */
export function matchesAccept(name: string, type: string, accept?: string): boolean {
  const tokens = (accept ?? DEFAULT_ACCEPT)
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const lowerName = name.toLowerCase();
  const lowerType = type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return lowerName.endsWith(token);
    if (token.endsWith("/*")) return lowerType.startsWith(token.slice(0, -1));
    return lowerType === token;
  });
}

/** Primeiro erro encontrado (ordem: tipo, tamanho, dimensao, proporcao) ou `null`. */
export function validateImage(file: ImageFacts, rules: ImageRules = {}): ImageErrorCode | null {
  if (!matchesAccept(file.name, file.type, rules.accept)) return "type";
  if (rules.maxSizeBytes !== undefined && file.size > rules.maxSizeBytes) return "size";
  const { width, height } = file;
  if (width !== undefined && height !== undefined) {
    if (
      (rules.minWidth !== undefined && width < rules.minWidth) ||
      (rules.minHeight !== undefined && height < rules.minHeight)
    ) {
      return "dimension";
    }
    if (rules.aspect !== undefined && rules.aspect > 0 && height > 0) {
      const tolerance = rules.aspectTolerance ?? 0.02;
      if (Math.abs(width / height - rules.aspect) / rules.aspect > tolerance) return "aspect";
    }
  }
  return null;
}

/** `1536` => "1,5 KB" (virgula fora do en-US). Usa 1024 como base; ate GB. */
export function formatBytes(bytes: number, locale = "en-US"): string {
  const units = ["B", "KB", "MB", "GB"];
  let value = Math.max(0, bytes);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const text = unit === 0 ? String(Math.round(value)) : value.toFixed(1);
  return `${locale === "en-US" ? text : text.replace(".", ",")} ${units[unit]}`;
}

/** Texto da proporcao para a mensagem: inteiros viram "16:9"; senao 2 casas ("1.78"). */
export function formatAspect(aspect: number): string {
  const known: Array<[number, string]> = [
    [1, "1:1"],
    [4 / 3, "4:3"],
    [3 / 2, "3:2"],
    [16 / 9, "16:9"],
    [3 / 4, "3:4"],
    [2 / 3, "2:3"],
    [9 / 16, "9:16"]
  ];
  for (const [value, text] of known) if (Math.abs(value - aspect) < 1e-9) return text;
  return aspect.toFixed(2);
}
