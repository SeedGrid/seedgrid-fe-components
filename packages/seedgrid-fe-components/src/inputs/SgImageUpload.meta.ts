import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.image-upload",
  package: "@seedgrid/fe-components",
  exportName: "SgImageUpload",
  slug: "sg-image-upload",
  displayName: "SgImageUpload",
  category: "input",
  subcategory: "file",
  description:
    "Seleciona uma imagem (clique ou arrastar e soltar), valida tipo, tamanho, dimensao minima e proporcao, mostra a pre-visualizacao e permite remover. Nao envia nada ao servidor: entrega o arquivo ao pai.",
  tags: ["form", "image", "upload", "photo", "avatar", "file", "rhf"],
  capabilities: ["rhf", "controlled", "drag-and-drop", "preview", "validation"],
  fieldSemantics: ["image", "photo", "avatar", "logo", "picture", "attachment"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo para formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido acima da area.", semanticRole: "label", bindable: true },
    { name: "value", type: "File | string | null", description: "Imagem controlada: arquivo escolhido ou URL de uma imagem ja salva.", semanticRole: "data", bindable: true },
    { name: "accept", type: "string", default: "image/*", description: "Tipos aceitos (image/*, image/png, .png), separados por virgula.", semanticRole: "validation", bindable: true },
    { name: "maxSizeBytes", type: "number", description: "Tamanho maximo em bytes.", semanticRole: "validation", bindable: true },
    { name: "minWidth", type: "number", description: "Largura minima em px.", semanticRole: "validation", bindable: true },
    { name: "minHeight", type: "number", description: "Altura minima em px.", semanticRole: "validation", bindable: true },
    { name: "aspect", type: "number", description: "Proporcao largura/altura exigida (1 = quadrada).", semanticRole: "validation", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita a escolha e a remocao.", semanticRole: "appearance", bindable: true },
    { name: "onChange", type: "(file: File | null) => void", description: "Arquivo valido escolhido ou null ao remover.", semanticRole: "event", bindable: false },
    { name: "onError", type: "(code, message) => void", description: "Arquivo recusado (type, size, dimension, aspect).", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "loading", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-image-upload/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-image-upload/sg-image-upload.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: { route: "/components/sg-image-upload", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "field.image", acceptsDataBinding: true, defaultProps: {} }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Foto de perfil, avatar, logotipo ou foto de documento com pre-visualizacao.",
    "Escolher uma imagem validando tipo, tamanho e dimensao antes de enviar.",
    "Formularios que precisam de uma imagem como campo."
  ],
  avoidUseCases: [
    "Arquivos que nao sao imagem (PDF, planilhas); nesses casos use um campo de arquivo generico.",
    "Capturar pela camera do dispositivo; para isso use SgCameraCapture.",
    "Recorte ou compressao de imagem; nao fazem parte do componente."
  ],
  synonyms: ["image upload", "photo upload", "avatar picker", "enviar foto", "upload de imagem", "logo upload"],
  relatedEntityFields: ["photo", "avatar", "logo", "image", "picture", "documentPhoto"],
  compositionHints: [
    "Envie o File recebido em onChange pelo servico de arquivos do host; o componente nunca envia sozinho.",
    "Combine com SgPanel e SgInputText em cadastros de pessoa ou produto."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.1, date: 0, number: 0, denseLayout: 0.4 }
};
