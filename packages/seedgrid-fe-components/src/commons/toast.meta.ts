import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.toast",
  package: "@seedgrid/fe-components",
  exportName: "toast",
  slug: "toast",
  displayName: "toast",
  category: "hook",
  subcategory: "notification",
  description:
    "Funcao para disparar notificacoes toast. Oferece tipos predefinidos (success, error, warning, info, loading, default) com duracao customizavel, acoes e estilo.",
  tags: ["hook", "toast", "notification", "alert"],
  capabilities: ["type-support", "custom-styling", "actions", "promises", "dismiss"],
  fieldSemantics: ["notification", "userFeedback", "statusMessage"],
  props: [
    {
      name: "type",
      type: "SgToastType",
      required: true,
      description: "Tipo de toast (success, error, warning, info, loading, default).",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "title",
      type: "ReactNode",
      required: true,
      description: "Titulo ou mensagem principal do toast.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "options.id",
      type: "string",
      description: "ID unico para referenciar o toast.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "options.description",
      type: "ReactNode",
      description: "Descricao ou mensagem secundaria.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "options.duration",
      type: "number",
      // SEM default de proposito: a opcao por toast nao tem valor proprio no codigo
      // (`toast.duration ?? duration`), quem tem default e' o host. O antigo `default: 3000`
      // era um terceiro numero que nao existe em lugar nenhum. Espelha `options.duration` do
      // sgWhistle, que ja' era assim.
      description: "Duracao em milissegundos deste toast; tem PRIORIDADE sobre o host. Omitir NAO significa permanente: cai no `duration` do SgToaster/SgToastHost, cujo default e' 4000 (4s), igual ao par whistle/SgWhistleHost. Use 0 (ou negativo) para permanente, ate' o usuario fechar. Toast do tipo 'loading' nunca fecha sozinho, qualquer que seja o valor.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "options.action",
      type: "SgToastAction",
      description: "Acao customizada (label e onClick).",
      semanticRole: "event",
      bindable: false
    },
    {
      name: "options.closeButton",
      type: "boolean",
      default: true,
      description: "Mostrar botao de fechar.",
      semanticRole: "appearance",
      bindable: true
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
    }
  ],
  states: ["success", "error", "warning", "info", "loading", "default"],
  examples: [
    {
      id: "base-setup",
      title: "Setup basico (host + toast)",
      file: "apps/showcase/src/app/components/sg-toaster/samples/base-setup.tsx.sample",
      kind: "sample"
    },
    {
      id: "toast-types",
      title: "Tipos de toast",
      file: "apps/showcase/src/app/components/sg-toaster/samples/toast-types.tsx.sample",
      kind: "sample"
    },
    {
      id: "options-per-toast",
      title: "Opcoes por toast (duration, etc.)",
      file: "apps/showcase/src/app/components/sg-toaster/samples/options-per-toast.tsx.sample",
      kind: "sample"
    },
    {
      id: "actions-and-custom-toast",
      title: "Acao e toast customizado",
      file: "apps/showcase/src/app/components/sg-toaster/samples/actions-and-custom-toast.tsx.sample",
      kind: "sample"
    },
    {
      id: "loading-by-id-update-same-toast",
      title: "Loading atualizado pelo id",
      file: "apps/showcase/src/app/components/sg-toaster/samples/loading-by-id-update-same-toast.tsx.sample",
      kind: "sample"
    },
    {
      id: "toast-promise",
      title: "Toast com promise",
      file: "apps/showcase/src/app/components/sg-toaster/samples/toast-promise.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/sg-toaster",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Notificar sucesso de operacoes (save, delete, submit).",
    "Comunicar erros e problemas ao usuario.",
    "Exibir avisos e informacoes nao-bloqueantes.",
    "Mostrar progresso de operacoes async com tipo 'loading'."
  ],
  avoidUseCases: [
    "Dados que requerem confirmacao explícita; use SgDialog ou SgConfirmationDialog.",
    "Mensagens persistentes que o usuario deve entender; use SgBanner ou SgAlert.",
    "Feedback de validacao de formulario; use erros inline nos campos."
  ],
  synonyms: ["toast notification", "notification", "snackbar"],
  relatedEntityFields: ["success", "error", "notification", "feedback"],
  compositionHints: [
    "Envolver a arvore com SgToastHost para exibir toasts.",
    "Usar com try-catch para disparar toast de erro.",
    "Combinar com promise para loading → success/error automático.",
    "Usar subscribeSgToasts para monitorar toasts programaticamente."
  ],
  rankingSignals: {
    freeText: 0.9,
    structuredChoice: 0.6,
    date: 0.3,
    number: 0.3,
    denseLayout: 0.5
  }
};
