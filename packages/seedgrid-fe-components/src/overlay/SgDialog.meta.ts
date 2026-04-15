import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.dialog",
  package: "@seedgrid/fe-components",
  exportName: "SgDialog",
  slug: "sg-dialog",
  displayName: "SgDialog",
  category: "feedback",
  subcategory: "dialog",
  description:
    "Overlay modal para apresentar conteudo focado, confirmacoes e fluxos curtos com controle de abertura, fechamento e severidade visual.",
  tags: ["feedback", "dialog", "modal", "overlay", "focus"],
  capabilities: ["modal", "controlled-open", "severity", "size", "animation", "auto-close"],
  fieldSemantics: ["dialog", "modal", "overlay", "focusedContent", "interruption"],
  props: [
    {
      name: "open",
      type: "boolean",
      description: "Controla a abertura do dialog em modo controlado.",
      semanticRole: "value",
      bindable: true
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback disparado quando o estado de abertura muda.",
      semanticRole: "event",
      bindable: false
    },
    {
      name: "title",
      type: "ReactNode",
      description: "Titulo principal do dialog.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "subtitle",
      type: "ReactNode",
      description: "Subtitulo complementar do dialog.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Conteudo principal do corpo do dialog.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl" | "full"',
      default: "md",
      description: "Escala do container modal.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger" | "plain"',
      default: "plain",
      description: "Tom semantico do cabecalho e acentos visuais.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "closeOnOverlayClick",
      type: "boolean",
      default: true,
      description: "Fecha o dialog ao clicar fora do conteudo.",
      semanticRole: "behavior",
      bindable: true
    }
  ],
  states: ["closed", "open", "loading", "auto-close"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-dialog/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-dialog/sg-dialog.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-dialog",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "feedback.dialog",
    acceptsDataBinding: true,
    defaultProps: {
      size: "md",
      severity: "plain",
      closeOnOverlayClick: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir conteudo focado que interrompe temporariamente o fluxo principal.",
    "Abrir detalhes, formularios curtos, confirmacoes e avisos modais.",
    "Cenarios com controle explicito de abertura e fechamento."
  ],
  avoidUseCases: [
    "Feedback leve e nao bloqueante; nesses casos prefira toast ou badge.",
    "Secoes permanentes da tela; nesses casos prefira componentes de layout.",
    "Captura de um unico valor simples sem contexto modal; nesses casos prefira input direto."
  ],
  synonyms: ["dialog", "modal", "overlay modal", "popup dialog"],
  relatedEntityFields: ["dialogState", "modalContent", "detailsOverlay", "editModal"],
  compositionHints: [
    "Usar com SgButton para gatilhos de abertura e acoes de confirmacao.",
    "Combinar com SgStack e sgInput* para formularios modais curtos."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.7
  }
};
