// Logica pura do SgFileUpload (P141): tipos de midia (`mediaType`), tamanho com unidade ("1.5MB"), tipo do arquivo
// pelo CONTEUDO (assinatura) e a regra de quantos arquivos entram (maxFiles, por arquivo, total). Sem DOM: os vetores
// de paridade com o Flutter (`seedgrid_components/test/widgets/file_upload_vectors`) sao gerados DESTE modulo.

export type MediaType =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "csv"
  | "txt"
  | "zip"
  | "all";

export type FileErrorCode = "type" | "size" | "total" | "count" | "dimension" | "aspect";

/** Tamanho em bytes (numero) ou texto com unidade: `"1KB"`, `"1.5MB"`, `"2gb"`. */
export type SizeLimit = number | string;

type MediaInfo = { group?: string; mime?: string; extensions: string[] };

export const MEDIA_TYPES: Record<Exclude<MediaType, "all">, MediaInfo> = {
  image: { group: "image/", extensions: ["png", "jpg", "jpeg", "jfif", "jpe", "gif", "webp", "bmp", "svg", "heic", "heif", "avif", "tif", "tiff", "ico"] },
  video: { group: "video/", extensions: ["mp4", "webm", "mov", "mkv", "avi", "ogv", "m4v"] },
  audio: { group: "audio/", extensions: ["mp3", "wav", "ogg", "oga", "m4a", "aac", "flac", "weba"] },
  pdf: { mime: "application/pdf", extensions: ["pdf"] },
  doc: { mime: "application/msword", extensions: ["doc"] },
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", extensions: ["docx"] },
  xls: { mime: "application/vnd.ms-excel", extensions: ["xls"] },
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extensions: ["xlsx"] },
  ppt: { mime: "application/vnd.ms-powerpoint", extensions: ["ppt"] },
  pptx: { mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", extensions: ["pptx"] },
  csv: { mime: "text/csv", extensions: ["csv"] },
  txt: { mime: "text/plain", extensions: ["txt"] },
  zip: { mime: "application/zip", extensions: ["zip"] }
};

const EXTENSION_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  jpe: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
  avif: "image/avif",
  tif: "image/tiff",
  tiff: "image/tiff",
  ico: "image/x-icon",
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
  avi: "video/x-msvideo",
  ogv: "video/ogg",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  flac: "audio/flac",
  weba: "audio/webm",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  txt: "text/plain",
  zip: "application/zip"
};

const ZIP = "application/zip";
const OLE = "application/x-ole-storage";
const ZIP_BASED = new Set(["docx", "xlsx", "pptx", "zip"]);
const OLE_BASED = new Set(["doc", "xls", "ppt"]);

/** Extensao em minusculas (sem ponto), ou "" quando nao ha. */
export function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i < 0 || i === name.length - 1 ? "" : name.slice(i + 1).toLowerCase();
}

/** Tipo MIME so pela extensao do nome; "" se desconhecida. */
export function mimeFromName(name: string): string {
  return EXTENSION_MIME[extensionOf(name)] ?? "";
}

function startsWith(b: Uint8Array, sig: number[], at = 0): boolean {
  if (b.length < at + sig.length) return false;
  for (let i = 0; i < sig.length; i += 1) if (b[i + at] !== sig[i]) return false;
  return true;
}

function ascii(b: Uint8Array, from: number, to: number): string {
  let s = "";
  for (let i = from; i < Math.min(to, b.length); i += 1) s += String.fromCharCode(b[i] ?? 0);
  return s;
}

/** Tipo MIME pela assinatura do arquivo (primeiros bytes; ate 256 bastam); "" se nao reconhecida. */
export function sniffMime(b: Uint8Array): string {
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47])) return "image/png";
  if (startsWith(b, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(b, [0x47, 0x49, 0x46, 0x38])) return "image/gif";
  if (startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  if (startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x41, 0x56, 0x45], 8)) return "audio/wav";
  if (startsWith(b, [0x42, 0x4d])) return "image/bmp";
  if (startsWith(b, [0x49, 0x49, 0x2a, 0x00]) || startsWith(b, [0x4d, 0x4d, 0x00, 0x2a])) return "image/tiff";
  if (startsWith(b, [0x00, 0x00, 0x01, 0x00])) return "image/x-icon";
  if (startsWith(b, [0x25, 0x50, 0x44, 0x46])) return "application/pdf";
  if (startsWith(b, [0x50, 0x4b, 0x03, 0x04])) return ZIP;
  if (startsWith(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) return OLE;
  if (startsWith(b, [0x1a, 0x45, 0xdf, 0xa3])) return "video/webm";
  if (startsWith(b, [0x4f, 0x67, 0x67, 0x53])) return "audio/ogg";
  if (startsWith(b, [0x66, 0x4c, 0x61, 0x43])) return "audio/flac";
  if (startsWith(b, [0x49, 0x44, 0x33]) || startsWith(b, [0xff, 0xfb]) || startsWith(b, [0xff, 0xf3]) || startsWith(b, [0xff, 0xf2])) return "audio/mpeg";
  if (startsWith(b, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = ascii(b, 8, 12);
    if (brand.startsWith("avif") || brand.startsWith("avis")) return "image/avif";
    if (brand.startsWith("hei") || brand.startsWith("mif")) return "image/heic";
    if (brand.startsWith("M4A")) return "audio/mp4";
    if (brand.startsWith("qt")) return "video/quicktime";
    return "video/mp4";
  }
  if (ascii(b, 0, 256).toLowerCase().includes("<svg")) return "image/svg+xml";
  return "";
}

/**
 * Tipo efetivo do arquivo: a assinatura (conteudo) manda; contentores (zip, OLE) e texto puro desempatam pela
 * extensao; sem nenhuma das duas, vale o tipo que o sistema informou (`declared`).
 */
export function resolveMime(name: string, declared: string, head: Uint8Array): string {
  const ext = extensionOf(name);
  const byName = EXTENSION_MIME[ext] ?? "";
  const sig = sniffMime(head);
  if (sig === ZIP) return ZIP_BASED.has(ext) ? byName : ZIP;
  if (sig === OLE) return OLE_BASED.has(ext) ? byName : OLE;
  if (sig) return sig;
  return byName || declared.toLowerCase();
}

/** Texto `accept` livre: `.png`, `image/png`, `image/*`, separados por virgula. */
function matchesAcceptToken(name: string, mime: string, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return false;
  const lowerName = name.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return lowerName.endsWith(token);
    if (token.endsWith("/*")) return mime.startsWith(token.slice(0, -1));
    return mime === token;
  });
}

