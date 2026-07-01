"use client";

import React from "react";
import { SgDockScreen, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.dockScreen";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

const DOCK_SCREEN_BASIC_CODE = `import React from "react";
import { SgDockScreen, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

export default function Example() {
  return (
    <SgDockScreen
      id="showcase-dock-screen-basic-v1"
      fullscreen={false}
      height={420}
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <SgDockZone zone="top">
        <SgToolBar id="tb-top-dock-screen-v1" dockZone="top" orientationDirection="horizontal-left" title="Topo" draggable>
          <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para inicio" />
          <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar dados" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="bottom">
        <SgToolBar id="tb-bottom-dock-screen-v1" dockZone="bottom" orientationDirection="horizontal-left" title="Base" draggable>
          <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
          <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Relatorio" hint="Abrir relatorios" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="left">
        <SgToolBar id="tb-left-dock-screen-v1" dockZone="left" orientationDirection="vertical-down" title="Navegacao" collapsible draggable>
          <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir clientes" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="right">
        <SgToolBar id="tb-right-dock-screen-v1" dockZone="right" orientationDirection="vertical-down" title="Equipe" collapsible draggable>
          <SgToolbarIconButton icon={<Users className="size-4" />} label="Usuarios" hint="Gerenciar usuarios" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="Ajustes" hint="Abrir ajustes" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="free">
        <div className="pointer-events-none text-sm text-muted-foreground">Area central livre</div>
      </SgDockZone>
    </SgDockScreen>
  );
}`;

const DOCK_SCREEN_PLAYGROUND_CODE = `import * as React from "react";
import {
  SgDockScreen,
  SgDockZone,
  SgToolBar,
  SgToolbarIconButton,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import {
  ClipboardList,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Users,
} from "lucide-react";

export default function App() {
  return (
    <SgDockScreen
      id="dock-screen-playground-v1"
      fullscreen={false}
      height={420}
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <SgDockZone zone="top">
        <SgToolBar id="tb-top-play-v1" dockZone="top" orientationDirection="horizontal-left" title="Topo" draggable>
          <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para inicio" />
          <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar dados" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="bottom">
        <SgToolBar id="tb-bottom-play-v1" dockZone="bottom" orientationDirection="horizontal-left" title="Base" draggable>
          <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
          <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Relatorio" hint="Abrir relatorios" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="left">
        <SgToolBar id="tb-left-play-v1" dockZone="left" orientationDirection="vertical-down" title="Esquerda" collapsible draggable>
          <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir clientes" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="right">
        <SgToolBar id="tb-right-play-v1" dockZone="right" orientationDirection="vertical-down" title="Direita" collapsible draggable>
          <SgToolbarIconButton icon={<Users className="size-4" />} label="Usuarios" hint="Gerenciar usuarios" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="Ajustes" hint="Abrir ajustes" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="free">
        <div className="pointer-events-none text-sm text-muted-foreground">Area central livre</div>
      </SgDockZone>
    </SgDockScreen>
  );
}`;

const DOCK_SCREEN_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador do SgDockLayout interno (persistencia)." },
  { prop: "screenId", type: "string", defaultValue: "-", description: "ID opcional do elemento raiz do SgScreen." },
  { prop: "defaultState", type: "SgDockLayoutState", defaultValue: "-", description: "Estado inicial das toolbars por zona." },
  { prop: "layoutClassName", type: "string", defaultValue: "grid auto (top/bottom/left/right/free)", description: "Classes adicionais para o layout de dock interno; se nao informado, usa grid padrao." },
  { prop: "fullscreen", type: "boolean", defaultValue: "true", description: "Quando true, ocupa a viewport inteira." },
  { prop: "width / height", type: "number | string", defaultValue: "-", description: "Dimensoes da tela base." },
  { prop: "padding", type: "number | string", defaultValue: "-", description: "Padding interno do SgScreen." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customizacao visual do SgScreen." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Conteudo interno (normalmente SgDockZone)." }
];







export default function SgDockScreenPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgDockScreen");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgDockScreen"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <SgDockScreen
            id="showcase-dock-screen-basic-v1"
            fullscreen={false}
            height={420}
            className="overflow-hidden rounded-xl border border-border bg-background"
          >
            <SgDockZone zone="top">
              <SgToolBar id="tb-top-dock-screen-v1" dockZone="top" orientationDirection="horizontal-left" title="Topo" draggable>
                <SgToolbarIconButton icon={<Home className="size-4" />} label="Home" hint="Ir para inicio" />
                <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar dados" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="bottom">
              <SgToolBar id="tb-bottom-dock-screen-v1" dockZone="bottom" orientationDirection="horizontal-left" title="Base" draggable>
                <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
                <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Relatorio" hint="Abrir relatorios" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="left">
              <SgToolBar id="tb-left-dock-screen-v1" dockZone="left" orientationDirection="vertical-down" title="Navegacao" collapsible draggable>
                <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir clientes" />
                <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="right">
              <SgToolBar id="tb-right-dock-screen-v1" dockZone="right" orientationDirection="vertical-down" title="Equipe" collapsible draggable>
                <SgToolbarIconButton icon={<Users className="size-4" />} label="Usuarios" hint="Gerenciar usuarios" />
                <SgToolbarIconButton icon={<Settings className="size-4" />} label="Ajustes" hint="Abrir ajustes" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="free">
              <div className="pointer-events-none text-sm text-muted-foreground">Area central livre</div>
            </SgDockZone>
          </SgDockScreen>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-dock-screen/samples/basico.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <SgPlayground
            title={t(i18n, `${K}.playgroundTitle`)}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-dock-screen/sg-dock-screen.tsx.playground"
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference
          id="props-reference"
          title={t(i18n, `${K}.propsTitle`)}
          rows={DOCK_SCREEN_PROPS}
        />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

