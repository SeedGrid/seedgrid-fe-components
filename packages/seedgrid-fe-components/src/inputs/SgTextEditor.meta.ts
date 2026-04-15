import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.textEditor",
  package: "@seedgrid/fe-components",
  exportName: "SgTextEditor",
  slug: "sg-text-editor",
  displayName: "SgTextEditor",
  category: "input",
  subcategory: "rich-text",
  description: "Editor de texto rico para conteudo formatado, comentarios elaborados e edicao textual com recursos visuais.",
  tags: ["form", "rich-text", "editor", "content", "html"],
  capabilities: ["rich-text", "formatted-content", "toolbar", "upload-hooks", "save-metadata"],
  fieldSemantics: ["richText", "formattedDescription", "articleBody", "htmlContent"],
  props: [
    { name: "id", type: "string", description: "Identificador unico do editor.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "value", type: "string", description: "Conteudo atual do editor.", semanticRole: "value", bindable: true },
    { name: "readOnly", type: "boolean", default: false, description: "Impede edicao do conteudo.", semanticRole: "behavior", bindable: true },
    { name: "placeholder", type: "string", description: "Texto de ajuda inicial.", semanticRole: "appearance", bindable: true },
    { name: "height", type: "number | string", description: "Altura do editor.", semanticRole: "appearance", bindable: true },
    { name: "onChange", type: "(value: string) => void", description: "Callback de mudanca do conteudo.", semanticRole: "event", bindable: false },
    { name: "onSave", type: "(meta: SgTextEditorSaveMeta) => void", description: "Callback de persistencia do conteudo.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "readOnly", "disabled", "error"],
  showcase: { route: "/components/sg-text-editor", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.richText",
    acceptsDataBinding: true,
    defaultProps: { readOnly: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Conteudo formatado com negrito, listas e estrutura rica.",
    "Descricoes longas com semantica de rich text.",
    "Cenarios editoriais, comunicados e observacoes elaboradas."
  ],
  avoidUseCases: [
    "Campos curtos ou texto simples; nesses casos prefira SgInputText ou SgInputTextArea.",
    "Dados estruturados, numericos ou temporais.",
    "Inputs de autenticacao ou selecao."
  ],
  synonyms: ["text editor", "rich text editor", "wysiwyg", "formatted text"],
  relatedEntityFields: ["content", "body", "descriptionHtml", "article", "notesHtml"],
  compositionHints: [
    "Combinar com SgButton para salvar e publicar conteudo.",
    "Usar em paineis de edicao de conteudo e CMS."
  ],
  rankingSignals: { freeText: 0.99, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.35 }
};
