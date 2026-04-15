import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.linear-gauge",
  package: "@seedgrid/fe-components",
  exportName: "SgLinearGauge",
  slug: "sg-linear-gauge",
  displayName: "SgLinearGauge",
  category: "gadget",
  subcategory: "linear-gauge",
  description:
    "Gauge linear para exibicao de medicao, faixas de valor, ponteiros adicionais e ajuste arrastavel em eixos horizontal ou vertical.",
  tags: ["gadget", "gauge", "linear", "meter", "measurement"],
  capabilities: ["linear-meter", "range-highlights", "draggable-pointers", "horizontal-vertical", "tick-label-control"],
  fieldSemantics: ["linearGauge", "measurementDisplay", "rangeIndicator", "meter"],
  props: [
    { name: "min", type: "number", default: 0, description: "Valor minimo da escala.", semanticRole: "validation", bindable: true },
    { name: "max", type: "number", default: 100, description: "Valor maximo da escala.", semanticRole: "validation", bindable: true },
    { name: "value", type: "number", description: "Valor do ponteiro principal.", semanticRole: "value", bindable: true },
    { name: "onValueChange", type: "(value: number) => void", description: "Callback do ponteiro principal.", semanticRole: "event", bindable: false },
    { name: "pointers", type: "SgLinearGaugePointer[]", default: [], description: "Ponteiros adicionais renderizados sobre o eixo.", semanticRole: "data", bindable: true },
    { name: "ranges", type: "SgLinearGaugeRange[]", default: [], description: "Faixas coloridas aplicadas sobre a escala.", semanticRole: "data", bindable: true },
    { name: "orientation", type: '"horizontal" | "vertical"', default: "horizontal", description: "Orientacao do gauge.", semanticRole: "appearance", bindable: true },
    { name: "showLabels", type: "boolean", default: true, description: "Exibe rotulos da escala.", semanticRole: "appearance", bindable: true },
    { name: "showTicks", type: "boolean", default: true, description: "Exibe ticks da escala.", semanticRole: "appearance", bindable: true },
    { name: "primaryPointerDraggable", type: "boolean", default: false, description: "Permite arrastar o ponteiro principal.", semanticRole: "behavior", bindable: true }
  ],
  states: ["default", "with-ranges", "with-pointers", "dragging"],
  examples: [
    { id: "default-horizontal", title: "Horizontal", file: "apps/showcase/src/app/components/gadgets/sg-linear-gauge/samples/default-horizontal.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/gadgets/sg-linear-gauge/sg-linear-gauge.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/gadgets/sg-linear-gauge", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "gadget.linear-gauge",
    acceptsDataBinding: true,
    defaultProps: { min: 0, max: 100, orientation: "horizontal", showLabels: true, showTicks: true, primaryPointerDraggable: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir medicao continua em eixo linear com faixas de referencia.",
    "Representar progresso, temperatura, estoque ou nivel em dashboards operacionais.",
    "Permitir ajuste arrastavel quando o gauge tambem atua como controle visual."
  ],
  avoidUseCases: [
    "Entrada numerica textual simples; nesses casos prefira SgInputNumber.",
    "Comparacao tabular de muitos registros; nesses casos prefira Datatable.",
    "Visual circular ou speedometer; nesses casos prefira SgRadialGauge."
  ],
  synonyms: ["linear gauge", "linear meter", "level indicator", "measurement bar"],
  relatedEntityFields: ["value", "progress", "temperature", "level", "measurement"],
  compositionHints: [
    "Usar com Card, Dashboard e paines operacionais para indicadores de status.",
    "Combinar com Button ou sliders auxiliares em demos interativas."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0.72, denseLayout: 0.8 }
};
