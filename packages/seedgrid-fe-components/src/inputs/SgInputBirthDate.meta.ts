import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.birthDate",
  package: "@seedgrid/fe-components",
  exportName: "SgInputBirthDate",
  slug: "sg-input-birth-date",
  displayName: "SgInputBirthDate",
  category: "input",
  subcategory: "birth-date",
  description:
    "Campo especializado para data de nascimento com validacao de idade minima e maxima sobre a base de SgInputDate.",
  tags: ["form", "birth-date", "date", "age", "rhf"],
  capabilities: ["rhf", "controlled", "date-format", "min-age", "max-age", "validation"],
  fieldSemantics: ["birthDate", "personBirthDate", "ageConstrainedDate", "personalData"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo em formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "minAge", type: "number", description: "Idade minima permitida.", semanticRole: "validation", bindable: true },
    { name: "maxAge", type: "number", description: "Idade maxima permitida.", semanticRole: "validation", bindable: true },
    { name: "minDate", type: "string | Date", description: "Data minima permitida.", semanticRole: "validation", bindable: true },
    { name: "maxDate", type: "string | Date", description: "Data maxima permitida.", semanticRole: "validation", bindable: true },
    { name: "onValidation", type: "(message: string | null) => void", description: "Callback para estado de validacao.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-input-birth-date/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-birth-date/sg-input-birth-date.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-birth-date",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.birthDate",
    acceptsDataBinding: true,
    defaultProps: {
      labelPosition: "float",
      clearButton: true,
      validateOnBlur: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Captura de data de nascimento em cadastros de pessoa.",
    "Formularios com restricao de idade minima ou maxima.",
    "Campos temporais ligados a identidade pessoal."
  ],
  avoidUseCases: [
    "Datas genericas de agenda ou vencimento; nesses casos prefira SgInputDate.",
    "Texto livre ou documentos; nesses casos prefira os inputs especificos.",
    "Numeros ou valores monetarios."
  ],
  synonyms: ["birth date", "date of birth", "dob", "data de nascimento"],
  relatedEntityFields: ["birthDate", "dateOfBirth", "dob"],
  compositionHints: [
    "Combinar com SgInputCPF, SgInputEmail e SgInputPhone em cadastros pessoais.",
    "Usar dentro de SgPanel em secoes de dados pessoais."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.05,
    date: 0.98,
    number: 0,
    denseLayout: 0.7
  }
};
