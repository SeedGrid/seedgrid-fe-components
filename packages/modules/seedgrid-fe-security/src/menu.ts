// Algoritmo de menu-por-permissão (portado do admin-web Shell.tsx). Funções PURAS —
// sem React, client-safe. A app fornece a árvore `NavItem[]` (conteúdo específico dela)
// e as funções hasPermission/hasRole (do usePermissions); estas funções filtram.

export interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
  /**
   * Permissão de READ exigida para ver o item. Regras (canShowItem):
   * - grupo (com children): aparece se tiver >=1 filho visível;
   * - leaf com `permission`: exige hasPermission(permission);
   * - leaf SEM `permission` (feature de plataforma sem perm dedicada): só adminRole;
   * - home "/" é sempre pública.
   */
  permission?: string;
}

/** Href efetivo de um item: o do 1º filho (se grupo) ou o próprio. */
export function resolveNavHref(item: NavItem): string {
  return item.children?.[0]?.href ?? item.href;
}

export function canShowItem(
  item: NavItem,
  hasPermission: (permission: string) => boolean,
  hasRole: (role: string) => boolean,
  adminRole = "ADMIN",
): boolean {
  // Grupo: aparece se tiver >=1 filho visível — quem decide são os filhos (o
  // filterNavItems dropa o grupo se sobrar 0). NÃO gateie o grupo pelo próprio href,
  // senão some um grupo cujo filho o usuário PODE ver.
  if (item.children?.length) {
    return true;
  }
  // Home sempre pública.
  if (item.href === "/") {
    return true;
  }
  // Leaf com permissão declarada: exige a permissão de read.
  if (item.permission) {
    return hasPermission(item.permission);
  }
  // Leaf de plataforma sem permissão dedicada no backend: só adminRole.
  return hasRole(adminRole);
}

/** Filtra recursivamente a árvore, dropando grupos que ficaram sem filhos visíveis. */
export function filterNavItems(
  items: NavItem[],
  hasPermission: (permission: string) => boolean,
  hasRole: (role: string) => boolean,
  adminRole = "ADMIN",
): NavItem[] {
  return items.flatMap((item) => {
    if (!canShowItem(item, hasPermission, hasRole, adminRole)) {
      return [];
    }

    if (!item.children?.length) {
      return [item];
    }

    const children = filterNavItems(item.children, hasPermission, hasRole, adminRole);
    if (children.length === 0) {
      return [];
    }

    return [{ ...item, children }];
  });
}
