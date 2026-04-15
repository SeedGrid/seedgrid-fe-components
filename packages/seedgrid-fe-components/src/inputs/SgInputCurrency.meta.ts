import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.currency",
  package: "@seedgrid/fe-components",
  exportName: "SgInputCurrency",
  slug: "sg-input-currency",
  displayName: "SgInputCurrency",
  category: "input",
  subcategory: "currency",
  description:
    "Campo monetario com formatacao de moeda, simbolo e validacao para precos, valores financeiros e totais.",
  tags: ["form", "currency", "money", "price", "rhf"],
  capabilities: ["rhf", "controlled", "currency-format", "symbol", "min-max", "validation"],
  fieldSemantics: ["money", "currency", "price", "total", "financialAmount"],
  props: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Identificador unico do campo monetario.",
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
      name: "currency",
      type: "string",
      description: "Codigo ou configuracao de moeda usada na formatacao.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "symbol",
      type: "string",
      description: "Simbolo monetario exibido no campo.",
      semanticRole: "appearance",
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
      name: "min",
      type: "number",
      description: "Valor monetario minimo aceito.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "max",
      type: "number",
      description: "Valor monetario maximo aceito.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "onChange",
      type: "(value: number | null) => void",
      description: "Callback com o valor monetario normalizado.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-currency/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-currency/sg-input-currency.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-currency",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.currency",
    acceptsDataBinding: true,
    defaultProps: {
      clearButton: true,
      labelPosition: "float",
      currency: "BRL"
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de precos, totais, descontos e valores financeiros.",
    "Campos monetarios que exigem formatacao de moeda e simbolo visual.",
    "Entradas financeiras em formularios de venda, faturamento e cadastro."
  ],
  avoidUseCases: [
    "Numeros genericos sem semantica monetaria; nesses casos prefira SgInputNumber.",
    "Texto livre; nesses casos prefira SgInputText ou SgInputTextArea.",
    "Datas e horas; nesses casos prefira SgInputDate."
  ],
  synonyms: ["currency input", "money field", "price input", "amount input"],
  relatedEntityFields: ["price", "amount", "total", "subtotal", "discount", "fee"],
  compositionHints: [
    "Combinar com SgInputNumber para quantidades e com SgButton para acoes de submit.",
    "Usar dentro de SgPanel em secoes financeiras ou comerciais."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0.85,
    denseLayout: 0.7
  }
};
