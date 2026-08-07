// Called once from index.ts (a real call, not a bare `import "./x"`) so that
// merely importing a component from this package styles it, with no separate
// CSS import and no ThemeProvider required. A bare side-effect import is not
// enough here: esbuild/tsup happily drops it as an "unused import" unless the
// consumer's exact resolved path matches package.json's sideEffects globs,
// which is brittle across different bundlers/build modes. An exported
// function that index.ts actually calls can't be elided that way.
// Guarded for SSR (no `document`) and for double injection (multiple bundles
// / instances of this module ending up in the same page).
import { SEEDGRID_COMPILED_CSS } from "./generated/compiledStyles";

const STYLE_ELEMENT_ID = "seedgrid-fe-components-styles";

export function ensureSeedgridStylesInjected() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = SEEDGRID_COMPILED_CSS;
  document.head.appendChild(style);
}