/** O tipo efetivo satisfaz `mediaType` (lista) ou `accept` (texto livre)? Sem nenhum dos dois, tudo passa. */
export function matchesMedia(name: string, mime: string, mediaType?: MediaType[], accept?: string): boolean {
  const hasMedia = Boolean(mediaType && mediaType.length > 0);
  const hasAccept = Boolean(accept && accept.trim());
  if (!hasMedia && !hasAccept) return true;
  if (hasMedia) {
    for (const m of mediaType as MediaType[]) {
      if (m === "all") return true;
      const info = MEDIA_TYPES[m];
      if (!info) continue;
      if (info.group && mime.startsWith(info.group)) return true;
      if (info.mime && mime === info.mime) return true;
    }
  }
  return hasAccept ? matchesAcceptToken(name, mime, accept as string) : false;
}

const UNITS: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4 };

/**
 * Tamanho em bytes: numero puro = bytes; texto com unidade (B, KB, MB, GB, TB; base 1024; maiusculas ou minusculas;
 * decimal com ponto; espaco opcional). Invalido, vazio ou negativo => `undefined` (sem limite).
 */
export function parseSize(value: SizeLimit | undefined | null): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? Math.floor(value) : undefined;
  const m = /^\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]*)\s*$/.exec(value);
  if (!m) return undefined;
  const unitText = m[2] ?? "";
  const unit = unitText === "" ? "b" : unitText.toLowerCase();
  const factor = UNITS[unit];
  return factor === undefined ? undefined : Math.floor(Number(m[1] ?? 0) * factor);
}

export type PickedFacts = { name: string; type: string; size: number; head: Uint8Array };

export type AddRules = {
  mediaType?: MediaType[];
  accept?: string;
  /** Quantos arquivos o campo guarda (padrao 1). Com 1, escolher outro SUBSTITUI o atual. */
  maxFiles?: number;
  maxSizePerFile?: SizeLimit;
  maxSizeTotal?: SizeLimit;
};

export type AddPlan = {
  /** Indices (em `picked`) dos arquivos que entram, na ordem. */
  accepted: number[];
  rejected: Array<{ index: number; code: FileErrorCode }>;
  /** `true` quando `maxFiles` e 1: o aceito substitui o que ja havia. */
  replace: boolean;
};

/**
 * Decide quais dos arquivos escolhidos entram (`current` = tamanhos ja no campo). Cada recusa fica no seu arquivo
 * (`type`, `size`, `count`, `total`); os demais seguem validos. Ordem das regras: tipo, tamanho por arquivo,
 * quantidade, tamanho total.
 */
export function planAdd(currentSizes: number[], picked: PickedFacts[], rules: AddRules = {}): AddPlan {
  const maxFiles = Math.max(1, Math.floor(rules.maxFiles ?? 1));
  const perFile = parseSize(rules.maxSizePerFile);
  const total = parseSize(rules.maxSizeTotal);
  const replace = maxFiles === 1;
  let count = replace ? 0 : currentSizes.length;
  let sum = replace ? 0 : currentSizes.reduce((a, b) => a + b, 0);
  const accepted: number[] = [];
  const rejected: AddPlan["rejected"] = [];
  picked.forEach((file, index) => {
    const mime = resolveMime(file.name, file.type, file.head);
    let code: FileErrorCode | null = null;
    if (!matchesMedia(file.name, mime, rules.mediaType, rules.accept)) code = "type";
    else if (perFile !== undefined && file.size > perFile) code = "size";
    else if (count >= maxFiles) code = "count";
    else if (total !== undefined && sum + file.size > total) code = "total";
    if (code) {
      rejected.push({ index, code });
      return;
    }
    accepted.push(index);
    count += 1;
    sum += file.size;
  });
  return { accepted, rejected, replace };
}

/** `1536` => "1,5 KB" (virgula fora do en-US). Base 1024; ate TB. */
export function formatFileSize(bytes: number, locale = "en-US"): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = Math.max(0, bytes);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const text = unit === 0 ? String(Math.round(value)) : value.toFixed(1);
  return `${locale === "en-US" ? text : text.replace(".", ",")} ${units[unit]}`;
}
