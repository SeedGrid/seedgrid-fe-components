import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.notification-bell",
  package: "@seedgrid/fe-components",
  exportName: "SgNotificationBell",
  slug: "sg-notification-bell",
  displayName: "SgNotificationBell",
  category: "feedback",
  subcategory: "notification",
  description:
    "Sino de notificações do usuário logado: contador de não lidas, lista de até 100 notificações com título, texto, data e estado lida/não lida, marcar como lida, excluir, marcar todas e limpar. Autônomo: conecta-se sozinho ao Pulse (token vindo do backend, sem apikey no front) e reaproveita o SgRealtimeProvider se houver; com o Pulse desligado faz polling de reserva. Sem regra de negócio: cada módulo registra a ação dos tipos que emite (registerNotificationAction); a notificação só é clicável quando o backend marca actionable=true e há ação registrada, senão é informativa e o clique apenas marca como lida.",
  tags: ["notification", "bell", "inbox", "alert", "realtime", "pulse", "badge", "feedback"],
  capabilities: ["realtime", "polling-fallback", "unread-count", "mark-as-read", "delete", "reduced-motion", "aria-live"],
  fieldSemantics: ["notification", "inbox", "userNotice"],
  props: [
    { name: "apiUrl", type: "string", default: "/api/user-notifications", description: "Base das rotas da extension user-notifications (BFF, mesma origem).", semanticRole: "data", bindable: true },
    { name: "tokenEndpoint", type: "string", default: "/api/realtime/connect", description: "Rota que entrega o token do Pulse; usada quando não há SgRealtimeProvider acima.", semanticRole: "behavior", bindable: true },
    { name: "requestInit", type: "RequestInit", description: "Opções do fetch (ex.: headers com Authorization quando não há cookie).", semanticRole: "behavior", bindable: false },
    { name: "fetcher", type: "(input: string, init?: RequestInit) => Promise<Response>", description: "Substitui o fetch (apps sem BFF, testes, demonstração).", semanticRole: "behavior", bindable: false },
    { name: "types", type: "Record<string, SgNotificationTypeConfig>", description: "Tipo da notificação -> ícone (e onOpen por tipo). O sino não conhece o negócio.", semanticRole: "data", bindable: true },
    { name: "actions", type: "Record<string, SgNotificationAction>", description: "Ações por tipo só desta instância (tipo -> { label, icon, run }); têm prioridade sobre as registradas com registerNotificationAction, que é o caminho normal. Item abrível só com actionable=true e ação registrada.", semanticRole: "behavior", bindable: false },
    { name: "eventPattern", type: "string", default: "user-notification.*", description: "Evento do Pulse que dispara a leitura.", semanticRole: "behavior", bindable: true },
    { name: "pollIntervalMs", type: "number", default: 45000, description: "Intervalo do polling de reserva (só com o Pulse desligado ou fora do ar), preso entre 30 e 60 s, com jitter e backoff em erro.", semanticRole: "behavior", bindable: true },
    { name: "maxVisible", type: "number", default: 100, description: "Máximo de notificações na lista; as mais antigas saem.", semanticRole: "behavior", bindable: true },
    { name: "placement", type: "\"auto\" | \"top\" | \"right\" | \"bottom\" | \"left\"", default: "auto", description: "De que lado do sino o painel abre (como o placement do SgPopup); auto escolhe o lado em que cabe.", semanticRole: "behavior", bindable: true },
    { name: "showUnreadToggle", type: "boolean", default: "true", description: "Mostra o interruptor Não lidas no topo do painel; false esconde só o interruptor (o sino fica) e o painel lista tudo.", semanticRole: "behavior", bindable: true },
    { name: "defaultUnreadOnly", type: "boolean", default: "true", description: "O painel abre em Não lidas (ainda não clicadas); ignorada com showUnreadToggle=false e não persiste entre recargas.", semanticRole: "behavior", bindable: true },
    { name: "onNotification", type: "(notification: SgNotification) => void", description: "Chegou uma notificação nova (aviso do Pulse).", semanticRole: "event", bindable: false },
    { name: "onNotificationDelete", type: "(notification: SgNotification) => void", description: "O usuário excluiu uma notificação.", semanticRole: "event", bindable: false },
    { name: "onOpen", type: "(notification: SgNotification) => void", description: "Válvula de escape: o usuário abriu uma notificação (depois da ação do tipo, quando houver).", semanticRole: "event", bindable: false },
    { name: "onPollingTick", type: "(stats: SgPollingStats) => void", description: "O polling consultou a API: contador, instante da última consulta e motivo (disabled ou unavailable).", semanticRole: "event", bindable: false }
  ],
  states: ["loading", "empty", "list", "error"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-notification-bell/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "types",
      title: "Tipos com icone e acao",
      file: "apps/showcase/src/app/components/sg-notification-bell/samples/tipos.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-notification-bell/sg-notification-bell.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: { route: "/components/sg-notification-bell", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.notification-bell", acceptsDataBinding: true, defaultProps: {} }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Avisar o usuario logado de algo que terminou ou aconteceu (relatorio pronto, backup, importacao, convite) com historico e contador de nao lidas.",
    "Barra superior de um app com caixa de notificacoes que atualiza sozinha.",
    "Qualquer aviso persistente ao usuario que nao deve sumir sozinho."
  ],
  avoidUseCases: [
    "Mensagem rapida que some sozinha (toast): use o feedback de toast.",
    "Chat ou mensagens entre usuarios.",
    "Mostrar notificacoes sem a extension user-notifications no backend."
  ],
  synonyms: ["sino", "notificacoes", "notification bell", "inbox", "avisos do usuario", "caixa de notificacoes", "alerts"],
  relatedEntityFields: ["notification", "alert", "unread", "report", "backup"],
  compositionHints: [
    "Pôr no cabecalho do layout autenticado; sem SgRealtimeProvider acima ele abre a propria conexao.",
    "Cada modulo registra a acao dos tipos que emite com registerNotificationAction (ex.: backup.finished baixa o export); sem switch no host.",
    "A notificacao so e clicavel quando o backend marca actionable=true E ha acao registrada; sem isso e informativa (o clique so marca como lida).",
    "Use types para dar um icone a cada tipo de notificacao.",
    "O payload da notificacao so tem identificadores: a acao de abrir busca o arquivo ou registro pela API do dono."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0.2, denseLayout: 0.2 }
};
