import type * as React from "react";
import type { SgNotification } from "./notificationBellLogic";

/**
 * Acao de abrir uma notificacao de um tipo (P186). Quem sabe abrir (baixar o backup, ir a tela) e o modulo dono do
 * tipo: ele registra a acao uma vez; o sino nao conhece tipo nenhum e o host nao precisa de `switch`.
 */
export type SgNotificationAction = {
  /** Texto curto do que o clique faz (ex.: "Baixar"). Aparece no item abrivel e no leitor de tela. */
  label?: string;
  /** Icone do item abrivel. Default: seta. */
  icon?: React.ReactNode;
  /**
   * Executa a acao. Recebe a notificacao (o `payload` so traz identificadores, nunca URL). Se lancar erro, o sino
   * mostra a mensagem do erro no painel (use mensagens legiveis).
   */
  run: (notification: SgNotification) => void | Promise<void>;
};

const registry = new Map<string, SgNotificationAction>();
const listeners = new Set<() => void>();
let version = 0;

function changed(): void {
  version += 1;
  for (const listener of [...listeners]) listener();
}

/**
 * Registra a acao de um tipo de notificacao (cada modulo registra os tipos que emite). Devolve a funcao que desfaz o
 * registro (so desfaz se a acao ainda for a mesma). Registrar de novo o mesmo tipo substitui a acao anterior.
 */
export function registerNotificationAction(type: string, action: SgNotificationAction): () => void {
  registry.set(type, action);
  changed();
  return () => {
    if (registry.get(type) === action) {
      registry.delete(type);
      changed();
    }
  };
}

/** Remove o registro de um tipo. */
export function unregisterNotificationAction(type: string): void {
  if (registry.delete(type)) changed();
}

/** Acao registrada para o tipo, se houver. */
export function getNotificationAction(type: string): SgNotificationAction | undefined {
  return registry.get(type);
}

/** Para `useSyncExternalStore`: o sino re-renderiza quando um modulo registra depois dele. */
export function subscribeNotificationActions(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notificationActionsVersion(): number {
  return version;
}
