# SeedGrid (@seedgrid/fe-components) — how to build with this design system

A React component library for **Brazilian business/admin apps** (pt-BR). Components are prefixed `Sg*` (e.g. `SgButton`, `SgInputText`, `SgDatatable`). It includes Brazil-specific inputs: `SgInputCPF`, `SgInputCNPJ`, `SgInputCPFCNPJ`, `SgInputPostalCode` (CEP), `SgInputPhone`, `SgInputCurrency`. Use realistic Brazilian content (names, CPF/CNPJ, R$ values, CEP).

## Wrapping & setup — REQUIRED

Wrap the whole app in **`SeedThemeProvider`**. It injects the runtime theme tokens (`--primary`, `--secondary`, the `--sg-<family>-<shade>` scale (~50–800), `--radius`, …) onto `document.documentElement`. **Without it every component renders unstyled** (colorless default HTML — buttons come up gray). It's the single non-negotiable for theming.

```jsx
import { SeedThemeProvider } from '@seedgrid/fe-theme';
import { SgButton, SgInputText } from '@seedgrid/fe-components';

export default function App() {
  return (
    <SeedThemeProvider>
      <SgInputText label="Razão social" placeholder="Empresa LTDA" />
      <SgButton severity="primary">Salvar</SgButton>
    </SeedThemeProvider>
  );
}
```

## Providers & hosts (optional context — beyond SeedThemeProvider)

`SeedThemeProvider` is the only required wrapper. These add context for specific features; nest them **inside** `SeedThemeProvider`. They render no visible UI of their own, so they have no preview card — wrap with them when a feature needs them:

- **`SgComponentsI18nProvider`** — internationalization for the components (locale + built-in messages, overridable per subtree). Props: `locale`, `messages`. Default is pt-BR; wrap only to change locale or override strings.
- **`SgEnvironmentProvider`** — namespace, scope and persistence strategy for components that persist UI state (e.g. dock layout, datatable). Props: `value.namespaceProvider`, `value.persistenceStrategy`, `value.persistence.{scope,mode,stateVersion}`. Wrap when you want persisted state scoped per app/area.
- **`SgTimeProvider`** — server-synced time for clock/time gadgets, ticking on a controlled cadence. Props: `initialServerTime` (required, ISO string). Wrap the subtree containing `SgClock`/digit gadgets so they share one synced clock instead of each taking `initialServerTime`.
- **`SgClockThemeProvider`** — resolves clock themes (fallback vs strict, local themes, global registry). Props: `value.{mode,fallbackThemeId,themes}`. Wrap when supplying custom clock themes to `SgClock`/`SgClockThemePicker`.

**Toast / notification hosts** (mount once near the app root; trigger imperatively):
- **`SgToaster`** (has a card) — the standard toast outlet. Render once, then call `toast.success(...)`, `toast.warning(...)`, `toast.custom(...)` from anywhere.
- **`SgToastHost`** — lower-level explicit mount point for toasts when you must control the active host location/position. Props: `position`, `duration`, `visibleToasts`. Prefer `SgToaster` unless you need manual host placement.
- **`SgWhistleHost`** — stacked persistent/semi-persistent notices with per-severity colors and an optional action. Props: `max`, `newestOnTop`, `gap`. Mount once; push notices imperatively.

```jsx
<SeedThemeProvider>
  <SgComponentsI18nProvider locale="pt-BR">
    <SgTimeProvider initialServerTime={new Date().toISOString()}>
      <App />
      <SgToaster position="top-center" />
    </SgTimeProvider>
  </SgComponentsI18nProvider>
</SeedThemeProvider>
```

## Styling idiom — Tailwind utility classes (NOT prop-only, NOT CSS modules)

Components are **self-styling** via Tailwind utility classes baked into the bundle; the library ships **no separate component CSS for you to import** beyond `styles.css`. For your own layout glue around the components, use the same Tailwind utility vocabulary (`flex`, `gap-4`, `rounded-lg`, `p-4`, `text-sm`, `font-medium`) — or inline styles. Do not invent a parallel class system.

Color/spacing comes from two token families:
- **shadcn-style HSL triples** (defined in the shipped CSS `:root`): `--primary`, `--secondary`, `--accent`, `--destructive`, `--background`, `--foreground`, `--muted`, `--border`, `--ring`, `--radius`. Use as `hsl(var(--primary))`.
- **SeedGrid rgb-triple palette** `--sg-<family>-<shade>`: families `primary`, `secondary`, `tertiary`, `warning`, `error`, `success`, `info`; shades roughly `50`–`800`. The full scale is **injected at runtime by `SeedThemeProvider`** (a second reason wrapping is mandatory) — only `--sg-primary-50…700` and per-component tokens (`--sg-badge-*`, `--sg-avatar-*`, `--sg-btn-*`) live in the static stylesheet. **Shade sets vary per family** (e.g. `secondary` has 400/600/700/800, not 500), so read `_ds_bundle.css` for static names and don't assume a `-500` exists for every family.

Reference them as `var(--token)` in Tailwind arbitrary values, e.g. `className="bg-[var(--sg-primary-500)]"` (verified) or `style={{ background: "rgb(var(--sg-primary-500))" }}`.

### Severity is the main appearance axis
Action/status components take a `severity` prop. `SgButton` severity is `"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "help"` and maps each to a distinct vivid `--sg-*` color. `SgBadge` severity is the same set plus `"neutral" | "custom"`, but maps success→tertiary, warning→accent, info→secondary, so in the default theme only primary (green) and danger (red) read as vivid — that's intentional, not a bug. Always confirm a component's exact `severity` set from its `.d.ts`.

## Where the truth lives

- **`styles.css`** — the entry stylesheet; it `@import`s the compiled Tailwind utilities + token definitions + `_ds_bundle.css`. Read it (and what it imports) before styling.
- **`components/<group>/<Name>/<Name>.prompt.md`** — per-component usage notes.
- **`components/<group>/<Name>/<Name>.d.ts`** — the exact `<Name>Props` API contract. Trust it over any example.

Always prefer reading the real `.d.ts` + `.prompt.md` for a component over guessing props.
