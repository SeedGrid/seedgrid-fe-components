"use client";

import * as React from "react";
import { Mail, ShieldCheck, TriangleAlert } from "lucide-react";
import { SgAccordion, SgButton, type SgAccordionItem } from "@seedgrid/fe-components";
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

const K = "showcase.component.accordion";

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










const VERTICAL_ITEMS: SgAccordionItem[] = [
  {
    id: "personal",
    title: "Dados pessoais",
    content: (
      <div className="space-y-2 text-sm">
        <p>Nome completo, email e telefone para contato.</p>
        <p className="text-muted-foreground">Edite essas informacoes no perfil do usuario.</p>
      </div>
    )
  },
  {
    id: "address",
    title: "Endereco",
    content: (
      <div className="space-y-2 text-sm">
        <p>Rua, numero, cidade, estado e CEP.</p>
        <p className="text-muted-foreground">Utilizado para faturamento e entregas.</p>
      </div>
    )
  },
  {
    id: "billing",
    title: "Faturamento",
    content: (
      <div className="space-y-2 text-sm">
        <p>Forma de pagamento, ciclo de cobranca e historico de notas.</p>
        <p className="text-muted-foreground">Atualizacoes podem levar alguns minutos para refletir.</p>
      </div>
    )
  }
];

const HORIZONTAL_ITEMS: SgAccordionItem[] = [
  {
    id: "overview",
    title: "Visao geral",
    content: (
      <div className="space-y-2 text-sm">
        <h3 className="text-base font-semibold">Visao geral</h3>
        <p>Indicadores principais de utilizacao, consumo e disponibilidade.</p>
      </div>
    )
  },
  {
    id: "security",
    title: "Seguranca",
    content: (
      <div className="space-y-2 text-sm">
        <h3 className="text-base font-semibold">Seguranca</h3>
        <p>Politicas de senha, MFA e tentativas de autenticacao.</p>
      </div>
    )
  },
  {
    id: "integrations",
    title: "Integracoes",
    content: (
      <div className="space-y-2 text-sm">
        <h3 className="text-base font-semibold">Integracoes</h3>
        <p>Conexoes com APIs, webhooks e provedores externos.</p>
      </div>
    )
  }
];

const CUSTOM_ITEMS: SgAccordionItem[] = [
  {
    id: "mail",
    title: "Email",
    icon: <Mail size={14} />,
    end: <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">novo</span>,
    headerBackgroundColor: "rgb(var(--sg-info-100, 224 242 254))",
    content: <p className="text-sm">Configuracoes de SMTP, remetente padrao e templates.</p>
  },
  {
    id: "lock",
    title: "Permissoes",
    icon: <ShieldCheck size={14} />,
    content: <p className="text-sm">Controle de perfis, papeis e trilhas de auditoria.</p>
  },
  {
    id: "blocked",
    title: "Modulo indisponivel",
    icon: <TriangleAlert size={14} />,
    disabled: true,
    content: <p className="text-sm">Conteudo bloqueado.</p>
  }
];

const COLOR_EXAMPLE_ITEMS: SgAccordionItem[] = [
  {
    id: "general",
    title: "Geral",
    content: <p className="text-sm">Configuracoes gerais do modulo.</p>
  },
  {
    id: "security",
    title: "Seguranca",
    content: <p className="text-sm">Politicas e regras de acesso.</p>
  },
  {
    id: "billing",
    title: "Faturamento (override por item)",
    headerBackgroundColor: "rgb(var(--sg-warning-100, 254 249 195))",
    content: <p className="text-sm">Este item ignora a cor global do header.</p>
  }
];

const BASIC_CODE = `import * as React from "react";
import { SgAccordion, SgButton, type SgAccordionItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items: SgAccordionItem[] = [
  {
    id: "personal",
    title: "Dados pessoais",
    content: (
      <div className="space-y-2 text-sm">
        <p>Nome completo, email e telefone para contato.</p>
        <p className="text-muted-foreground">Edite essas informacoes no perfil do usuario.</p>
      </div>
    )
  },
  {
    id: "address",
    title: "Endereco",
    content: (
      <div className="space-y-2 text-sm">
        <p>Rua, numero, cidade, estado e CEP.</p>
        <p className="text-muted-foreground">Utilizado para faturamento e entregas.</p>
      </div>
    )
  },
  {
    id: "billing",
    title: "Faturamento",
    content: (
      <div className="space-y-2 text-sm">
        <p>Forma de pagamento, ciclo de cobranca e historico de notas.</p>
        <p className="text-muted-foreground">Atualizacoes podem levar alguns minutos para refletir.</p>
      </div>
    )
  }
];

export default function Example() {
  return <SgAccordion items={items} />;
}`;

