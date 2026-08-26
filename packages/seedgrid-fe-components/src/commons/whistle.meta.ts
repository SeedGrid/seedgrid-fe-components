import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.whistle",
  package: "@seedgrid/fe-components",
  exportName: "sgWhistle",
  slug: "sg-whistle",
  displayName: "sgWhistle",
  category: "hook",
  subcategory: "notification",
  description:
    "Funcao para disparar notificacoes whistle (banners/alertas). Oferece severidades, duracao customizavel, acoes, icones e estilos customizados.",
  tags: ["hook", "whistle", "notification", "banner", "alert"],
  capabilities: ["severity-support", "custom-styling", "actions", "promises", "dismiss"],
  fieldSemantics: ["notification", "userAlert", "bannerMessage"],
  props: [
    {
      name: "options.message",
      type: "string",
      required: true,
      description: "Mensagem principal do whistle.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "options.severity",
      type: "SgWhistleSeverity",
      default: "default",
      description: "Severidade (default, success, info, warning, error, loading).",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "options.title",
      type: "string",
      description: "Titulo opcional do whistle.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "options.id",
      type: "string",
      description: "ID unico para referenciar o whistle.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "options.icon",
      type: "ReactNode",
      description: "Icone customizado.",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "options.duration",
      type: "number",
      description: "Duracao em milissegundos deste whistle; tem PRIORIDADE sobre o host. Omitir NAO significa permanente: cai no `duration` do SgWhistler/SgWhistleHost, cujo default e' 4000 (4s), igual ao par toast/SgToastHost. Use 0 (ou negativo) para permanente, ate' o usuario fechar no x — obrigatorio quando o aviso bloqueia uma acao ou carrega um botao de acao, porque sumir leva embora a informacao e o caminho de saida junto. Severidade 'loading' nunca expira sozinha.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "options.dismissible",
      type: "boolean",
      default: true,
      description: "Permitir fechar manualmente.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "options.borderStyle",
      type: "SgWhistleBorderStyle",
      default: "solid",
      description: "Estilo da borda (solid, soft, left-accent, full-accent, none).",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "options.opacity",
      type: "number",
      description: "Opacidade (0-1).",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "options.action",
      type: "SgWhistleAction",
      description: "Acao customizada (label e onClick).",
      semanticRole: "event",
      bindable: false
    },
    {
      name: "options.className",
      type: "string",
      description: "Classe CSS customizada.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "options.style",
      type: "CSSProperties",
      description: "Estilos inline customizados.",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "options.onClose",
      type: "() => void",
      description: "Callback quando o whistle e fechado.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "success", "info", "warning", "error", "loading"],
  examples: [
    {
      id: "base-setup",
      title: "Setup basico (host + sgWhistle)",
      file: "apps/showcase/src/app/components/sg-whistler/samples/base-setup.tsx.sample",
      kind: "sample"
    },
    {
      id: "severities-and-stack",
      title: "Severidades e empilhamento",
      file: "apps/showcase/src/app/components/sg-whistler/samples/severities-and-stack.tsx.sample",
      kind: "sample"
    },
    {
      id: "actions-border-opacity",
      title: "Acao, borda e opacidade",
      file: "apps/showcase/src/app/components/sg-whistler/samples/actions-border-opacity.tsx.sample",
      kind: "sample"
    },
    {
      id: "update-by-id",
      title: "Substituir/atualizar pelo id",
      file: "apps/showcase/src/app/components/sg-whistler/samples/update-by-id.tsx.sample",
      kind: "sample"
    },
    {
      id: "custom-renderer-and-colors",
      title: "Renderer e cores customizados",
      file: "apps/showcase/src/app/components/sg-whistler/samples/custom-renderer-and-colors.tsx.sample",
      kind: "sample"
    },
    {
      id: "promise",
      title: "Whistle com promise",
      file: "apps/showcase/src/app/components/sg-whistler/samples/promise.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/whistles",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Alertas persistentes que o usuario precisa ver (warning, error).",
    "Mensagens que ocupam espaco mas nao bloqueiam a interacao.",
    "Status de operacoes async com duracao customizavel.",
    "Feedback com multiplas acoes para o usuario."
  ],
  avoidUseCases: [
    "Notificacoes rapidas que desaparecem automaticamente; use toast().",
    "Informacoes que requerem confirmacao; use SgDialog.",
    "Erros que bloqueiam a pagina; use tratamento de erro apropriado."
  ],
  synonyms: ["whistle", "banner", "alert", "notification banner"],
  relatedEntityFields: ["alert", "warning", "notification", "status"],
  compositionHints: [
    "Envolver a arvore com SgWhistleHost para exibir whistles.",
    "Usar com try-catch para disparar whistle de erro.",
    "Combinar com promise para loading → success/error automático.",
    "Usar subscribeSgWhistles para monitorar whistles programaticamente."
  ],
  rankingSignals: {
    freeText: 0.85,
    structuredChoice: 0.7,
    date: 0.4,
    number: 0.4,
    denseLayout: 0.6
  }
};
