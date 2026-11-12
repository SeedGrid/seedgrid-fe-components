import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.datetime",
  package: "@seedgrid/fe-components",
  exportName: "SgInputDateTime",
  slug: "sg-input-date-time",
  displayName: "SgInputDateTime",
  category: "input",
  subcategory: "datetime",
  description:
    "Campo de data e hora que entrega e recebe instantes ISO 8601 em UTC, exibindo a hora no fuso escolhido, com limites, passo de minutos e validacao.",
  tags: ["form", "date", "time", "datetime", "rhf"],
  capabilities: ["rhf", "controlled", "min-max", "time-zone", "minute-step", "iso-utc"],
  fieldSemantics: ["dateTime", "timestamp", "schedule", "appointment", "deadline"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo para formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo principal exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "value", type: "string | Date | null", description: "Instante controlado (ISO 8601 ou Date).", semanticRole: "data", bindable: true },
    { name: "defaultValue", type: "string | Date | null", description: "Instante inicial (nao controlado).", semanticRole: "data", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "minDate", type: "string | Date", description: "Menor instante permitido.", semanticRole: "validation", bindable: true },
    { name: "maxDate", type: "string | Date", description: "Maior instante permitido.", semanticRole: "validation", bindable: true },
    { name: "timeZone", type: "string", default: "local", description: "Fuso do campo: local, UTC, deslocamento (+03:00) ou nome IANA.", semanticRole: "data", bindable: true },
    { name: "valueMode", type: '"local" | "utc" | "offset"', default: "local", description: "Formato do valor que sai (onChange e formulario) e que o formulario aceita: local (2026-01-15T10:30), utc (2026-01-15T13:30:00Z) ou offset (2026-01-15T10:30:00-03:00).", semanticRole: "data", bindable: true },
    { name: "showSeconds", type: "boolean", default: false, description: "Mostra e aceita segundos.", semanticRole: "appearance", bindable: true },
    { name: "minuteStep", type: "number", description: "Passo dos minutos (5, 10, 15, 30).", semanticRole: "validation", bindable: true },
    { name: "onChange", type: "(value: string | null, local: string) => void", description: "Valor no formato de valueMode (ou null) e texto local do campo.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-date-time/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-date-time/sg-input-date-time.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-date-time",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.datetime",
    acceptsDataBinding: true,
    defaultProps: { labelPosition: "float", clearButton: true }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Agendamentos, compromissos e prazos que exigem data e hora.",
    "Campos de timestamp que precisam trafegar como instante UTC.",
    "Formularios com limites de data e hora e fuso explicito."
  ],
  avoidUseCases: [
    "Somente data; prefira SgInputDate.",
    "Somente hora do dia sem data; prefira um campo de hora.",
    "Texto livre; prefira SgInputText."
  ],
  synonyms: ["datetime input", "date time picker", "timestamp field", "appointment field"],
  relatedEntityFields: ["createdAt", "scheduledAt", "startsAt", "endsAt", "dueAt", "timestamp"],
  compositionHints: [
    "Combinar dois campos (inicio/fim) com minDate/maxDate para intervalos.",
    "Usar dentro de SgPanel em formularios de agenda."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.1, date: 0.95, number: 0, denseLayout: 0.7 }
};