const MULTIPLE_CODE = `import * as React from "react";
import { SgAccordion, SgButton, type SgAccordionItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items: SgAccordionItem[] = [
  { id: "personal", title: "Dados pessoais", content: <p className="text-sm">Conteudo 1</p> },
  { id: "address", title: "Endereco", content: <p className="text-sm">Conteudo 2</p> },
  { id: "billing", title: "Faturamento", content: <p className="text-sm">Conteudo 3</p> }
];

export default function Example() {
  const [open, setOpen] = React.useState<number[]>([0, 2]);

  return (
    <div className="space-y-3">
      <SgAccordion
        items={items}
        multiple
        collapsible
        activeIndex={open}
        onActiveIndexChange={setOpen}
      />
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setOpen([0])}>Apenas 1</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setOpen([1, 2])}>2 e 3</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setOpen([0, 1, 2])}>Todos</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setOpen([])}>None</SgButton>
      </div>
    </div>
  );
}`;

const HORIZONTAL_CODE = `import * as React from "react";
import { SgAccordion, SgButton, type SgAccordionItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items: SgAccordionItem[] = [
  {
    id: "overview",
    title: "Visao geral",
    content: <p className="text-sm">Indicadores principais de utilizacao, consumo e disponibilidade.</p>
  },
  {
    id: "security",
    title: "Seguranca",
    content: <p className="text-sm">Politicas de senha, MFA e tentativas de autenticacao.</p>
  },
  {
    id: "integrations",
    title: "Integracoes",
    content: <p className="text-sm">Conexoes com APIs, webhooks e provedores externos.</p>
  }
];

export default function Example() {
  return (
    <SgAccordion
      items={items}
      orientation="horizontal"
      defaultActiveIndex={1}
      horizontalHeaderWidth={56}
      horizontalMinHeight={220}
    />
  );
}`;

const CONTROLLED_CODE = `import * as React from "react";
import { SgAccordion, SgButton, type SgAccordionItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items: SgAccordionItem[] = [
  { id: "personal", title: "Dados pessoais", content: <p className="text-sm">Conteudo 1</p> },
  { id: "address", title: "Endereco", content: <p className="text-sm">Conteudo 2</p> },
  { id: "billing", title: "Faturamento", content: <p className="text-sm">Conteudo 3</p> }
];

export default function Example() {
  const [activeIndex, setActiveIndex] = React.useState<number[]>([0]);

  return (
    <div className="space-y-3">
      <SgAccordion
        items={items}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setActiveIndex([0])}>Abrir 1</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActiveIndex([1])}>Abrir 2</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActiveIndex([2])}>Abrir 3</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActiveIndex([])}>Fechar todos</SgButton>
      </div>
    </div>
  );
}`;

const CUSTOM_CODE = `import * as React from "react";
import { Mail, ShieldCheck, TriangleAlert } from "lucide-react";
import { SgAccordion, SgButton, type SgAccordionItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items: SgAccordionItem[] = [
  {
    id: "mail",
    title: "Email",
    icon: <Mail size={14} />,
    end: <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">novo</span>,
    headerBackgroundColor: "rgb(var(--sg-info-100, 224 242 254))",
    content: <p className="text-sm">Configuracoes de SMTP, remetente padrao e templates.</p>
  },
  {
    id: "lock",
    title: "Permissoes",
    icon: <ShieldCheck size={14} />,
    content: <p className="text-sm">Controle de perfis, papeis e trilhas de auditoria.</p>
  },
  {
    id: "blocked",
    title: "Modulo indisponivel",
    icon: <TriangleAlert size={14} />,
    disabled: true,
    content: <p className="text-sm">Conteudo bloqueado.</p>
  }
];

export default function Example() {
  return (
    <SgAccordion
      items={items}
      defaultActiveIndex={0}
      headerBackgroundColor="rgb(var(--sg-primary-50, 239 246 255))"
    />
  );
}`;

