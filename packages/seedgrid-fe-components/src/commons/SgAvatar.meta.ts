import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.avatar",
  package: "@seedgrid/fe-components",
  exportName: "SgAvatar",
  slug: "sg-avatar",
  displayName: "SgAvatar",
  category: "feedback",
  subcategory: "avatar",
  description:
    "Representacao visual compacta de pessoa, usuario ou entidade por imagem, iniciais, icone ou fallback.",
  tags: ["feedback", "avatar", "profile", "identity", "user"],
  capabilities: ["image-avatar", "fallback", "initials", "grouping", "severity"],
  fieldSemantics: ["identity", "userAvatar", "profileImage", "entityMarker"],
  props: [
    {
      name: "src",
      type: "string",
      description: "URL da imagem principal do avatar.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "alt",
      type: "string",
      description: "Texto alternativo da imagem do avatar.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "label",
      type: "ReactNode",
      description: "Conteudo textual usado como iniciais ou identificacao visual.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "fallback",
      type: "ReactNode",
      description: "Conteudo de fallback quando nao ha imagem.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      default: "md",
      description: "Escala visual do avatar.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "shape",
      type: '"circle" | "square"',
      default: "circle",
      description: "Forma visual do avatar.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral" | "custom"',
      default: "primary",
      description: "Tom visual do avatar quando nao ha imagem.",
      semanticRole: "appearance",
      bindable: true
    }
  ],
  states: ["default", "image", "fallback", "disabled"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-avatar/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-avatar/sg-avatar.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-avatar",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "feedback.avatar",
    acceptsDataBinding: true,
    defaultProps: {
      size: "md",
      shape: "circle",
      bordered: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Representar usuarios, pessoas e entidades em listas, cards e cabecalhos.",
    "Exibir imagem de perfil, iniciais ou fallback visual de identidade.",
    "Agrupar membros de equipe ou participantes com avatar group."
  ],
  avoidUseCases: [
    "Status textuais ou contadores; nesses casos prefira SgBadge.",
    "Acoes clicaveis principais; nesses casos prefira botao.",
    "Conteudo longo ou secao de layout."
  ],
  synonyms: ["avatar", "profile image", "user avatar", "identity badge"],
  relatedEntityFields: ["avatar", "photo", "profileImage", "user", "owner"],
  compositionHints: [
    "Usar com SgBadge para status de usuario e com SgCard em cabecalhos.",
    "Combinar com SgMenu e breadcrumbs de perfil quando houver contexto de usuario."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.7
  }
};
