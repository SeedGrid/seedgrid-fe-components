"use client";

import React from "react";
import { cn } from "../layout/sgDocking";
import type { SgAutocompleteItem } from "./SgAutocomplete";
import { SgCombobox } from "./SgCombobox";
import {
  YearPartKind,
  clampYearPart,
  resolveYearPart,
  yearPartKindLabel,
  yearPartOf,
  yearPartOptions,
  type ResolvedYearPart,
  type YearPartValue
} from "./yearPart";

/**
 * Seletor de recorte de ano: o usuario escolhe ANO + RECORTE (semestre/trimestre/bimestre) + FATIA,
 * e o componente entrega o intervalo real de datas ja' resolvido.
 *
 * E' irmao do SgPeriodSelector e responde a pergunta que ele NAO responde: "o 1o semestre DE 2024"
 * (recorte absoluto) em vez de "este semestre" (preset relativo a hoje). O onChange entrega um
 * ResolvedYearPart, que espelha o formato do ResolvedPeriod de proposito — quem consome os dois
 * seletores trata os dois com o mesmo codigo.
 *
 * A aritmetica de calendario mora em ./yearPart (sem React, testavel sem DOM); aqui so' tem UI.
 *
 * Como o SgPeriodSelector, NAO emite onChange na montagem: o estado inicial e' so' o que aparece na
 * tela. O primeiro onChange sai quando o usuario mexe em algum dos tres controles.
 */