const COLOR_CUSTOMIZATION_CODE = `import * as React from "react";
import { SgAccordion, SgButton, type SgAccordionItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items: SgAccordionItem[] = [
  {
    id: "general",
    title: "Geral",
    content: <p className="text-sm">Configuracoes gerais do modulo.</p>
  },
  {
    id: "security",
    title: "Seguranca",
    content: <p className="text-sm">Politicas e regras de acesso.</p>
  },
  {
    id: "billing",
    title: "Faturamento (override por item)",
    headerBackgroundColor: "rgb(var(--sg-warning-100, 254 249 195))",
    content: <p className="text-sm">Este item ignora a cor global do header.</p>
  }
];

export default function Example() {
  const [headerColor, setHeaderColor] = React.useState("rgb(var(--sg-primary-50, 239 246 255))");

  return (
    <div className="space-y-3">
      <input
        value={headerColor}
        onChange={(e) => setHeaderColor(e.target.value)}
        className="w-full rounded border border-border px-3 py-2 text-sm"
      />
      <SgAccordion items={items} defaultActiveIndex={0} headerBackgroundColor={headerColor} />
    </div>
  );
}`;

const PLAYGROUND_APP_FILE = `import * as React from "react";
import {
  SgAccordion,
  SgButton,
  type SgAccordionItem,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical");
  const [multiple, setMultiple] = React.useState(false);
  const [collapsible, setCollapsible] = React.useState(true);
  const [keepMounted, setKeepMounted] = React.useState(true);
  const [headerBackgroundColor, setHeaderBackgroundColor] = React.useState(
    "rgb(var(--sg-primary-50, 239 246 255))"
  );
  const [active, setActive] = React.useState<number[]>([0]);

  const items = React.useMemo(
    () => [
      { id: "one", title: "Painel 1", content: <p className="text-sm">Conteudo do primeiro painel.</p> },
      { id: "two", title: "Painel 2", content: <p className="text-sm">Conteudo do segundo painel.</p> },
      { id: "three", title: "Painel 3", content: <p className="text-sm">Conteudo do terceiro painel.</p> }
    ],
    []
  );

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-xs">
          <span className="mb-1 block font-medium">Orientation</span>
          <select value={orientation} onChange={(e) => setOrientation(e.target.value as "vertical" | "horizontal")} className="w-full rounded border border-border px-2 py-1">
            <option value="vertical">vertical</option>
            <option value="horizontal">horizontal</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="mb-1 block font-medium">Active indexes</span>
          <div className="rounded border border-border bg-slate-50 px-2 py-1 text-[11px]">{active.length > 0 ? active.join(", ") : "(vazio)"}</div>
        </label>
        <label className="text-xs">
          <span className="mb-1 block font-medium">Header background</span>
          <input
            value={headerBackgroundColor}
            onChange={(e) => setHeaderBackgroundColor(e.target.value)}
            className="w-full rounded border border-border px-2 py-1"
            placeholder="Ex: #e0f2fe ou rgb(var(--sg-primary-50, 239 246 255))"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <label className="inline-flex items-center gap-1"><input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} /> multiple</label>
        <label className="inline-flex items-center gap-1"><input type="checkbox" checked={collapsible} onChange={(e) => setCollapsible(e.target.checked)} /> collapsible</label>
        <label className="inline-flex items-center gap-1"><input type="checkbox" checked={keepMounted} onChange={(e) => setKeepMounted(e.target.checked)} /> keepMounted</label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setActive([0])}>Abrir 1</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setActive([1])}>Abrir 2</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setActive([2])}>Abrir 3</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setActive([0, 1, 2])}>Abrir todos</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setActive([])}>Fechar todos</button>
      </div>

      <SgAccordion
        items={items}
        orientation={orientation}
        multiple={multiple}
        collapsible={collapsible}
        keepMounted={keepMounted}
        activeIndex={active}
        onActiveIndexChange={setActive}
        horizontalHeaderWidth={56}
        horizontalMinHeight={220}
        headerBackgroundColor={headerBackgroundColor}
      />
    </div>
  );
}`;

