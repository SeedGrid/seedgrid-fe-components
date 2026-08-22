/**
 * Recorte de um ano civil em fatias de tamanho igual: semestre (2), trimestre (4) e bimestre (6).
 *
 * Existe para o mesmo fim do SgPeriodSelector — resolver uma REGRA temporal para um intervalo real
 * de datas — mas para a pergunta que ele nao responde: "o 1o semestre DE 2024", e nao "este
 * semestre". Preset e' relativo a hoje; aqui o usuario escolhe ano e fatia.
 *
 * Modulo separado do componente porque isto e' aritmetica de calendario pura: da' para testar sem
 * DOM (ver tests/year-part-resolver.test.mjs), que e' onde os erros de virada de mes/ano moram.
 */

export enum YearPartKind {
  SEMESTER = "SEMESTER",
  QUARTER = "QUARTER",
  BIMESTER = "BIMESTER"
}

/** Quantas fatias o ano tem em cada recorte. */
const PART_COUNT: Record<YearPartKind, number> = {
  [YearPartKind.SEMESTER]: 2,
  [YearPartKind.QUARTER]: 4,
  [YearPartKind.BIMESTER]: 6
};

export type YearPartValue = {
  year: number;
  kind: YearPartKind;
  /** Fatia dentro do ano, base 1: 1..2 no semestre, 1..4 no trimestre, 1..6 no bimestre. */
  part: number;
};

/**
 * Espelha o formato de ResolvedPeriod (do SgPeriodSelector) de proposito: quem consome os dois
 * seletores — o filtro de relatorio, por exemplo — trata os dois com o mesmo codigo. A diferenca e'
 * que aqui as datas NUNCA sao nulas: todo recorte de ano resolve para um intervalo fechado.
 */
export type ResolvedYearPart = {
  value: YearPartValue;
  label: string;
  startDate: Date;
  endDate: Date;
};

/* ------------------------------------------------------------------ */
/* i18n (ASCII puro, sem acentos — estilo da casa)                     */
/* ------------------------------------------------------------------ */

type LocaleMap = Record<string, string>;

/** Nome do recorte — e' o que aparece no combo que escolhe entre semestre/trimestre/bimestre. */
const KIND_LABELS: Record<YearPartKind, LocaleMap> = {
  [YearPartKind.SEMESTER]: { "pt-BR": "Semestre", "en-US": "Half-year", es: "Semestre", "pt-PT": "Semestre", fr: "Semestre" },
  [YearPartKind.QUARTER]: { "pt-BR": "Trimestre", "en-US": "Quarter", es: "Trimestre", "pt-PT": "Trimestre", fr: "Trimestre" },
  [YearPartKind.BIMESTER]: { "pt-BR": "Bimestre", "en-US": "Bimester", es: "Bimestre", "pt-PT": "Bimestre", fr: "Bimestre" }
};

/**
 * Sigla da fatia, entre parenteses. NAO e' a inicial do nome traduzido: trimestre e' "Q" no
 * portugues do Brasil e no ingles (Q1..Q4, vindo do business em ingles) mas "T" em espanhol,
 * frances e portugues europeu, onde ninguem diz Q1. Bimestre nao tem sigla consagrada em lingua
 * nenhuma — fica sem parenteses em vez de inventar uma.
 */
const PART_ABBR: Partial<Record<YearPartKind, LocaleMap>> = {
  [YearPartKind.SEMESTER]: { "pt-BR": "S", "en-US": "H", es: "S", "pt-PT": "S", fr: "S" },
  [YearPartKind.QUARTER]: { "pt-BR": "Q", "en-US": "Q", es: "T", "pt-PT": "T", fr: "T" }
};

function pickLocale(map: LocaleMap, locale: string): string {
  return map[locale] ?? map["pt-BR"] ?? Object.values(map)[0] ?? "";
}

/** Quantas fatias cabem no ano para este recorte. */
export function yearPartCount(kind: YearPartKind): number {
  return PART_COUNT[kind];
}

