# @seedgrid/fe-theme

Sistema de temas do SeedGrid que gera paletas harmônicas, suporta os modos light/dark/auto, expõe tokens prontos e permite troca de tema em tempo de execução.

## Características

- **Geração automática de paletas** a partir de uma cor seed com rampas completas (50‑900).
- **Modo `auto`** que respeita a preferência do sistema, além de `light` e `dark`.
- **Persistência** de preferências (`seed`, `mode`, `radius`) no `localStorage`.
- **Tokens CSS** (`--sg-*`) que se integram facilmente com Tailwind, CSS-in-JS ou classes utilitárias.
- **Hooks reativos** (`useSgTheme`) e `SeedThemeProvider` para trocar tema, atualizar modos e personalizar variáveis.
- Híbrido com `ThemeProvider` antigo para migração suave.

## Instalação

```bash
pnpm add @seedgrid/fe-theme
```

## Uso básico

```tsx
import { SeedThemeProvider } from "@seedgrid/fe-theme";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <SeedThemeProvider
      initialTheme={{
        seed: "#16803D",
        mode: "auto",
        radius: 12,
        persistMode: true
      }}
    >
      {children}
    </SeedThemeProvider>
  );
}
```

## Hooks e APIs

- `useSgTheme()` retorna `{ currentMode, setMode, seed, setTheme, reset }`.
- `SeedThemeProvider` aceita `initialTheme`, `persistMode`, `seed`, `radius` e `customVars`.
- `ThemeProvider`/`useTheme` antigos permanecem como alias para facilitar migração.

## Exemplos

### Toggle de modo

```tsx
import { useSgTheme } from "@seedgrid/fe-theme";

export function ThemeToggle() {
  const { currentMode, setMode } = useSgTheme();

  return (
    <button
      onClick={() => setMode(currentMode === "light" ? "dark" : "light")}
    >
      Alternar para {currentMode === "light" ? "dark" : "light"}
    </button>
  );
}
```

### Atualizar seed e tokens adicionais

```tsx
const { setTheme } = useSgTheme();

setTheme({
  seed: "#0EA5E9",
  customVars: {
    "--sg-radius": "6px",
    "--sg-border": "214 41 132"
  }
});
```

## Variáveis CSS disponíveis

- `--sg-bg`, `--sg-surface`, `--sg-text`, `--sg-muted`, `--sg-border`, `--sg-ring`
- Paletas completas `--sg-{primary,secondary,tertiary,success,warning,error,info}-{50..900}`
- Tokens de componentes como `--sg-btn-{variant}-bg`, `--sg-input-border`, `--sg-card-bg`, `--sg-radius`

## Integração com Tailwind

Use `rgb(var(--sg-primary-600))` em classes utilitárias para aplicar cores reativas:

```tsx
<button className="bg-[rgb(var(--sg-primary-600))] text-[rgb(var(--sg-on-primary))]">
  Salvar
</button>
```

## Migração do provider antigo

```tsx
// 🔴 Antigo (deprecated)
import { ThemeProvider, useTheme } from "@seedgrid/fe-theme";

// ✅ Novo recomendado
import { SeedThemeProvider, useSgTheme } from "@seedgrid/fe-theme";
```

## Licença

MIT

