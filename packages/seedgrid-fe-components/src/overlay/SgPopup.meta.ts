import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.popup",
  package: "@seedgrid/fe-components",
  exportName: "SgPopup",
  slug: "sg-popup",
  displayName: "SgPopup",
  category: "feedback",
  subcategory: "popup",
  description:
    "Overlay contextual ancorado a um elemento para exibir acoes, detalhes curtos ou conteudo complementar sem abrir um modal completo.",
  tags: ["feedback", "popup", "overlay", "anchored", "contextual"],
  capabilities: ["anchored-overlay", "auto-placement", "actions", "controlled-open", "outside-click-close"],
  fieldSemantics: ["popup", "contextualOverlay", "anchoredContent", "quickActions"],
  props: [
    {
      name: "anchorRef",
      type: "React.RefObject<HTMLElement>",
      required: true,
      description: "Elemento ancora usado para posicionar o popup.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "open",
      type: "boolean",
      description: "Controla a visibilidade do popup em modo controlado.",
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
      type: "string",
      description: "Titulo opcional do popup.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "subtitle",
      type: "string",
      description: "Subtitulo opcional do popup.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "actions",
      type: "SgPopupAction[]",
      description: "Lista de acoes contextuais renderizadas no popup.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "placement",
      type: '"auto" | "top" | "right" | "bottom" | "left"',
      default: "auto",
      description: "Posicionamento principal do popup em relacao a ancora.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "closeOnOutsideClick",
      type: "boolean",
      default: true,
      description: "Fecha o popup quando o usuario clica fora dele.",
      semanticRole: "behavior",
      bindable: true
    }
  ],
  states: ["closed", "open", "positioned"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-popup/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-popup/sg-popup.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-popup",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "feedback.popup",
    acceptsDataBinding: true,
    defaultProps: {
      placement: "auto",
      closeOnOutsideClick: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir conteudo contextual curto ancorado a um botao, campo ou item da interface.",
    "Mostrar acoes rapidas, menus leves ou detalhes auxiliares sem bloquear a tela.",
    "Cenarios em que um dialog seria pesado demais para o contexto."
  ],
  avoidUseCases: [
    "Fluxos modais de confirmacao ou edicao; nesses casos prefira SgDialog ou SgConfirmationDialog.",
    "Menus complexos de navegacao persistente; nesses casos prefira SgMenu.",
    "Conteudo permanente de layout; nesses casos prefira componentes estruturais."
  ],
  synonyms: ["popup", "anchored popup", "context menu popup", "contextual overlay"],
  relatedEntityFields: ["quickActions", "detailsPopup", "contextInfo", "anchorOverlay"],
  compositionHints: [
    "Usar com SgButton, SgSplitButton ou itens clicaveis como ancora.",
    "Combinar com SgBadge ou SgAvatar para overlays contextuais compactos."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.75
  }
};
