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
    "Campo híbrido para CPF ou CNPJ com máscara e validação automática conforme o documento informado. Contrato de valor: o valor do formulário (onChange avulso, control e register) e SEMPRE mascarado, digitado ou setado por código (defaultValues, setValue, reset, value); a entrada aceita valor cru ou mascarado; valor maior que a máscara e cortado; para guardar só dígitos use value.replace(/\\D/g, \"\").",
  tags: ["form", "document", "cpf", "cnpj", "hybrid", "rhf"],
  capabilities: ["rhf", "mask", "validation", "cpf-cnpj", "clearable"],
  fieldSemantics: ["cpfOrCnpj", "personOrCompanyDocument", "hybridDocument", "brazilianDocument"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador único do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formulários.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rótulo exibido ao usuário.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatório.", semanticRole: "validation", bindable: true },
    { name: "lengthMessage", type: "string", description: "Mensagem para comprimento inválido.", semanticRole: "validation", bindable: true },
    { name: "invalidMessage", type: "string", description: "Mensagem para documento inválido.", semanticRole: "validation", bindable: true },
    { name: "validateOnBlur", type: "boolean", default: true, description: "Executa validação no blur.", semanticRole: "behavior", bindable: true },
    { name: "validateWithPublicaCnpj", type: "boolean", default: false, description: "Confirma na base publica que o CNPJ numérico existe.", semanticRole: "behavior", bindable: true },
    { name: "publicaCnpjErrorMessage", type: "string", description: "Mensagem quando a base publica não encontra o CNPJ.", semanticRole: "validation", bindable: true },
    { name: "publicaCnpjFetch", type: "(cnpj: string) => Promise<unknown | null>", description: "Consulta injetável (padrão publica.cnpj.ws).", semanticRole: "behavior", bindable: false },
    { name: "onPublicaCnpjResult", type: "(data: unknown | null) => void", description: "Recebe o resultado da consulta.", semanticRole: "event", bindable: false },
    { name: "onPublicaCnpjError", type: "(error: unknown) => void", description: "Chamado quando a consulta falha.", semanticRole: "event", bindable: false },
    { name: "validation", type: "(value: string) => string | null", description: "Validação customizada adicional.", semanticRole: "validation", bindable: false },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validação.", semanticRole: "event", bindable: false }
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
      id: "publica-cnpj",
      title: "Consulta na base publica",
      file: "apps/showcase/src/app/components/sg-input-cpf-cnpj/samples/cnpj-publico.tsx.sample",
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
    "Cadastros onde a entidade pode ser pessoa física ou juridica.",
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