/** Quantos meses tem cada fatia deste recorte: 6, 3 ou 2. */
export function yearPartMonths(kind: YearPartKind): number {
  return 12 / PART_COUNT[kind];
}

/** Nome do recorte no locale pedido ("Trimestre", "Quarter"). */
export function yearPartKindLabel(kind: YearPartKind, locale = "pt-BR"): string {
  return pickLocale(KIND_LABELS[kind], locale);
}

/**
 * Rotulo de uma fatia: "Trimestre 1 (Q1)", "Semestre 2 (S2)", "Bimestre 3".
 *
 * O numero vem DEPOIS do nome porque a forma ordinal ("1o trimestre") exigiria o indicador
 * ordinal, que esta' fora do ASCII que esta familia de componentes usa nos rotulos.
 */
export function yearPartLabel(kind: YearPartKind, part: number, locale = "pt-BR"): string {
  const name = yearPartKindLabel(kind, locale);
  const abbrMap = PART_ABBR[kind];
  if (!abbrMap) {
    return `${name} ${part}`;
  }
  return `${name} ${part} (${pickLocale(abbrMap, locale)}${part})`;
}

/** Opcoes prontas para o combo da fatia, ja no locale pedido. */
export function yearPartOptions(kind: YearPartKind, locale = "pt-BR"): { value: number; label: string }[] {
  return Array.from({ length: PART_COUNT[kind] }, (_, index) => ({
    value: index + 1,
    label: yearPartLabel(kind, index + 1, locale)
  }));
}

/** A fatia existe neste recorte? */
export function isValidYearPart(kind: YearPartKind, part: number): boolean {
  return Number.isInteger(part) && part >= 1 && part <= PART_COUNT[kind];
}

/**
 * Ao trocar o recorte, a fatia escolhida pode nao existir mais (estava no Q4 e virou semestre, que
 * so' tem 2). Mantem a fatia quando ela couber, e cai na primeira quando nao couber — em vez de
 * deixar um valor selecionado sem opcao correspondente na tela.
 */
export function clampYearPart(kind: YearPartKind, part: number): number {
  return isValidYearPart(kind, part) ? part : 1;
}

/**
 * Resolve o recorte para o intervalo fechado de datas.
 *
 * O ultimo dia sai de `new Date(ano, primeiroMesDaProximaFatia, 0)`: dia zero e' o ultimo dia do
 * mes anterior, entao fevereiro devolve 29 em ano bissexto sem nenhuma tabela de dias por mes.
 *
 * Lanca quando a fatia nao existe no recorte — numero errado aqui vira intervalo errado no
 * relatorio, e intervalo errado com cara de certo e' pior que erro na cara.
 */
export function resolveYearPart(value: YearPartValue, locale = "pt-BR"): ResolvedYearPart {
  const { year, kind, part } = value;
  if (!Number.isInteger(year)) {
    throw new RangeError(`Ano invalido: ${year}`);
  }
  if (!isValidYearPart(kind, part)) {
    throw new RangeError(
      `Fatia ${part} nao existe em ${kind} (validas: 1..${PART_COUNT[kind]})`
    );
  }

  const months = yearPartMonths(kind);
  const startMonth = (part - 1) * months;

  return {
    value: { year, kind, part },
    label: yearPartLabel(kind, part, locale),
    startDate: new Date(year, startMonth, 1, 0, 0, 0, 0),
    // Dia zero do mes SEGUINTE a' fatia = ultimo dia da fatia, e fevereiro devolve 29 em ano
    // bissexto sem nenhuma tabela de dias por mes. Fecha em 23:59:59.999 como o resolvePeriod:
    // intervalo que termina a' meia-noite perde o ultimo dia inteiro num BETWEEN com hora.
    endDate: new Date(year, startMonth + months, 0, 23, 59, 59, 999)
  };
}

/** Em que fatia do recorte esta data cai. Util para posicionar o seletor no periodo corrente. */
export function yearPartOf(date: Date, kind: YearPartKind): YearPartValue {
  return {
    year: date.getFullYear(),
    kind,
    part: Math.floor(date.getMonth() / yearPartMonths(kind)) + 1
  };
}
