import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.avatar-group",
  package: "@seedgrid/fe-components",
  exportName: "SgAvatarGroup",
  slug: "sg-avatar-group",
  displayName: "SgAvatarGroup",
  category: "feedback",
  subcategory: "avatar-group",
  description:
    "Agrupamento visual de avatares com sobreposicao, limite de itens e contador de participantes restantes.",
  tags: ["feedback", "avatar", "group", "participants", "team"],
  capabilities: ["avatar-stack", "overlap", "max-limit", "overflow-counter", "team-display"],
  fieldSemantics: ["participants", "team", "members", "avatarStack", "collaborators"],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "Lista de avatares exibidos no agrupamento.", semanticRole: "data", bindable: false },
    { name: "max", type: "number", description: "Quantidade maxima de avatares visiveis antes do contador de overflow.", semanticRole: "behavior", bindable: true },
    { name: "total", type: "number", description: "Quantidade total de participantes para calculo do overflow.", semanticRole: "value", bindable: true },
    { name: "overlap", type: '"none" | "sm" | "md" | "lg"', default: "md", description: "Nivel de sobreposicao entre os avatares.", semanticRole: "appearance", bindable: true },
    { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: "md", description: "Escala aplicada aos avatares do grupo.", semanticRole: "appearance", bindable: true },
    { name: "shape", type: '"circle" | "square"', default: "circle", description: "Forma visual aplicada ao grupo de avatares.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default", "overflow", "stacked"],
  examples: [{ id: "avatar-group", title: "Avatar group", file: "apps/showcase/src/app/components/sg-avatar/samples/avatar-group.tsx.sample", kind: "sample" }],
  showcase: { route: "/components/sg-avatar", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.avatar-group", acceptsDataBinding: true, defaultProps: { overlap: "md", size: "md", shape: "circle" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir participantes, membros de equipe e colaboradores em cabecalhos e cards.",
    "Representar grupos com limite visual e contador de itens adicionais.",
    "Mostrar ownership, revisores ou pessoas associadas a uma entidade."
  ],
  avoidUseCases: [
    "Uma unica identidade; nesses casos prefira SgAvatar.",
    "Listas detalhadas de usuarios com texto e metadata; nesses casos prefira lista ou tabela.",
    "Status textuais e contadores puros; nesses casos prefira SgBadge."
  ],
  synonyms: ["avatar group", "team avatars", "participant stack", "member avatars"],
  relatedEntityFields: ["members", "participants", "reviewers", "owners", "team"],
  compositionHints: [
    "Usar com SgAvatar em listas, cards e cabecalhos de colaboracao.",
    "Combinar com Badge ou Card quando houver destaque de contagem ou ownership."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0.2, denseLayout: 0.82 }
};
