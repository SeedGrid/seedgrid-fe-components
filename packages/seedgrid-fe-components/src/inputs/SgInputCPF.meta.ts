import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.cpf",
  package: "@seedgrid/fe-components",
  exportName: "SgInputCPF",
  slug: "sg-input-cpf",
  displayName: "SgInputCPF",
  category: "input",
  subcategory: "document",
  description:
    "Campo especializado para CPF com máscara, validação de dígitos e integração com fluxos de cadastro de pessoa física. Contrato de valor: o valor do formulário (onChange avulso, control e register) e SEMPRE mascarado, digitado ou setado por código (defaultValues, setValue, reset, value); a entrada aceita valor cru ou mascarado; valor maior que a máscara e cortado; para guardar só dígitos use value.replace(/\\D/g, \"\").",
  tags: ["form", "document", "cpf", "brazil", "rhf"],
  capabilities: ["rhf", "mask", "validation", "cpf", "clearable"],
  fieldSemantics: ["cpf", "brazilianTaxId", "personDocument", "personalIdentifier"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador único do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formulários.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rótulo exibido ao usuário.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatório.", semanticRole: "validation", bindable: true },
    { name: "requiredMessage", type: "string", description: "Mensagem para ausência de valor.", semanticRole: "validation", bindable: true },
    { name: "lengthMessage", type: "string", description: "Mensagem para tamanho inválido.", semanticRole: "validation", bindable: true },
    { name: "invalidMessage", type: "string", description: "Mensagem para CPF inválido.", semanticRole: "validation", bindable: true },
    { name: "validateOnBlur", type: "boolean", default: true, description: "Executa validação no blur.", semanticRole: "behavior", bindable: true },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validação.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-cpf/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-cpf/sg-input-cpf.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-cpf",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.document.cpf",
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
    "Captura de CPF em formularios de pessoa fisica.",
    "Identificacao fiscal brasileira com validacao automatica.",
    "Fluxos de cadastro, onboarding e confirmacao de identidade."
  ],
  avoidUseCases: [
    "CNPJ ou documentos empresariais; nesses casos prefira SgInputCNPJ.",
    "Texto livre ou codigos genericos.",
    "Entradas monetarias, datas ou selecoes estruturadas."
  ],
  synonyms: ["cpf", "tax id", "documento cpf", "personal tax id"],
  relatedEntityFields: ["cpf", "document", "taxId", "personDocument"],
  compositionHints: [
    "Combinar com SgInputBirthDate e SgInputEmail em cadastro de pessoa fisica.",
    "Usar dentro de SgPanel em blocos de identificacao."
  ],
  rankingSignals: {
    freeText: 0.1,
    structuredChoice: 0,
    date: 0,
    number: 0.65,
    denseLayout: 0.75
  }
};
