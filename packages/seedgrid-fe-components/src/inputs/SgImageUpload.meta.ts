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
    "Seleciona uma ou varias imagens (clique ou arrastar e soltar), valida tipo (pelo conteudo), tamanho, dimensao minima e proporcao, mostra as miniaturas e permite remover. Composicao do SgFileUpload. Nao envia nada ao servidor: entrega os arquivos ao pai.",
  tags: ["form", "image", "upload", "photo", "avatar", "file", "rhf"],
  capabilities: ["rhf", "controlled", "drag-and-drop", "preview", "validation"],
  fieldSemantics: ["image", "photo", "avatar", "logo", "picture", "attachment"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo para formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido acima da area.", semanticRole: "label", bindable: true },
    { name: "value", type: "SgFileValue[] | null", description: "Imagens controladas (sempre lista; uma imagem = lista de uma). Uma imagem ja salva entra como { name, url }.", semanticRole: "data", bindable: true },
    { name: "accept", type: "string", description: "Restringe os formatos de imagem em texto livre (.png, image/jpeg), separados por virgula.", semanticRole: "validation", bindable: true },
    { name: "maxFiles", type: "number", default: 1, description: "Quantas imagens o campo guarda. Com 1, escolher outra substitui; maior que 1 liga a selecao multipla e a grade de miniaturas.", semanticRole: "validation", bindable: true },
    { name: "maxSizePerFile", type: "SizeLimit", description: "Tamanho maximo de cada imagem: bytes (numero) ou texto com unidade (\"500KB\", \"2MB\").", semanticRole: "validation", bindable: true },
    { name: "maxSizeTotal", type: "SizeLimit", description: "Tamanho maximo da soma das imagens: bytes (numero) ou texto com unidade.", semanticRole: "validation", bindable: true },
    { name: "minWidth", type: "number", description: "Largura minima em px.", semanticRole: "validation", bindable: true },
    { name: "minHeight", type: "number", description: "Altura minima em px.", semanticRole: "validation", bindable: true },
    { name: "aspect", type: "number", description: "Proporcao largura/altura exigida (1 = quadrada).", semanticRole: "validation", bindable: true },
    { name: "enabled", type: "boolean", default: true, description: "Desabilita a escolha e a remocao.", semanticRole: "appearance", bindable: true },
    { name: "onChange", type: "(files: SgFileValue[]) => void", description: "Lista de imagens validas apos escolher ou remover.", semanticRole: "event", bindable: false },
    { name: "onError", type: "(code: FileErrorCode, message: string, fileName: string) => void", description: "Imagem recusada (type, size, total, count, dimension, aspect). As demais seguem validas.", semanticRole: "event", bindable: false }
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
      id: "many",
      title: "Varias imagens",
      file: "apps/showcase/src/app/components/sg-image-upload/samples/varias.tsx.sample",
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
    "Escolher uma ou varias imagens validando tipo, tamanho e dimensao antes de enviar.",
    "Formularios que precisam de imagens como campo."
  ],
  avoidUseCases: [
    "Arquivos que nao sao imagem (PDF, planilhas); nesses casos use SgFileUpload.",
    "Capturar pela camera do dispositivo; para isso use SgCameraCapture.",
    "Recorte ou compressao de imagem; nao fazem parte do componente."
  ],
  synonyms: ["image upload", "photo upload", "avatar picker", "enviar foto", "upload de imagem", "logo upload"],
  relatedEntityFields: ["photo", "avatar", "logo", "image", "picture", "documentPhoto"],
  compositionHints: [
    "Envie os arquivos recebidos em onChange pelo servico de arquivos do host; o componente nunca envia sozinho.",
    "Combine com SgPanel e SgInputText em cadastros de pessoa ou produto."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.1, date: 0, number: 0, denseLayout: 0.4 }
};
