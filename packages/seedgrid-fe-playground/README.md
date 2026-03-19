# @seedgrid/fe-playground

Wrapper leve em torno do `SgPlayground`, um componente baseado em Sandpack que combina editor, preview e runtime SeedGrid dentro de um card responsivo.

## Características

- Presets (`auto`, `basic`, `seedgrid`, `editor`, `full`) que ajustam dependências, shims e comportamento do bundler.
- Experiência integrada com botões e cartões SeedGrid (`SgButton`, `SgCard`), incluindo cabeçalho customizável e modos colapsáveis.
- Suporte a registries NPM privadas através de `npmRegistries`, controle de tamanho (`resizable`, `height`, `expandedHeight`) e carregamento automático de dependências (`seedgridDependency`).
- Ambiente seguro para bibliotecas pesadas: evita o download de lucide, markdown-it e qrcode quando o preset não exige.
- Hooks internos do Sandpack via `SandpackProvider`, `SandpackCodeEditor` e `SandpackPreview`.

## Instalação

```bash
pnpm add @seedgrid/fe-playground @seedgrid/fe-components
```

## Como utilizar

```tsx
import { SgPlayground } from "@seedgrid/fe-playground";

export function PlaygroundExample() {
  return (
    <SgPlayground
      code={`<>Olá SeedGrid!</>`}
      preset="seedgrid"
      interactive
      title="Experimentando componentes"
      description="Duplo clique para editar o código do componente."
      expandedHeight="500px"
      resizable
      previewPadding={24}
    />
  );
}
```

## Props em destaque

- `code`: string com JSX/TSX inicial.
- `preset`: escolhe configurações prontas (`auto`, `basic`, `seedgrid`, `editor`, `full`).
- `interactive`: ativa interação no preview.
- `dependencies`: adiciona dependências extras ao sandbox.
- `npmRegistries`: lista de registries private com `registryUrl`, `enabledScopes` e `registryAuthToken`.
- `expandable`, `collapsible`, `defaultOpen`: controla se o card inicia aberto e pode ser recolhido.
- `seedgridDependency`: força uma versão específica da runtime SeedGrid.

## Recursos

- [Sandpack React](https://sandpack.codesandbox.io) para editor + preview isolado.
- Fidelity SeedGrid com `SgButton`, `SgCard` e estilos compartilhados.
- Presets que simulam o ambiente dos componentes oficiais do design system.

## Exemplo avançado

```tsx
<SgPlayground
  code={`<Badge label="Novo!" color="success" />`}
  preset="full"
  withCard
  collapsible
  defaultOpen={false}
  npmRegistries={[
    {
      registryUrl: "https://registry.npmjs.org/",
      enabledScopes: ["@seedgrid"],
      limitToScopes: true
    }
  ]}
  dependencies={{
    "@seedgrid/fe-components": "workspace:*",
    "@seedgrid/fe-theme": "workspace:*"
  }}
/>
```

