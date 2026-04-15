import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.otp",
  package: "@seedgrid/fe-components",
  exportName: "SgInputOTP",
  slug: "sg-input-otp",
  displayName: "SgInputOTP",
  category: "input",
  subcategory: "otp",
  description:
    "Campo OTP multi-slot para codigos de verificacao com suporte a mascara, colagem, eventos de conclusao e acesso por ref.",
  tags: ["form", "otp", "verification", "code", "security", "rhf"],
  capabilities: ["rhf", "mask", "multi-slot", "paste-support", "on-complete", "clearable"],
  fieldSemantics: ["otp", "verificationCode", "authCode", "securityCode", "tokenCode"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do componente.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "mask", type: "string", default: "999999", description: "Mascara de slots para o codigo.", semanticRole: "behavior", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "validateOnBlur", type: "boolean", default: true, description: "Executa validacao no blur.", semanticRole: "behavior", bindable: true },
    { name: "onRawChange", type: "(rawValue: string) => void", description: "Callback com o valor bruto do codigo.", semanticRole: "event", bindable: false },
    { name: "onComplete", type: "(value: string) => void", description: "Callback disparado ao completar o codigo.", semanticRole: "event", bindable: false },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validacao.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error", "complete"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-otp/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-otp/sg-input-otp.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-otp",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.otp",
    acceptsDataBinding: true,
    defaultProps: {
      mask: "999999",
      validateOnBlur: true,
      enabled: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de codigo temporario de verificacao.",
    "Fluxos de autenticacao em dois fatores e confirmacao de login.",
    "Entradas curtas e estruturadas com conclusao automatica."
  ],
  avoidUseCases: [
    "Senha permanente; nesses casos prefira SgInputPassword.",
    "Texto livre, email ou telefone.",
    "Selecoes estruturadas ou valores monetarios."
  ],
  synonyms: ["otp", "one time password", "verification code", "auth code", "token input"],
  relatedEntityFields: ["otp", "verificationCode", "token", "authCode", "pinCode"],
  compositionHints: [
    "Combinar com SgInputEmail ou SgInputPhone em fluxos de verificacao.",
    "Usar com SgButton para reenvio de codigo e confirmacao."
  ],
  rankingSignals: {
    freeText: 0.05,
    structuredChoice: 0,
    date: 0,
    number: 0.72,
    denseLayout: 0.9
  }
};