export type SgYearPartSelectorProps = {
  /** Prefixo dos ids dos tres controles internos. Default "sg-year-part-selector". */
  id?: string;
  /** Rotulo do grupo, acima da linha. Cada controle ainda tem o seu proprio rotulo. */
  label?: string;
  /** Valor controlado. Ausente = o componente guarda o proprio estado. */
  value?: YearPartValue;
  /** Recebe o recorte ja' resolvido, com startDate/endDate preenchidos. */
  onChange?: (resolved: ResolvedYearPart) => void;
  /** Recortes oferecidos. Com um unico item o combo de recorte some. Default: os tres. */
  allowedKinds?: YearPartKind[];
  /** Primeiro ano da lista. Default: ano corrente - 30. */
  minYear?: number;
  /** Ultimo ano da lista. Default: ano corrente + 10. */
  maxYear?: number;
  /** Locale dos rotulos. Default "pt-BR". */
  locale?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* i18n dos rotulos de campo (ASCII puro, sem acentos — estilo da casa) */
/* ------------------------------------------------------------------ */

type LocaleMap = Record<string, string>;

const FIELD_LABELS = {
  year: { "pt-BR": "Ano", "en-US": "Year", es: "Ano", "pt-PT": "Ano", fr: "Annee" } as LocaleMap,
  kind: { "pt-BR": "Recorte", "en-US": "Breakdown", es: "Recorte", "pt-PT": "Recorte", fr: "Decoupage" } as LocaleMap,
  part: { "pt-BR": "Fatia", "en-US": "Part", es: "Parte", "pt-PT": "Fatia", fr: "Partie" } as LocaleMap
};

function pickLocale(map: LocaleMap, locale: string): string {
  return map[locale] ?? map["pt-BR"] ?? Object.values(map)[0] ?? "";
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

/** Recorte usado quando nenhum foi permitido — nunca deve acontecer, mas tipa o fallback. */
const DEFAULT_KIND = YearPartKind.SEMESTER;

const ALL_KINDS: YearPartKind[] = [DEFAULT_KIND, YearPartKind.QUARTER, YearPartKind.BIMESTER];

export function SgYearPartSelector(props: Readonly<SgYearPartSelectorProps>) {
  const {
    id = "sg-year-part-selector",
    label,
    value,
    onChange,
    allowedKinds,
    minYear,
    maxYear,
    locale = "pt-BR",
    disabled,
    required,
    className
  } = props;

  // Array vazio cai no default: um combo de recorte sem opcao nenhuma seria controle morto na tela.
  const kinds = React.useMemo(
    () => (allowedKinds && allowedKinds.length > 0 ? allowedKinds : ALL_KINDS),
    [allowedKinds]
  );

  const isControlled = value !== undefined;

  /*
   * Inicializador preguicoso: "hoje" tem que ser lido uma vez, nao a cada render. Ano corrente,
   * primeiro recorte permitido e a fatia em que hoje cai — o palpite que acerta na maioria dos
   * filtros de relatorio, que olham para o periodo corrente.
   */
  const [internalValue, setInternalValue] = React.useState<YearPartValue>(() =>
    yearPartOf(new Date(), kinds[0] ?? DEFAULT_KIND)
  );

  const rawValue = isControlled ? value : internalValue;

  /**
   * Normaliza antes de usar. resolveYearPart LANCA quando a fatia nao existe no recorte, e um value
   * controlado inconsistente (vindo de formulario salvo, de URL) nao pode derrubar a tela. Recorte
   * fora dos allowedKinds tambem cai para o primeiro permitido: exibir um selecionado que nao tem
   * opcao correspondente na lista e' pior que exibir o recorte vizinho.
   */
  const current = React.useMemo<YearPartValue>(() => {
    const kind = kinds.includes(rawValue.kind) ? rawValue.kind : kinds[0] ?? DEFAULT_KIND;
    return { year: rawValue.year, kind, part: clampYearPart(kind, rawValue.part) };
  }, [kinds, rawValue]);

  const commit = React.useCallback(
    (next: YearPartValue) => {
      // clamp aqui e nao no handler: e' o unico ponto por onde toda mudanca passa.
      const safe: YearPartValue = { ...next, part: clampYearPart(next.kind, next.part) };
      if (!isControlled) setInternalValue(safe);
      onChange?.(resolveYearPart(safe, locale));
    },
    [isControlled, locale, onChange]
  );

  const currentYear = new Date().getFullYear();
  const firstYear = minYear ?? currentYear - 30;
  const lastYear = maxYear ?? currentYear + 10;

  // Do mais novo para o mais velho: o ano procurado costuma ser o do topo da lista.
  const yearItems = React.useMemo<SgAutocompleteItem[]>(() => {
    const from = Math.min(firstYear, lastYear);
    const to = Math.max(firstYear, lastYear);
    return Array.from({ length: to - from + 1 }, (_, index) => {
      const year = to - index;
      return { id: year, label: String(year) };
    });
  }, [firstYear, lastYear]);

  const kindItems = React.useMemo<SgAutocompleteItem[]>(
    () => kinds.map((kind) => ({ id: kind, label: yearPartKindLabel(kind, locale) })),
    [kinds, locale]
  );

  // Depende do recorte: trocar de trimestre para semestre troca 4 opcoes por 2.
  const partItems = React.useMemo<SgAutocompleteItem[]>(
    () => yearPartOptions(current.kind, locale).map((option) => ({ id: option.value, label: option.label })),
    [current.kind, locale]
  );

  const showKind = kinds.length > 1;
  const enabled = disabled ? false : undefined;

  /*
   * Flex em vez de grid de 3 colunas: com o combo de recorte escondido a linha reflui para dois
   * controles, em vez de deixar uma coluna vazia no meio.
   */
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <span className="mb-1 block text-sm font-medium text-[rgb(var(--sg-text))]">
          {label}
          {required ? " *" : ""}
        </span>
      ) : null}

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
        <div className="w-full sm:flex-1">
          {/*
            * Combobox e nao autocomplete: o autocomplete filtra a lista pelo texto que esta' no
            * campo, entao com 2026 escolhido o botao de "mostrar todos" abria mostrando so' 2026 —
            * justamente quando o usuario quer ver os outros anos. O combobox abre com a lista
            * inteira e ainda filtra por digitacao, que e' o que se espera de um campo de ano.
            */}
          <SgCombobox<SgAutocompleteItem>
            id={`${id}-year`}
            label={pickLocale(FIELD_LABELS.year, locale)}
            source={yearItems}
            value={current.year}
            openOnFocus
            enabled={enabled}
            required={required}
            onValueChange={(value) => {
              if (value === null || value === undefined) return;
              commit({ ...current, year: Number(value) });
            }}
          />
        </div>

        {showKind ? (
          <div className="w-full sm:flex-1">
            <SgCombobox<SgAutocompleteItem>
              id={`${id}-kind`}
              label={pickLocale(FIELD_LABELS.kind, locale)}
              source={kindItems}
              value={current.kind}
              openOnFocus
              enabled={enabled}
              required={required}
              onValueChange={(raw) => {
                if (raw == null) return;
                // A fatia pode nao existir no recorte novo (estava no Q4 e virou semestre); quem
                // reajusta e' o clampYearPart dentro do commit.
                commit({ ...current, kind: String(raw) as YearPartKind });
              }}
            />
          </div>
        ) : null}

        <div className="w-full sm:flex-1">
          <SgCombobox<SgAutocompleteItem>
            id={`${id}-part`}
            label={pickLocale(FIELD_LABELS.part, locale)}
            source={partItems}
            value={current.part}
            openOnFocus
            enabled={enabled}
            required={required}
            onValueChange={(raw) => {
              if (raw == null) return;
              commit({ ...current, part: Number(raw) });
            }}
          />
        </div>
      </div>
    </div>
  );
}
