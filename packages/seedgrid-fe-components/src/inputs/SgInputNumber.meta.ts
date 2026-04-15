import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.number",
  package: "@seedgrid/fe-components",
  exportName: "SgInputNumber",
  slug: "sg-input-number",
  displayName: "SgInputNumber",
  category: "input",
  subcategory: "number",
  description:
    "Campo numerico com suporte a valores inteiros e decimais, validacao de limites e integracao com react-hook-form.",
  tags: ["form", "number", "numeric", "rhf"],
  capabilities: ["rhf", "controlled", "validation", "min-max", "decimal", "clearable"],
  fieldSemantics: ["number", "integer", "decimal", "quantity", "measurement"],
  props: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Identificador unico do campo numerico.",
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
      name: "min",
      type: "number",
      description: "Valor minimo aceito.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "max",
      type: "number",
      description: "Valor maximo aceito.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "decimals",
      type: "number",
      description: "Quantidade de casas decimais permitidas.",
      semanticRole: "behavior",
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
      type: "(value: number | null) => void",
      description: "Callback com o valor numerico atual.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-number/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-number/sg-input-number.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-number",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.number",
    acceptsDataBinding: true,
    defaultProps: {
      clearButton: true,
      labelPosition: "float",
      validateOnBlur: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de quantidades, medidas, percentuais e outros valores numericos genericos.",
    "Campos que exigem validacao numerica com limites minimos e maximos.",
    "Entradas inteiras ou decimais em formularios CRUD."
  ],
  avoidUseCases: [
    "Texto livre ou descricoes; nesses casos prefira SgInputText ou SgInputTextArea.",
    "Valores monetarios; nesses casos prefira SgInputCurrency.",
    "Datas e horas; nesses casos prefira SgInputDate."
  ],
  synonyms: ["number input", "numeric field", "quantity input", "decimal input"],
  relatedEntityFields: ["quantity", "amount", "percentage", "weight", "height", "score"],
  compositionHints: [
    "Combinar com SgButton em formularios de calculo ou cadastro.",
    "Usar dentro de SgPanel ou SgGroupBox para secoes de dados numericos."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.1,
    date: 0,
    number: 0.95,
    denseLayout: 0.75
  }
};
