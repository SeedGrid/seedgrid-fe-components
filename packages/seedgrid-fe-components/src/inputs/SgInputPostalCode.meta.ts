import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.postalCode",
  package: "@seedgrid/fe-components",
  exportName: "SgInputPostalCode",
  slug: "sg-input-postal-code",
  displayName: "SgInputPostalCode",
  category: "input",
  subcategory: "postal-code",
  description:
    "Campo especializado para CEP e codigos postais com suporte a multiplos paises, mascaras e consulta opcional ao ViaCEP.",
  tags: ["form", "postal-code", "cep", "address", "rhf"],
  capabilities: ["rhf", "mask", "validation", "country-aware", "viacep", "clearable"],
  fieldSemantics: ["postalCode", "zipCode", "cep", "addressCode", "locationCode"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "country", type: "\"BR\" | \"PT\" | \"US\" | \"ES\" | \"UY\" | \"AR\" | \"PY\"", default: "BR", description: "Pais usado para mascara e validacao.", semanticRole: "behavior", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "validateWithViaCep", type: "boolean", default: false, description: "Ativa consulta ao ViaCEP para BR.", semanticRole: "behavior", bindable: true },
    { name: "lengthMessage", type: "string", description: "Mensagem para tamanho invalido.", semanticRole: "validation", bindable: true },
    { name: "invalidMessage", type: "string", description: "Mensagem para codigo invalido.", semanticRole: "validation", bindable: true },
    { name: "onViaCepResult", type: "(data: ViaCepResponse) => void", description: "Callback com resposta da consulta ViaCEP.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-postal-code/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-postal-code/sg-input-postal-code.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-postal-code",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.postalCode",
    acceptsDataBinding: true,
    defaultProps: {
      country: "BR",
      clearButton: true,
      labelPosition: "float",
      validateWithViaCep: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de CEP ou codigo postal em formularios de endereco.",
    "Campos de localizacao com comportamento dependente do pais.",
    "Fluxos brasileiros com enriquecimento via ViaCEP."
  ],
  avoidUseCases: [
    "Texto livre de endereco completo; nesses casos use campo textual complementar.",
    "Documentos pessoais, telefone ou email.",
    "Valores monetarios, datas ou selecoes estruturadas."
  ],
  synonyms: ["postal code", "zip code", "cep", "zipcode", "address code"],
  relatedEntityFields: ["postalCode", "zipCode", "cep", "addressPostalCode"],
  compositionHints: [
    "Combinar com SgInputText para logradouro e complemento.",
    "Usar com SgPanel em blocos de endereco."
  ],
  rankingSignals: {
    freeText: 0.08,
    structuredChoice: 0,
    date: 0,
    number: 0.76,
    denseLayout: 0.72
  }
};
