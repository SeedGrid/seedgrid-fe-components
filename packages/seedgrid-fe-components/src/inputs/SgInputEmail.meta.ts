import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.email",
  package: "@seedgrid/fe-components",
  exportName: "SgInputEmail",
  slug: "sg-input-email",
  displayName: "SgInputEmail",
  category: "input",
  subcategory: "email",
  description:
    "Campo especializado para email com validação de formato, bloqueio opcional de domínios temporários e integração com formulários.",
  tags: ["form", "email", "contact", "login", "rhf"],
  capabilities: ["rhf", "controlled", "validation", "email-format", "blocked-domains", "clearable"],
  fieldSemantics: ["email", "contactEmail", "loginEmail", "notificationEmail"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador único do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formulários.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rótulo exibido ao usuário.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatório.", semanticRole: "validation", bindable: true },
    { name: "invalidMessage", type: "string", description: "Mensagem para email inválido.", semanticRole: "validation", bindable: true },
    { name: "blockFakeMail", type: "boolean", default: true, description: "Bloqueia domínios temporários conhecidos.", semanticRole: "behavior", bindable: true },
    { name: "blockedEmailDomains", type: "string[]", description: "Lista customizada de domínios bloqueados.", semanticRole: "data", bindable: true },
    { name: "validateOnBlur", type: "boolean", default: true, description: "Executa validação no blur.", semanticRole: "behavior", bindable: true },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validação.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-email/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-email/sg-input-email.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-email",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.email",
    acceptsDataBinding: true,
    defaultProps: {
      clearButton: true,
      labelPosition: "float",
      blockFakeMail: true,
      validateOnBlur: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de email de contato, login ou notificacao.",
    "Formularios com validacao de formato de email.",
    "Campos que precisam bloquear dominios temporarios ou descartaveis."
  ],
  avoidUseCases: [
    "Texto livre ou identificadores genericos; nesses casos prefira SgInputText.",
    "Telefone ou outros contatos nao estruturados.",
    "Senhas, OTPs ou selecoes estruturadas."
  ],
  synonyms: ["email", "email input", "mail field", "contact email"],
  relatedEntityFields: ["email", "contactEmail", "login", "usernameEmail", "notificationEmail"],
  compositionHints: [
    "Combinar com SgInputPassword em autenticacao e login.",
    "Usar com SgInputPhone e SgButton em formularios de contato."
  ],
  rankingSignals: {
    freeText: 0.7,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.7
  }
};
