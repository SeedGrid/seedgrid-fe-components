# @seedgrid/fe-components

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-components)](https://www.npmjs.com/package/@seedgrid/fe-components)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-components)](https://www.npmjs.com/package/@seedgrid/fe-components)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Biblioteca de componentes React da SeedGrid, com foco em produtividade de formularios, consistencia visual e integracao com React Hook Form.

## Sumario

- [Instalacao](#instalacao)
- [Uso rapido](#uso-rapido)
- [Componentes por categoria](#componentes-por-categoria)
- [Creditos e licencas de terceiros](#creditos-e-licencas-de-terceiros)
- [Checklist para publicar no npm](#checklist-para-publicar-no-npm)
- [Suporte](#suporte)
- [Licenca do pacote](#licenca-do-pacote)

## Instalacao

Instalacao recomendada (uso geral):

```bash
pnpm add @seedgrid/fe-components @seedgrid/fe-theme react-hook-form lucide-react
```

Se voce for usar `SgTextEditor`, instale tambem os peers do TipTap:

```bash
pnpm add @tiptap/core @tiptap/pm @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-image \
  @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-color \
  @tiptap/extension-highlight @tiptap/extension-subscript @tiptap/extension-superscript \
  @tiptap/extension-font-family
```

Alternativas:

```bash
npm i @seedgrid/fe-components @seedgrid/fe-theme react-hook-form lucide-react
```

```bash
yarn add @seedgrid/fe-components @seedgrid/fe-theme react-hook-form lucide-react
```

## Uso rapido

### 1) Theme provider (recomendado)

```tsx
import { SeedThemeProvider } from "@seedgrid/fe-theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SeedThemeProvider
          initialTheme={{
            seed: "#16803D",
            mode: "auto",
            radius: 12
          }}
        >
          {children}
        </SeedThemeProvider>
      </body>
    </html>
  );
}
```

### 2) Formulario com React Hook Form

```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { SgButton, SgInputEmail, SgInputText, SgStack } from "@seedgrid/fe-components";

type FormValues = {
  nome: string;
  email: string;
};

export default function ExampleForm() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { nome: "", email: "" }
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SgStack gap={12}>
        <SgInputText
          id="nome"
          name="nome"
          register={register}
          label="Nome"
          required
          requiredMessage="Informe o nome."
        />
        <SgInputEmail
          id="email"
          name="email"
          register={register}
          label="Email"
          required
        />
        <SgButton label="Salvar" type="submit" />
      </SgStack>
    </form>
  );
}
```

## Componentes por categoria

- Inputs: `SgInputText`, `SgInputEmail`, `SgInputPassword`, `SgInputDate`, `SgInputPhone`, `SgInputCPF`, `SgInputCNPJ`, `SgInputCPFCNPJ`, `SgTextEditor`, `SgDatatable`, entre outros.
- Buttons: `SgButton`, `SgSplitButton`, `SgFloatActionButton`.
- Layout: `SgGrid`, `SgStack`, `SgCard`, `SgPanel`, `SgDockLayout`, `SgDockScreen`, `SgScreen`.
- Menus: `SgMenu`, `SgDockMenu`, `SgBreadcrumb`.
- Digits: `SgFlipDigit`, `SgFadeDigit`, `SgMatrixDigit`, `SgNeonDigit`, `SgSevenSegmentDigit`.
- Gadgets: `SgClock`, `SgCalendar`, `SgQRCode`, `SgLinearGauge`, `SgRadialGauge`, `SgStringAnimator`.
- Providers/Hooks: `SgEnvironmentProvider`, `SgTimeProvider`, `useSgPersistentState`, `useSgTime`, `useSgPersistence`.

Para exemplos completos e props de cada componente, use o showcase local em `apps/showcase`.

## Creditos e licencas de terceiros

Principais bibliotecas usadas pelo pacote:

| Biblioteca | Licenca | Uso principal |
| --- | --- | --- |
| [`@pqina/flip`](https://pqina.nl/flip/) | MIT | Animacao do `SgFlipDigit` |
| [`@codesandbox/sandpack-react`](https://sandpack.codesandbox.io/) | Apache-2.0 | `SgPlayground` (editor e preview) |
| [`qrcode.react`](https://github.com/zpao/qrcode.react) | ISC | Renderizacao de QR Code |
| [`@tiptap/react`](https://tiptap.dev/) | MIT | Base do `SgTextEditor` |
| [`lucide-react`](https://lucide.dev/) | ISC | Iconografia em varios componentes |
| [`@dnd-kit/core`](https://dndkit.com/) | MIT | Interacoes de drag and drop |

Lista de creditos em formato de pagina: `apps/showcase/src/app/credits/page.tsx`.

## Checklist para publicar no npm

1. Atualizar este `README.md`.
2. Garantir `version` correta no `package.json`.
3. Rodar build e typecheck do pacote:

```bash
pnpm -C packages/seedgrid-fe-components typecheck
pnpm -C packages/seedgrid-fe-components build
```

4. Validar pacote antes de publicar:

```bash
npm publish --dry-run
```

5. Publicar:

```bash
npm publish --access public
```

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositorio: https://github.com/SeedGrid/seedgrid-fe-components
- Home do pacote: https://github.com/SeedGrid/seedgrid-fe-components/tree/main/packages/seedgrid-fe-components

## Licenca do pacote

MIT

Consulte o arquivo `LICENSE` deste pacote para o texto completo.
