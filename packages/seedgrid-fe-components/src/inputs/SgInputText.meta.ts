import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.text",
  package: "@seedgrid/fe-components",
  exportName: "SgInputText",
  slug: "sg-input-text",
  displayName: "SgInputText",
  category: "input",
  subcategory: "text",
  description:
    "Campo textual de uso geral com suporte a react-hook-form, validacao, contador de caracteres e prefixo/sufixo.",
  tags: ["form", "text", "field", "rhf"],
  capabilities: ["rhf", "controlled", "validation", "clearable", "prefix-suffix", "char-counter"],
  fieldSemantics: ["freeText", "shortText", "name", "title", "code", "identifier"],
  props: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Identificador unico do campo.",
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
      name: "placeholder",
      type: "string",
      description: "Texto de apoio dentro do input.",
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
      name: "readOnly",
      type: "boolean",
      default: false,
      description: "Impede edicao mantendo foco e leitura.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "maxLength",
      type: "number",
      description: "Limite maximo de caracteres.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "minLength",
      type: "number",
      description: "Limite minimo de caracteres.",
      semanticRole: "validation",
      bindable: true
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      description: "Callback com o valor textual atual.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic-rhf",
      title: "Basico com react-hook-form",
      file: "apps/showcase/src/app/components/sg-input-text/samples/basico-rhf.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-text/sg-input-text.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-text",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.text",
    acceptsDataBinding: true,
    defaultProps: {
      clearButton: true,
      labelPosition: "float",
      withBorder: true,
      validateOnBlur: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Campos textuais curtos em formularios CRUD.",
    "Captura de nome, titulo, codigo ou identificador textual.",
    "Entradas livres que precisam de validacao e integracao com react-hook-form."
  ],
  avoidUseCases: [
    "Texto longo ou rico; nesses casos prefira SgInputTextArea ou SgTextEditor.",
    "Escolhas fechadas; nesses casos prefira SgCombobox, SgAutocomplete ou SgRadioGroup.",
    "Datas, numeros ou valores com mascara especializada."
  ],
  synonyms: ["text field", "text input", "campo texto", "campo livre"],
  relatedEntityFields: ["name", "title", "code", "nickname", "shortDescription"],
  compositionHints: [
    "Combinar com SgButton para acoes de submit.",
    "Agrupar com SgPanel ou SgGroupBox em secoes de formulario."
  ],
  rankingSignals: {
    freeText: 0.95,
    structuredChoice: 0.1,
    date: 0,
    number: 0.1,
    denseLayout: 0.7
  }
};
