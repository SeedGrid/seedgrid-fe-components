import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.cnpj",
  package: "@seedgrid/fe-components",
  exportName: "SgInputCNPJ",
  slug: "sg-input-cnpj",
  displayName: "SgInputCNPJ",
  category: "input",
  subcategory: "document",
  description:
    "Campo especializado para CNPJ com mascara, validacao de digitos e suporte opcional a consulta externa.",
  tags: ["form", "document", "cnpj", "brazil", "rhf"],
  capabilities: ["rhf", "mask", "validation", "cnpj", "publica-cnpj", "clearable"],
  fieldSemantics: ["cnpj", "companyTaxId", "organizationDocument", "brazilianCompanyIdentifier"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "validateWithPublicaCnpj", type: "boolean", default: false, description: "Ativa validacao externa opcional.", semanticRole: "behavior", bindable: true },
    { name: "publicaCnpjErrorMessage", type: "string", description: "Mensagem para falha na consulta externa.", semanticRole: "validation", bindable: true },
    { name: "invalidMessage", type: "string", description: "Mensagem para CNPJ invalido.", semanticRole: "validation", bindable: true },
    { name: "validateOnBlur", type: "boolean", default: true, description: "Executa validacao no blur.", semanticRole: "behavior", bindable: true },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validacao.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-cnpj/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-cnpj/sg-input-cnpj.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-cnpj",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.document.cnpj",
    acceptsDataBinding: true,
    defaultProps: {
      clearButton: true,
      labelPosition: "float",
      validateOnBlur: true,
      validateWithPublicaCnpj: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de CNPJ em formularios de empresa.",
    "Identificacao fiscal de organizacoes brasileiras.",
    "Fluxos de cadastro de fornecedor, cliente corporativo e emitente."
  ],
  avoidUseCases: [
    "CPF ou documentos de pessoa fisica; nesses casos prefira SgInputCPF.",
    "Texto livre, codigos internos ou email.",
    "Valores numericos genericos e datas."
  ],
  synonyms: ["cnpj", "company tax id", "documento cnpj", "business tax id"],
  relatedEntityFields: ["cnpj", "companyDocument", "taxId", "organizationDocument"],
  compositionHints: [
    "Combinar com SgInputEmail, SgInputPhone e SgInputPostalCode em cadastros de empresa.",
    "Usar dentro de SgPanel em secoes de identificacao corporativa."
  ],
  rankingSignals: {
    freeText: 0.1,
    structuredChoice: 0,
    date: 0,
    number: 0.68,
    denseLayout: 0.75
  }
};
