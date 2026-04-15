import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.cpfCnpj",
  package: "@seedgrid/fe-components",
  exportName: "SgInputCPFCNPJ",
  slug: "sg-input-cpf-cnpj",
  displayName: "SgInputCPFCNPJ",
  category: "input",
  subcategory: "document",
  description:
    "Campo hibrido para CPF ou CNPJ com mascara e validacao automatica conforme o documento informado.",
  tags: ["form", "document", "cpf", "cnpj", "hybrid", "rhf"],
  capabilities: ["rhf", "mask", "validation", "cpf-cnpj", "clearable"],
  fieldSemantics: ["cpfOrCnpj", "personOrCompanyDocument", "hybridDocument", "brazilianDocument"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "lengthMessage", type: "string", description: "Mensagem para comprimento invalido.", semanticRole: "validation", bindable: true },
    { name: "invalidMessage", type: "string", description: "Mensagem para documento invalido.", semanticRole: "validation", bindable: true },
    { name: "validateOnBlur", type: "boolean", default: true, description: "Executa validacao no blur.", semanticRole: "behavior", bindable: true },
    { name: "validation", type: "(value: string) => string | null", description: "Validacao customizada adicional.", semanticRole: "validation", bindable: false },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validacao.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-cpf-cnpj/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-cpf-cnpj/sg-input-cpf-cnpj.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-cpf-cnpj",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.document.cpfCnpj",
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
    "Campos unificados que aceitam CPF ou CNPJ no mesmo fluxo.",
    "Cadastros onde a entidade pode ser pessoa fisica ou juridica.",
    "Busca ou filtro por documento brasileiro sem tipo fixo."
  ],
  avoidUseCases: [
    "Quando o dominio ja define apenas CPF; nesses casos prefira SgInputCPF.",
    "Quando o dominio ja define apenas CNPJ; nesses casos prefira SgInputCNPJ.",
    "Texto livre, telefone, email ou valores financeiros."
  ],
  synonyms: ["cpf cnpj", "documento misto", "hybrid document", "cpf or cnpj"],
  relatedEntityFields: ["document", "cpfCnpj", "taxId", "personOrCompanyDocument"],
  compositionHints: [
    "Combinar com SgInputEmail e SgInputPhone em cadastros flexiveis.",
    "Usar dentro de SgPanel em secoes de identificacao principal."
  ],
  rankingSignals: {
    freeText: 0.1,
    structuredChoice: 0,
    date: 0,
    number: 0.66,
    denseLayout: 0.75
  }
};
