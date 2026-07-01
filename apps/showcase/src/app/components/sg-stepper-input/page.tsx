"use client";

import React from "react";
import { SgButton, SgStepperInput } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.stepperInput";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const EXAMPLE_BASIC_CODE = `import React from "react";
import { SgButton, SgStepperInput } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(12);

  return (
    <div className="space-y-2">
      <SgStepperInput
        id="stepper-basic"
        minValue={0}
        maxValue={40}
        step={2}
        defaultValue={12}
        width={210}
        onChange={setValue}
      />
      <p>Valor atual: {value}</p>
    </div>
  );
}`;

const EXAMPLE_CONTROLLED_CODE = `import React from "react";
import { SgButton, SgStepperInput } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(18);

  return (
    <div className="space-y-3">
      <SgStepperInput
        id="stepper-controlled"
        minValue={10}
        maxValue={30}
        step={1}
        value={value}
        width={210}
        onChange={setValue}
      />
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setValue(10)}>10</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(20)}>20</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(30)}>30</SgButton>
      </div>
      <p>Valor controlado: {value}</p>
    </div>
  );
}`;

const EXAMPLE_READONLY_CODE = `import React from "react";
import { SgButton, SgStepperInput } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SgStepperInput id="stepper-readonly" minValue={0} maxValue={10} value={7} readOnly />
      <SgStepperInput id="stepper-disabled" minValue={0} maxValue={10} value={4} disabled />
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgStepperInput } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [min, setMin] = React.useState(0);
  const [max, setMax] = React.useState(40);
  const [step, setStep] = React.useState(2);
  const [value, setValue] = React.useState(12);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(0); setMax(40); setStep(2); }}>0-40 / 2</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(-10); setMax(10); setStep(1); }}>-10 a 10 / 1</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(100); setMax(1000); setStep(50); }}>100-1000 / 50</SgButton>
      </div>
      <SgStepperInput id="playground-stepper" minValue={min} maxValue={max} step={step} value={value} onChange={setValue} width={220} />
      <div className="text-sm">Valor atual: {value}</div>
    </div>
  );
}`;

const STEPPER_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador do input." },
  { prop: "minValue / maxValue", type: "number", defaultValue: "-", description: "Limites do valor permitido." },
  { prop: "step", type: "number", defaultValue: "1", description: "Incremento/decremento por clique." },
  { prop: "value / defaultValue", type: "number", defaultValue: "- / minValue", description: "Modo controlado ou valor inicial." },
  { prop: "disabled / readOnly", type: "boolean", defaultValue: "false", description: "Bloqueia edicao total ou parcial." },
  { prop: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback com valor normalizado." },
  { prop: "ariaLabel", type: "string", defaultValue: "-", description: "Acessibilidade para o input." },
  { prop: "className / inputClassName", type: "string", defaultValue: "-", description: "Classes do container e do campo." },
  { prop: "width", type: "number | string", defaultValue: "auto", description: "Largura do componente." },
  { prop: "inputProps", type: "InputHTMLAttributes (parcial)", defaultValue: "-", description: "Props extras para o input numerico." }
];







export default function SgStepperInputPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgStepperInput");
  const [basicValue, setBasicValue] = React.useState(12);
  const [controlledValue, setControlledValue] = React.useState(18);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgStepperInput"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <div className="space-y-2">
            <SgStepperInput
              id="stepper-basic"
              minValue={0}
              maxValue={40}
              step={2}
              defaultValue={12}
              width={210}
              onChange={setBasicValue}
            />
            <p className="text-sm text-muted-foreground">
              Valor atual: <span className="font-semibold text-foreground">{basicValue}</span>
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-stepper-input/samples/basico.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <div className="space-y-3">
            <SgStepperInput
              id="stepper-controlled"
              minValue={10}
              maxValue={30}
              step={1}
              value={controlledValue}
              width={210}
              onChange={setControlledValue}
            />
            <div className="flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(10)}>10</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(20)}>20</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(30)}>30</SgButton>
            </div>
            <p className="text-sm text-muted-foreground">
              Valor controlado: <span className="font-semibold text-foreground">{controlledValue}</span>
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-stepper-input/samples/controle-externo.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section3Title`)} description={t(i18n, `${K}.section3Description`)}>
          <div className="flex flex-wrap items-center gap-4">
            <SgStepperInput id="stepper-readonly" minValue={0} maxValue={10} value={7} readOnly />
            <SgStepperInput id="stepper-disabled" minValue={0} maxValue={10} value={4} disabled />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-stepper-input/samples/read-only-e-disabled.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
          <SgPlayground
            title={t(i18n, `${K}.playgroundTitle`)}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-stepper-input/sg-stepper-input.tsx.playground"
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={STEPPER_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

