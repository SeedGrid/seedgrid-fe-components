import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "action.button",
  package: "@seedgrid/fe-components",
  exportName: "SgButton",
  slug: "sg-button",
  displayName: "SgButton",
  category: "action",
  subcategory: "button",
  description:
    "Botao de acao com suporte a severity, appearance, shape, loading e icones para acoes principais e secundarias.",
  tags: ["action", "button", "trigger", "cta"],
  capabilities: ["trigger", "submit", "severity", "appearance", "loading", "icon-support"],
  fieldSemantics: ["primaryAction", "secondaryAction", "submit", "confirm", "dismiss"],
  props: [
    {
      name: "label",
      type: "ReactNode",
      description: "Conteudo textual principal do botao.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      default: "primary",
      description: "Define o peso visual e semantico da acao.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "appearance",
      type: '"solid" | "outline" | "ghost"',
      default: "solid",
      description: "Variante visual base do botao.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: "button",
      description: "Comportamento HTML da acao dentro de formularios.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "loading",
      type: "boolean",
      default: false,
      description: "Exibe spinner e bloqueia o clique. Continua valendo e vence o loading automático do onClick: o loading efetivo é loading ou operação pendente (Promise/Future devolvida pelo onClick).",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "enabled",
      type: "boolean",
      default: true,
      description: "Quando false, desabilita a interacao do botao.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "leftIcon",
      type: "ReactNode",
      description: "Icone exibido antes do label.",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "rightIcon",
      type: "ReactNode",
      description: "Icone exibido depois do label.",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "onClick",
      type: "(event: MouseEvent<HTMLButtonElement>) => unknown",
      description:
        "Clique do botão; pode ser síncrono ou assíncrono. Síncrono (abrir modal, alternar): nada muda. Se DEVOLVER uma Promise/Future, como async () => { await salvar(); } ou () => salvar(), o botão entra em loading sozinho (spinner, desabilitado, aria-busy na web), ignora cliques até terminar (inclusive cliques seguidos antes de a tela atualizar) e volta ao normal ao terminar ou falhar. Protege contra duplo clique e reenvio e ajuda na idempotência da ação na tela (não substitui a chave de idempotência no servidor). Cuidado: a função precisa devolver a operação; com chaves e sem return (ou sem async), como () => { salvar(); } ou () { salvar(); }, não protege; já async () {...} sempre devolve. O erro não é engolido: o botão sai do loading e relança como rejeição não tratada; trate com try/catch dentro do onClick e avise o usuário (sgWhistle.error). Use async só quando a ação puder demorar ou falhar (salvar, enviar, pagar).",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "disabled", "loading"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-button/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "auto-loading",
      title: "Loading automático com Future",
      file: "apps/showcase/src/app/components/sg-button/samples/loading-automatico-com-future.tsx.sample",
      kind: "sample"
    },
    {
      id: "sync-vs-async",
      title: "onClick síncrono x assíncrono",
      file: "apps/showcase/src/app/components/sg-button/samples/onclick-sincrono-x-assincrono.tsx.sample",
      kind: "sample"
    },
    {
      id: "async-error",
      title: "Tratando erro no onClick assíncrono",
      file: "apps/showcase/src/app/components/sg-button/samples/tratando-erro-no-onclick-assincrono.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-button/sg-button.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-button",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "action.button",
    acceptsDataBinding: true,
    defaultProps: {
      appearance: "solid",
      severity: "primary",
      type: "button"
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Acoes primarias e secundarias em formularios e telas CRUD.",
    "Submit, confirmacao, salvar, cancelar e outras acoes explicitas do usuario.",
    "Chamadas para acao com feedback visual de loading.",
    "Salvar, enviar ou pagar: use onClick assíncrono (async () => { await salvar(); } ou () => salvar()) para o botão entrar em loading sozinho e ignorar duplo clique; acoes instantaneas (abrir modal, alternar) ficam sincronas."
  ],
  avoidUseCases: [
    "Agrupar conteudo ou estruturar layout; nesses casos prefira SgPanel, SgCard ou SgStack.",
    "Captura de dados; nesses casos prefira componentes de input.",
    "Blocos de navegacao complexa; nesses casos prefira componentes de menu ou breadcrumb."
  ],
  synonyms: ["button", "cta", "action button", "submit button"],
  relatedEntityFields: ["submit", "save", "cancel", "confirm", "delete"],
  compositionHints: [
    "Combinar com SgInputText e outros campos em formularios.",
    "Usar dentro de SgPanel ou SgDialog para acoes contextuais.",
    "O onClick precisa DEVOLVER a Promise para o loading automatico funcionar: onClick={() => { salvar(); }} (chaves sem return) nao protege; use () => salvar() ou async () => { await salvar(); }.",
    "O botao nao engole o erro do onClick assincrono: sai do loading e relanca como rejeicao nao tratada. Trate com try/catch dentro do onClick e avise o usuario com sgWhistle.error.",
    "O loading automatico protege a acao na tela (duplo clique/reenvio), mas nao substitui a chave de idempotencia no servidor. A prop loading manual vence: loading efetivo = loading ou operacao pendente."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.4
  }
};
