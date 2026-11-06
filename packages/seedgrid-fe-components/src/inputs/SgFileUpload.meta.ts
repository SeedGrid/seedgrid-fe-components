import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.file-upload",
  package: "@seedgrid/fe-components",
  exportName: "SgFileUpload",
  slug: "sg-file-upload",
  displayName: "SgFileUpload",
  category: "input",
  subcategory: "file",
  description:
    "Seleciona um ou varios arquivos (clique ou arrastar e soltar), confere o tipo pelo conteudo e valida quantidade e tamanho (por arquivo e total). Mostra a lista com o icone do tipo e permite remover. Nao envia nada ao servidor: entrega os arquivos ao pai.",
  tags: ["form", "file", "upload", "attachment", "document", "pdf", "spreadsheet", "rhf"],
  capabilities: ["rhf", "controlled", "drag-and-drop", "multiple", "validation"],
  fieldSemantics: ["file", "attachment", "document", "upload", "pdf", "spreadsheet"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "name", type: "string", description: "Nome do campo para formularios.", semanticRole: "data", bindable: true },
    { name: "label", type: "string", description: "Rotulo exibido acima da area.", semanticRole: "label", bindable: true },
    { name: "value", type: "SgFileValue[] | null", description: "Arquivos controlados (sempre lista; um arquivo = lista de um). Um arquivo ja salvo entra como { name, url }.", semanticRole: "data", bindable: true },
    { name: "mediaType", type: "MediaType[]", description: "Tipos aceitos: image, video, audio, pdf, doc, docx, xls, xlsx, ppt, pptx, csv, txt, zip ou all. O tipo e conferido pelo conteudo do arquivo.", semanticRole: "validation", bindable: true },
    { name: "accept", type: "string", description: "Tipos extras em texto livre (.pdf, image/png, image/*), separados por virgula; soma-se ao mediaType.", semanticRole: "validation", bindable: true },
    { name: "maxFiles", type: "number", default: 1, description: "Quantos arquivos o campo guarda. Com 1, escolher outro substitui; maior que 1 liga a selecao multipla.", semanticRole: "validation", bindable: true },
    { name: "maxSizePerFile", type: "SizeLimit", description: "Tamanho maximo de cada arquivo: bytes (numero) ou texto com unidade (\"500KB\", \"1.5MB\", \"1GB\").", semanticRole: "validation", bindable: true },
    { name: "maxSizeTotal", type: "SizeLimit", description: "Tamanho maximo da soma dos arquivos: bytes (numero) ou texto com unidade.", semanticRole: "validation", bindable: true },
    { name: "enabled", type: "boolean", default: true, description: "Desabilita a escolha e a remocao.", semanticRole: "appearance", bindable: true },
    { name: "onChange", type: "(files: SgFileValue[]) => void", description: "Lista de arquivos validos apos escolher ou remover.", semanticRole: "event", bindable: false },
    { name: "onError", type: "(code: FileErrorCode, message: string, fileName: string) => void", description: "Arquivo recusado (type, size, total, count). Os demais seguem validos.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "loading", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-file-upload/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "many",
      title: "Varios arquivos",
      file: "apps/showcase/src/app/components/sg-file-upload/samples/varios.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-file-upload/sg-file-upload.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: { route: "/components/sg-file-upload", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "field.file", acceptsDataBinding: true, defaultProps: {} }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Anexar um ou varios documentos (PDF, planilhas, apresentacoes, zip) a um cadastro ou solicitacao.",
    "Escolher arquivos validando tipo (pelo conteudo), quantidade e tamanho antes de enviar.",
    "Formularios que precisam de arquivos como campo."
  ],
  avoidUseCases: [
    "Fotos e imagens com miniatura, dimensao minima ou proporcao; para isso use SgImageUpload.",
    "Capturar pela camera do dispositivo; para isso use SgCameraCapture.",
    "Envio ao servidor ou progresso de upload; nao fazem parte do componente."
  ],
  synonyms: ["file upload", "attachment", "anexar arquivo", "upload de arquivo", "documento", "file picker"],
  relatedEntityFields: ["attachment", "document", "file", "contract", "invoice", "receipt"],
  compositionHints: [
    "Envie os arquivos recebidos em onChange pelo servico de arquivos do host; o componente nunca envia sozinho.",
    "Para imagens com miniatura e regras de dimensao, use SgImageUpload (composicao deste componente)."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.1, date: 0, number: 0, denseLayout: 0.4 }
};
