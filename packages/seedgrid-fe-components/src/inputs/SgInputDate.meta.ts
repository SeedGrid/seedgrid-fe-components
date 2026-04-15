import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.date",
  package: "@seedgrid/fe-components",
  exportName: "SgInputDate",
  slug: "sg-input-date",
  displayName: "SgInputDate",
  category: "input",
  subcategory: "date",
  description:
    "Campo de data com validacao de intervalo e suporte a selecao temporal para eventos, prazos e datas de referencia.",
  tags: ["form", "date", "calendar", "rhf"],
  capabilities: ["rhf", "controlled", "date-format", "min-max", "calendar-selection"],
  fieldSemantics: ["date", "calendarDate", "deadline", "schedule", "referenceDate"],
  props: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Identificador unico do campo de data.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "name",
      type: "string",
      description: "Nome do campo para formularios.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "label",
      type: "string",
      description: "Rotulo principal exibido ao usuario.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "required",
      type: "boolean",
      default: false,
      description: "Marca o campo como obrigatorio.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "minDate",
      type: "string | Date",
      description: "Data minima permitida.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "maxDate",
      type: "string | Date",
      description: "Data maxima permitida.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "placeholder",
      type: "string",
      description: "Texto de apoio para orientar o preenchimento da data.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "readOnly",
      type: "boolean",
      default: false,
      description: "Impede edicao mantendo leitura e foco.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "onChange",
      type: "(value: string | null) => void",
      description: "Callback com a data selecionada ou digitada.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-date/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-date/sg-input-date.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-date",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.date",
    acceptsDataBinding: true,
    defaultProps: {
      labelPosition: "float",
      clearButton: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de datas de vencimento, agendamento, cadastro e referencia temporal.",
    "Campos que exigem validacao de intervalo minimo e maximo de datas.",
    "Selecao de data em formularios com contexto de calendario."
  ],
  avoidUseCases: [
    "Texto livre ou descricoes; nesses casos prefira SgInputText ou SgInputTextArea.",
    "Numeros ou valores monetarios; nesses casos prefira SgInputNumber ou SgInputCurrency.",
    "Escolhas estruturadas sem contexto temporal; nesses casos prefira select ou combobox."
  ],
  synonyms: ["date input", "calendar field", "deadline input", "schedule date"],
  relatedEntityFields: ["date", "startDate", "endDate", "deadline", "dueDate", "birthDate"],
  compositionHints: [
    "Combinar com SgButton para filtros por periodo e formulários com datas.",
    "Usar dentro de SgPanel para blocos de agendamento ou dados temporais."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.15,
    date: 0.98,
    number: 0,
    denseLayout: 0.7
  }
};
