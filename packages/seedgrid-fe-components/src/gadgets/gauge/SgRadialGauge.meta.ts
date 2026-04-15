import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.radial-gauge",
  package: "@seedgrid/fe-components",
  exportName: "SgRadialGauge",
  slug: "sg-radial-gauge",
  displayName: "SgRadialGauge",
  category: "gadget",
  subcategory: "radial-gauge",
  description:
    "Gauge radial com ponteiros, faixas, anotacoes e controle de angulos para cenarios de speedometer, dial e medicao circular.",
  tags: ["gadget", "gauge", "radial", "dial", "speedometer"],
  capabilities: ["radial-meter", "needle-marker-range-pointers", "annotations", "arc-configuration", "drag-support"],
  fieldSemantics: ["radialGauge", "speedometer", "dialMeter", "circularMeasurement"],
  props: [
    { name: "min", type: "number", default: 0, description: "Valor minimo da escala.", semanticRole: "validation", bindable: true },
    { name: "max", type: "number", default: 100, description: "Valor maximo da escala.", semanticRole: "validation", bindable: true },
    { name: "value", type: "number", description: "Valor do ponteiro principal.", semanticRole: "value", bindable: true },
    { name: "onValueChange", type: "(value: number) => void", description: "Callback do ponteiro principal.", semanticRole: "event", bindable: false },
    { name: "pointers", type: "SgRadialGaugePointer[]", default: [], description: "Ponteiros adicionais do tipo needle, marker ou range.", semanticRole: "data", bindable: true },
    { name: "ranges", type: "SgRadialGaugeRange[]", default: [], description: "Faixas coloridas sobre o arco principal.", semanticRole: "data", bindable: true },
    { name: "annotations", type: "SgRadialGaugeAnnotation[]", default: [], description: "Anotacoes posicionadas por valor ou angulo.", semanticRole: "data", bindable: true },
    { name: "startAngle", type: "number", default: 135, description: "Angulo inicial do arco.", semanticRole: "appearance", bindable: true },
    { name: "endAngle", type: "number", default: 45, description: "Angulo final do arco.", semanticRole: "appearance", bindable: true },
    { name: "primaryPointerType", type: '"needle" | "marker" | "range"', default: "needle", description: "Tipo visual do ponteiro principal.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default", "with-ranges", "with-annotations", "dragging"],
  examples: [
    { id: "speedometer", title: "Speedometer", file: "apps/showcase/src/app/components/gadgets/sg-radial-gauge/samples/speedometer-style.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/gadgets/sg-radial-gauge/sg-radial-gauge.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/gadgets/sg-radial-gauge", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "gadget.radial-gauge",
    acceptsDataBinding: true,
    defaultProps: { min: 0, max: 100, startAngle: 135, endAngle: 45, primaryPointerType: "needle" }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Representar medicao circular em speedometers, paines de telemetria e dashboards.",
    "Exibir indicadores de performance com foco em dial, arco e ponteiros visuais.",
    "Combinar anotacoes e faixas de alerta em instrumentos circulares."
  ],
  avoidUseCases: [
    "Indicadores lineares simples; nesses casos prefira SgLinearGauge.",
    "Entrada numerica direta por teclado; nesses casos prefira SgInputNumber.",
    "Graficos analiticos com series temporais; nesses casos prefira charting dedicado."
  ],
  synonyms: ["radial gauge", "speedometer", "dial gauge", "circular meter"],
  relatedEntityFields: ["value", "rpm", "speed", "score", "efficiency"],
  compositionHints: [
    "Usar com Card, Screen e dashboards para indicadores de alto impacto visual.",
    "Combinar com annotations e centerContent para KPIs operacionais."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0.74, denseLayout: 0.82 }
};
