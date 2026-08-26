import type { SgAiHintsV0, SgMetaV0 } from "../../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.clock-theme-resolver",
  package: "@seedgrid/fe-components",
  exportName: "useSgClockThemeResolver",
  slug: "use-sg-clock-theme-resolver",
  displayName: "useSgClockThemeResolver",
  category: "hook",
  subcategory: "clock-theme",
  description:
    "Hook para resolver tema do SgClock dinamicamente. Permite consultar temas registrados, alternar entre eles e acessar a configuracao current.",
  tags: ["hook", "clock", "theme", "resolver"],
  capabilities: ["theme-resolution", "dynamic-theme-switching", "theme-registry-access"],
  fieldSemantics: ["themeResolver", "clockTheme", "dynamicStyling"],
  props: [
    {
      name: "returns",
      type: "SgClockThemeResolver | null",
      description:
        "Resolvedor do SgClockThemeProvider mais proximo. Fora de um provider o hook devolve null — nao ha fallback implicito.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.resolve",
      type: "(id: string) => SgClockTheme | null",
      description:
        "Resolve um tema pelo id. No modo fallback do provider, um id desconhecido cai no fallbackThemeId; no modo strict devolve null.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.list",
      type: "() => SgClockTheme[]",
      description:
        "Temas visiveis para esta arvore: os globais do registry mais os locais do provider, ordenados por `order`.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.registerLocal",
      type: "(theme: SgClockTheme) => void",
      description: "Registra um tema apenas nesta arvore, sem tocar no registry global.",
      semanticRole: "behavior",
      bindable: false
    },
    {
      name: "returns.registerManyLocal",
      type: "(themes: SgClockTheme[]) => void",
      description: "Mesma coisa que registerLocal, para uma lista.",
      semanticRole: "behavior",
      bindable: false
    }
  ],
  states: ["fallback", "strict", "sem-provider"],
  examples: [
    {
      id: "basic",
      title: "Resolver e alternar temas",
      file: "apps/showcase/src/app/components/providers/sg-clock-theme-provider/samples/resolver-hook.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/providers/sg-clock-theme-provider",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Alternar dinamicamente entre temas de relogio.",
    "Implementar modo claro/escuro personalizado para SgClock.",
    "Consultar temas registrados e renderizar seletor de tema."
  ],
  avoidUseCases: [
    "Estilizar componentes nao-clock; use SgClockThemeProvider ou estilo CSS direto.",
    "Mutacao manual de registro de temas; use registerTheme() em vez disso."
  ],
  synonyms: ["theme resolver", "clock theme", "theme switcher"],
  relatedEntityFields: ["theme", "display", "style"],
  compositionHints: [
    "Usar dentro de SgClockThemeProvider para acesso a resolucao de temas.",
    "Combinar com SgClock para renderizar relógios com temas dinamicos."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.8,
    date: 0.6,
    number: 0,
    denseLayout: 0.5
  }
};
