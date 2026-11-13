"use client";

import React from "react";
import { Box, Building2, FilePenLine, Folder, Layers3, Receipt, Settings } from "lucide-react";
import { SgBreadcrumb, SgButton, type SgBreadcrumbItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n, type ShowcaseI18n } from "../../../i18n";

const K = "showcase.component.breadcrumb";

const basicItems = (i18n: ShowcaseI18n): SgBreadcrumbItem[] => [
  { id: "modules", label: t(i18n, `${K}.labels.modules`), href: "/modules", icon: <Layers3 className="size-4" /> },
  { id: "registrations", label: t(i18n, `${K}.labels.registrations`), href: "/modules/registrations", icon: <Building2 className="size-4" /> },
  { id: "products", label: t(i18n, `${K}.labels.products`), href: "/modules/registrations/products", icon: <Box className="size-4" /> },
  { id: "edit", label: t(i18n, `${K}.labels.edit`), icon: <FilePenLine className="size-4" /> }
];

const routes = (i18n: ShowcaseI18n) => ({
  registration: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "registrations", label: t(i18n, `${K}.labels.registrations`), href: "/erp/registrations", icon: <Building2 className="size-4" /> },
    { id: "customers", label: t(i18n, `${K}.labels.customers`), icon: <Receipt className="size-4" /> }
  ],
  fiscal: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "fiscal", label: t(i18n, `${K}.labels.fiscal`), href: "/erp/fiscal", icon: <Receipt className="size-4" /> },
    { id: "access", label: t(i18n, `${K}.labels.access`), icon: <FilePenLine className="size-4" /> }
  ],
  integration: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "integration", label: t(i18n, `${K}.labels.integration`), href: "/erp/integration", icon: <Settings className="size-4" /> },
    { id: "connectors", label: t(i18n, `${K}.labels.connectors`), icon: <Building2 className="size-4" /> }
  ]
} satisfies Record<"registration" | "fiscal" | "integration", SgBreadcrumbItem[]>);

