import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.password",
  package: "@seedgrid/fe-components",
  exportName: "SgInputPassword",
  slug: "sg-input-password",
  displayName: "SgInputPassword",
  category: "input",
  subcategory: "password",
  description:
    "Campo especializado para senha com validações de política, alternância de visibilidade e indicação de força.",
  tags: ["form", "password", "security", "auth", "rhf"],
  capabilities: ["rhf", "validation", "password-policy", "strength-bar", "hide-show", "clearable"],
  fieldSemantics: ["password", "secret", "credential", "loginPassword", "newPassword"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador único do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formulários.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rótulo exibido ao usuário.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatório.", semanticRole: "validation", bindable: true },
    { name: "minSize", type: "number", default: 8, description: "Tamanho mínimo esperado da senha.", semanticRole: "validation", bindable: true },
    { name: "showStrengthBar", type: "boolean", default: true, description: "Exibe barra de força da senha.", semanticRole: "appearance", bindable: true },
    { name: "commonPasswordCheck", type: "boolean", default: true, description: "Bloqueia senhas comuns.", semanticRole: "validation", bindable: true },
    { name: "hidePassword", type: "boolean", default: true, description: "Oculta a senha inicialmente.", semanticRole: "behavior", bindable: true },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validação.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-password/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-password/sg-input-password.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-password",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.password",
    acceptsDataBinding: true,
    defaultProps: {
      hidePassword: true,
      showStrengthBar: true,
      minSize: 8,
      validateOnBlur: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de senha em login, cadastro e redefinicao de credencial.",
    "Campos que exigem politica minima de seguranca.",
    "Fluxos que precisam exibir força de senha ou alternar visibilidade."
  ],
  avoidUseCases: [
    "OTP ou codigo temporario; nesses casos prefira SgInputOTP.",
    "Texto livre, email ou identificadores publicos.",
    "Valores numericos, monetarios ou datas."
  ],
  synonyms: ["password", "secret", "credential input", "login password"],
  relatedEntityFields: ["password", "newPassword", "currentPassword", "credential"],
  compositionHints: [
    "Combinar com SgInputEmail em login e cadastro.",
    "Usar com SgButton para submit de autenticacao ou troca de senha."
  ],
  rankingSignals: {
    freeText: 0.78,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.65
  }
};
