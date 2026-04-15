import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.textarea",
  package: "@seedgrid/fe-components",
  exportName: "SgInputTextArea",
  slug: "sg-input-text-area",
  displayName: "SgInputTextArea",
  category: "input",
  subcategory: "textarea",
  description:
    "Campo textual multi-linha para descricoes, observacoes e conteudos longos com suporte a contagem e validacao.",
  tags: ["form", "textarea", "long-text", "notes", "rhf"],
  capabilities: ["rhf", "controlled", "multiline", "validation", "char-counter", "word-count"],
  fieldSemantics: ["longText", "description", "notes", "comments", "details"],
  props: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Identificador unico do campo multi-linha.",
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
      description: "Texto de apoio para orientar o conteudo esperado.",
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
      name: "rows",
      type: "number",
      description: "Quantidade inicial de linhas visiveis.",
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
      description: "Callback com o texto multi-linha atual.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-text-area/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-text-area/sg-input-text-area.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-text-area",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.textarea",
    acceptsDataBinding: true,
    defaultProps: {
      labelPosition: "top",
      rows: 4,
      validateOnBlur: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de descricoes, observacoes, notas e comentarios longos.",
    "Campos multi-linha em formularios CRUD e fluxos de atendimento.",
    "Textos livres que exigem mais espaco e semantica de conteudo longo."
  ],
  avoidUseCases: [
    "Campos curtos como nome, titulo ou codigo; nesses casos prefira SgInputText.",
    "Valores numericos ou monetarios; nesses casos prefira SgInputNumber ou SgInputCurrency.",
    "Datas e horarios; nesses casos prefira SgInputDate."
  ],
  synonyms: ["textarea", "long text field", "notes field", "description input"],
  relatedEntityFields: ["description", "notes", "comments", "details", "summary"],
  compositionHints: [
    "Combinar com SgButton em formularios de cadastro ou atendimento.",
    "Usar dentro de SgPanel para blocos de observacoes e descricoes."
  ],
  rankingSignals: {
    freeText: 0.98,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.45
  }
};