const longItems = (i18n: ShowcaseI18n): SgBreadcrumbItem[] => [
  { id: "home", label: t(i18n, `${K}.labels.home`), href: "/" },
  { id: "admin", label: "Admin", href: "/admin" },
  { id: "tenant", label: "Multi Tenancy", href: "/admin/tenant" },
  { id: "billing", label: t(i18n, `${K}.labels.billing`), href: "/admin/tenant/billing" },
  { id: "plans", label: t(i18n, `${K}.labels.subscription`), href: "/admin/tenant/billing/subscription" },
  { id: "edit", label: t(i18n, `${K}.labels.editPlan`) }
];

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
import { Box, Building2, FilePenLine, Layers3 } from "lucide-react";
import { SgBreadcrumb, SgButton, type SgBreadcrumbItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items: SgBreadcrumbItem[] = [
  { id: "modules", label: "Módulos", href: "/modules", icon: <Layers3 className="size-4" /> },
  { id: "registrations", label: "Cadastros", href: "/modules/registrations", icon: <Building2 className="size-4" /> },
  { id: "products", label: "Produtos", href: "/modules/registrations/products", icon: <Box className="size-4" /> },
  { id: "edit", label: "Editar", icon: <FilePenLine className="size-4" /> }
];

export default function Example() {
  return <SgBreadcrumb items={items} separator="chevron" showHomeIcon />;
}`;

const EXAMPLE_EXTERNAL_CODE = `import React from "react";
import { SgBreadcrumb, SgButton, type SgBreadcrumbItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [routeKey, setRouteKey] = React.useState<"registration" | "fiscal" | "integration">("registration");
  const [lastNavigate, setLastNavigate] = React.useState("-");
  const routeItems = ROUTES[routeKey];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("registration")}>Ir para Cadastros</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("fiscal")}>Ir para Fiscal</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("integration")}>Ir para Integração</SgButton>
      </div>
      <SgBreadcrumb items={routeItems} separator="arrow" variant="subtle" onNavigate={(item) => setLastNavigate(item.id)} />
      <p>active route: {routeKey} | last click: {lastNavigate}</p>
    </div>
  );
}`;

const EXAMPLE_OVERFLOW_CODE = `import React from "react";
import { SgBreadcrumb, SgButton, type SgBreadcrumbItem } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <div className="space-y-4">
      <SgBreadcrumb items={longItems} maxItems={4} overflowBehavior="collapse" separator="slash" />
      <div className="max-w-[360px] rounded-lg border border-border p-2">
        <SgBreadcrumb items={longItems} overflowBehavior="scroll" separator="dot" />
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  Layers3,
  Building2,
  Box,
  FilePenLine,
} from "lucide-react";
import {
  SgBreadcrumb,
  SgButton,
  type SgBreadcrumbItem,
  type SgBreadcrumbSeparator,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items = [
  { id: "modules", label: "Módulos", href: "/modules", icon: <Layers3 className="size-4" /> },
  { id: "registrations", label: "Cadastros", href: "/modules/registrations", icon: <Building2 className="size-4" /> },
  { id: "products", label: "Produtos", href: "/modules/registrations/products", icon: <Box className="size-4" /> },
  { id: "edit", label: "Editar", icon: <FilePenLine className="size-4" /> }
];

export default function App() {
  const [separator, setSeparator] = React.useState<SgBreadcrumbSeparator>("chevron");
  const [variant, setVariant] = React.useState<"default" | "subtle" | "primary">("default");
  const [showHomeIcon, setShowHomeIcon] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setSeparator("chevron")}>chevron</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeparator("slash")}>slash</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeparator("dot")}>dot</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("default")}>default</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("subtle")}>subtle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("primary")}>primary</SgButton>
      </div>
      <SgButton size="sm" appearance="outline" onClick={() => setShowHomeIcon((v) => !v)}>toggle home icon</SgButton>

      <SgBreadcrumb items={items} separator={separator} variant={variant} showHomeIcon={showHomeIcon} />
    </div>
  );
}`;

const BREADCRUMB_PROPS: ShowcasePropRow[] = [
  { prop: "items", type: "SgBreadcrumbItem[]", defaultValue: "-", description: "List of rendered breadcrumb items." },
  { prop: "separator", type: "\"slash\" | \"chevron\" | \"dot\" | \"arrow\" | ReactNode", defaultValue: "chevron", description: "Visual separator between items." },
  { prop: "maxItems", type: "number", defaultValue: "-", description: "Maximum item count before overflow." },
  { prop: "overflowBehavior", type: "\"collapse\" | \"scroll\"", defaultValue: "collapse", description: "Overflow behavior for long trails." },
  { prop: "showHomeIcon / homeHref / homeLabel", type: "boolean / string / ReactNode", defaultValue: "false / / / Home", description: "Automatic Home item configuration." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Visual size of items." },
  { prop: "variant", type: "\"default\" | \"subtle\" | \"primary\"", defaultValue: "default", description: "Visual style variant." },
  { prop: "ariaLabel", type: "string", defaultValue: "Breadcrumb", description: "Accessible label for navigation." },
  { prop: "overflowLabel", type: "string", defaultValue: "More paths", description: "Label for the overflow button." },
  { prop: "onNavigate", type: "(item, index) => void", defaultValue: "-", description: "Callback fired when navigating to an item." },
  { prop: "className / itemClassName / style", type: "string / string / CSSProperties", defaultValue: "-", description: "Layout and style customization." },
  { prop: "SgBreadcrumbItem.id / label / href / icon / enabled / hidden / onClick", type: "item props", defaultValue: "-", description: "Structure of each breadcrumb item." }
];

export default function SgBreadcrumbPage() {
  const [routeKey, setRouteKey] = React.useState<"registration" | "fiscal" | "integration">("registration");
  const [lastNavigate, setLastNavigate] = React.useState("-");
  const i18n = useShowcaseI18n();
  const routeItems = routes(i18n)[routeKey];
  const aiComponent = useAiManifestComponent("SgBreadcrumb");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgBreadcrumb"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <SgBreadcrumb items={basicItems(i18n)} separator="chevron" showHomeIcon />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-breadcrumb/samples/basico.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("registration")}>{t(i18n, `${K}.labels.goRegistration`)}</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("fiscal")}>{t(i18n, `${K}.labels.goFiscal`)}</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("integration")}>{t(i18n, `${K}.labels.goIntegration`)}</SgButton>
          </div>

          <SgBreadcrumb
            items={routeItems}
            separator="arrow"
            variant="subtle"
            onNavigate={(item) => setLastNavigate(item.id)}
          />

          <p className="text-sm text-muted-foreground">
            {t(i18n, `${K}.section2ActiveRouteLabel`)}: <span className="font-semibold text-foreground">{routeKey}</span> | {t(i18n, `${K}.section2LastClickLabel`)}:{" "}
            <span className="font-semibold text-foreground">{lastNavigate}</span>
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-breadcrumb/samples/caminho-externo.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section3Title`)} description={t(i18n, `${K}.section3Description`)}>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">{t(i18n, `${K}.section3CollapseLabel`)}</p>
              <SgBreadcrumb items={longItems(i18n)} maxItems={4} overflowBehavior="collapse" separator="slash" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">{t(i18n, `${K}.section3ScrollLabel`)}</p>
              <div className="max-w-[360px] rounded-lg border border-border p-2">
                <SgBreadcrumb items={longItems(i18n)} overflowBehavior="scroll" separator="dot" />
              </div>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-breadcrumb/samples/overflow.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
          <div className="space-y-2">
            {(["slash", "chevron", "dot", "arrow"] as const).map((separator) => (
              <SgBreadcrumb
                key={separator}
                showHomeIcon
                separator={separator}
                items={[
                  { id: "a", label: t(i18n, `${K}.separators.folder`), href: "/p", icon: <Folder className="size-4" /> },
                  { id: "b", label: separator }
                ]}
              />
            ))}
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-breadcrumb/samples/separadores.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section5Title`)} description={t(i18n, `${K}.section5Description`)}>
          <div className="space-y-2">
            <SgBreadcrumb items={longItems(i18n).slice(0, 3)} size="sm" />
            <SgBreadcrumb items={longItems(i18n).slice(0, 3)} variant="subtle" />
            <SgBreadcrumb items={longItems(i18n).slice(0, 3)} variant="primary" size="lg" />
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-breadcrumb/samples/variantes.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section6Title`)} description={t(i18n, `${K}.section6Description`)}>
          <SgPlayground
            title="SgBreadcrumb Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-breadcrumb/sg-breadcrumb.tsx.playground"
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={BREADCRUMB_PROPS} title={t(i18n, `${K}.propsReferenceTitle`)} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


