# @seedgrid/fe-core

Biblioteca de infraestrutura que padroniza módulos, rotas, persistência e internacionalização do SeedGrid.

## Características

- **Registro centralizado** de provedores, itens de navegação e rotas (`SeedGridRegistry`).
- **Manifestos de módulos** com metadata, dependências de i18n e callbacks de registro.
- **Construção de chaves de persistência** (`buildSgPersistenceKey`) e estratégias (localStorage, API ou compostas).
- **Utilitários de i18n** para mesclar bundles e manter namespaces organizados.
- Tipagens prontas para ambientes, provedores e estratégias que facilitam a evolução do portal SeedGrid.

## Instalação

```bash
pnpm add @seedgrid/fe-core
```

## Como utilizar

```tsx
import {
  SeedGridRegistry,
  SeedGridModuleManifest,
  createLocalStorageStrategy,
  createCompositePersistenceStrategy,
  mergeMessages
} from "@seedgrid/fe-core";

const registry = new SeedGridRegistry();

const moduleManifest: SeedGridModuleManifest = {
  id: "my-module",
  name: "Módulo personalizado",
  version: "1.0.0",
  register: (registry) => {
    registry.addNavItem({
      id: "dashboard",
      labelKey: "menu.dashboard",
      href: "/dashboard"
    });
    registry.addRoute({ id: "dashboard", path: "/dashboard" });
  }
};

registry.addNavItem({
  id: "marketing",
  labelKey: "menu.marketing",
  href: "/marketing",
  order: 10
});

const messages = mergeMessages(
  { app: { welcome: "Bem-vindo" } },
  { app: { logout: "Sair" } }
);

const persistence = createCompositePersistenceStrategy({
  mode: "mirror",
  primary: createLocalStorageStrategy({ prefix: "sg:" }),
  secondary: createLocalStorageStrategy(),
});
```

## Recursos

- `SeedGridRegistry` mantém provedores, rotas e os itens de menu com ordenação.
- `SeedGridModuleManifest` centraliza i18n, versão e o hook de registro de cada módulo.
- Estruturas de persistência (`createLocalStorageStrategy`, `createApiPersistenceStrategy`, `createCompositePersistenceStrategy`) protegidas por `buildSgPersistenceKey`.
- `SeedGridMessages` e `mergeMessages` simplificam o carregamento incremental de recursos de tradução.

## Exemplos

- **Ordenar itens de menu**: use `getNavItems()` após registrar módulos e rely on `order`.
- **Persistir estado crítico**: combine `createApiPersistenceStrategy` com `createLocalStorageStrategy` para oferecer fallback offline.
- **Plugins modulares**: cada `register` no `SeedGridModuleManifest` pode adicionar provedores/contextos com `addProvider`.