const ACCORDION_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador do accordion." },
  { prop: "items", type: "SgAccordionItem[]", defaultValue: "[]", description: "List of items with title and content." },
  { prop: "orientation", type: "\"vertical\" | \"horizontal\"", defaultValue: "vertical", description: "Rendering direction of panels." },
  { prop: "multiple / collapsible", type: "boolean", defaultValue: "false / true", description: "Controls multiple opened items and collapsing." },
  { prop: "activeIndex / defaultActiveIndex", type: "number[] | number / idem", defaultValue: "controlado / 0", description: "Estado controlado ou inicial." },
  { prop: "onActiveIndexChange / onItemToggle", type: "callbacks", defaultValue: "-", description: "State change events." },
  { prop: "defaultOpenFirst / keepMounted", type: "boolean", defaultValue: "false / false", description: "Initial open behavior and DOM persistence." },
  { prop: "headerBackgroundColor", type: "string", defaultValue: "primary-50", description: "Global header background color." },
  { prop: "panelClassName / headerClassName / contentClassName", type: "string", defaultValue: "-", description: "Style customization per area." },
  { prop: "animationDuration", type: "number", defaultValue: "220", description: "Open/close animation duration." },
  { prop: "horizontalHeaderWidth / horizontalMinHeight", type: "number", defaultValue: "56 / 220", description: "Dimensions in horizontal mode." }
];

export default function SgAccordionPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgAccordion");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const [controlled, setControlled] = React.useState<number[]>([0]);
  const [multiControlled, setMultiControlled] = React.useState<number[]>([0, 2]);
  const [headerColorExample, setHeaderColorExample] = React.useState("#eff6ff");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgAccordion"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={t(i18n, `${K}.section1Title`)}
        description={t(i18n, `${K}.section1Description`)}
      >
        <SgAccordion items={VERTICAL_ITEMS} />
        <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-accordion/samples/basico-vertical-single.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.section2Title`)}
        description={t(i18n, `${K}.section2Description`)}
      >
        <SgAccordion
          items={VERTICAL_ITEMS}
          multiple
          collapsible
          activeIndex={multiControlled}
          onActiveIndexChange={setMultiControlled}
        />
        <div className="flex flex-wrap gap-2">
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([0])}>Apenas 1</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([1, 2])}>2 e 3</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([0, 1, 2])}>Todos</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([])}>None</SgButton>
        </div>
        <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-accordion/samples/multiple-collapsible.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.section3Title`)}
        description={t(i18n, `${K}.section3Description`)}
      >
        <SgAccordion
          items={HORIZONTAL_ITEMS}
          orientation="horizontal"
          defaultActiveIndex={1}
          horizontalHeaderWidth={56}
          horizontalMinHeight={220}
        />
        <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-accordion/samples/horizontal.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.section4Title`)}
        description={t(i18n, `${K}.section4Description`)}
      >
        <SgAccordion
          items={VERTICAL_ITEMS}
          activeIndex={controlled}
          onActiveIndexChange={setControlled}
        />
        <div className="flex flex-wrap gap-2">
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([0])}>Abrir 1</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([1])}>Abrir 2</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([2])}>Abrir 3</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([])}>Fechar todos</SgButton>
        </div>
        <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-accordion/samples/controlado-por-estado.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.section5Title`)}
        description={t(i18n, `${K}.section5Description`)}
      >
        <SgAccordion
          items={CUSTOM_ITEMS}
          defaultActiveIndex={0}
          headerBackgroundColor="rgb(var(--sg-primary-50, 239 246 255))"
        />
        <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-accordion/samples/custom-items-header-background.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.section6Title`)}
        description={t(i18n, `${K}.section6Description`)}
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1">
            <span className="block text-xs font-medium">{t(i18n, `${K}.colorPickerLabel`)}</span>
            <input
              type="color"
              value={headerColorExample}
              onChange={(e) => setHeaderColorExample(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded border border-border bg-background p-1"
            />
          </label>
          <label className="min-w-[260px] flex-1 space-y-1">
            <span className="block text-xs font-medium">{t(i18n, `${K}.colorValueLabel`)}</span>
            <input
              value={headerColorExample}
              onChange={(e) => setHeaderColorExample(e.target.value)}
              className="w-full rounded border border-border px-3 py-2 text-sm"
            />
          </label>
        </div>
        <SgAccordion
          items={COLOR_EXAMPLE_ITEMS}
          defaultActiveIndex={0}
          headerBackgroundColor={headerColorExample}
        />
        <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-accordion/samples/color-customization-example.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.section7Title`)}
        description={t(i18n, `${K}.section7Description`)}
      >
        <SgPlayground
          title="SgAccordion Playground"
          interactive
          codeContract="appFile"
          playgroundFile="apps/showcase/src/app/components/sg-accordion/sg-accordion.tsx.playground"
          height={680}
          defaultOpen
        />
      </Section>

        <ShowcasePropsReference rows={ACCORDION_PROPS} title={t(i18n, `${K}.propsReferenceTitle`)} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


