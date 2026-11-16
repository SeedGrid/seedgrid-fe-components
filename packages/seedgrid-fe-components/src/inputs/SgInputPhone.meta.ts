import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.phone",
  package: "@seedgrid/fe-components",
  exportName: "SgInputPhone",
  slug: "sg-input-phone",
  displayName: "SgInputPhone",
  category: "input",
  subcategory: "phone",
  description:
    "Campo especializado para telefone com máscara, validação de comprimento e integração com formulários. Contrato de valor: o valor do formulário (onChange avulso, control e register) e SEMPRE mascarado, digitado ou setado por código (defaultValues, setValue, reset, value); a entrada aceita valor cru ou mascarado; valor maior que a máscara e cortado; telefone com +55 perde o DDI; para guardar só dígitos use value.replace(/\\D/g, \"\").",
  tags: ["form", "phone", "contact", "mask", "rhf"],
  capabilities: ["rhf", "mask", "validation", "phone-format", "clearable"],
  fieldSemantics: ["phone", "mobilePhone", "contactPhone", "telephoneNumber"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador único do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formulários.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rótulo exibido ao usuário.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatório.", semanticRole: "validation", bindable: true },
    { name: "lengthMessage", type: "string", description: "Mensagem para telefone com tamanho inválido.", semanticRole: "validation", bindable: true },
    { name: "invalidMessage", type: "string", description: "Mensagem para telefone inválido.", semanticRole: "validation", bindable: true },
    { name: "validateOnBlur", type: "boolean", default: true, description: "Executa validação no blur.", semanticRole: "behavior", bindable: true },
    { name: "inputProps", type: "InputHTMLAttributes<HTMLInputElement>", description: "Props nativos do input.", semanticRole: "appearance", bindable: false },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validação.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-phone/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-phone/sg-input-phone.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-phone",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.phone",
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
    "Captura de telefone ou celular de contato.",
    "Formularios de cadastro e atendimento com validacao basica de comprimento.",
    "Campos que exigem mascara e inputMode numerico."
  ],
  avoidUseCases: [
    "Email ou outros contatos estruturados; nesses casos prefira o componente especifico.",
    "Texto livre, observacoes ou codigos internos.",
    "Valores monetarios, datas e selecoes estruturadas."
  ],
  synonyms: ["phone", "telephone", "mobile", "phone input", "contact phone"],
  relatedEntityFields: ["phone", "mobilePhone", "telephone", "contactPhone", "whatsapp"],
  compositionHints: [
    "Combinar com SgInputEmail e SgButton em formularios de contato.",
    "Usar dentro de SgPanel em blocos de dados cadastrais."
  ],
  rankingSignals: {
    freeText: 0.1,
    structuredChoice: 0,
    date: 0,
    number: 0.72,
    denseLayout: 0.7
  }
};
