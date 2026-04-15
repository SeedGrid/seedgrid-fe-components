import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.badge",
  package: "@seedgrid/fe-components",
  exportName: "SgBadge",
  slug: "sg-badge",
  displayName: "SgBadge",
  category: "feedback",
  subcategory: "badge",
  description:
    "Indicador compacto para status, contagens, rotulos curtos e destaque visual de pequenos estados.",
  tags: ["feedback", "badge", "status", "counter", "label"],
  capabilities: ["status-indicator", "counter", "severity", "variant", "removable", "dot"],
  fieldSemantics: ["status", "counter", "tag", "indicator", "label"],
  props: [
    {
      name: "value",
      type: "ReactNode",
      description: "Conteudo principal exibido dentro do badge.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral" | "custom"',
      default: "primary",
      description: "Tom semantico do indicador.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "badgeStyle",
      type: '"solid" | "soft" | "outline" | "ghost"',
      default: "solid",
      description: "Variante visual do badge.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg"',
      default: "md",
      description: "Escala visual do badge.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "dot",
      type: "boolean",
      default: false,
      description: "Exibe um pequeno marcador visual adicional.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "removable",
      type: "boolean",
      default: false,
      description: "Permite remover o badge com um botao interno.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "onRemove",
      type: "() => void",
      description: "Callback disparado ao remover o badge.",
      semanticRole: "event",
      bindable: false
    },
    {
      name: "onClick",
      type: "(e: React.MouseEvent) => void",
      description: "Callback disparado quando o badge e clicado.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "disabled", "removable", "clickable"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-badge/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-badge/sg-badge.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-badge",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "feedback.badge",
    acceptsDataBinding: true,
    defaultProps: {
      severity: "primary",
      badgeStyle: "solid",
      size: "md"
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir status curtos, contadores, tags e indicadores compactos.",
    "Sinalizar estados como novo, ativo, pendente, erro ou quantidade.",
    "Anotar cards, listas e cabecalhos com informacao de baixo peso."
  ],
  avoidUseCases: [
    "Mensagens longas ou feedback detalhado; nesses casos prefira alertas ou dialogs.",
    "Acoes principais; nesses casos prefira componentes de botao.",
    "Agrupamento de conteudo; nesses casos prefira componentes de layout."
  ],
  synonyms: ["badge", "tag", "status chip", "counter badge"],
  relatedEntityFields: ["status", "count", "label", "tag", "notificationCount"],
  compositionHints: [
    "Usar com SgCard, SgAvatar e listas para indicar estado ou contagem.",
    "Combinar com SgButton ou menus quando houver contadores contextuais."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0.3,
    denseLayout: 0.85
  }
};
