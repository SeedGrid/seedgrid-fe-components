"use client";

import React from "react";
import { Check, Copy, Pencil, Trash2, X } from "lucide-react";
import {
  SgButton,
  SgInputText,
  SgPopup,
  type SgPopupAction,
  type SgPopupAlign,
  type SgPopupPlacement,
} from "@seedgrid/fe-components";
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

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const POPUP_PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgPopup,
  type SgPopupAction,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<"auto" | "top" | "right" | "bottom" | "left">("auto");

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-5">
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("auto")}>auto</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("top")}>top</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("right")}>right</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("bottom")}>bottom</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("left")}>left</SgButton>
      </div>

      <SgButton ref={anchorRef} onClick={() => setOpen(true)}>
        Abrir popup
      </SgButton>

      <SgPopup
        title="Configuração"
        subtitle="Exemplo interativo"
        open={open}
        onOpenChange={setOpen}
        anchorRef={anchorRef as React.RefObject<HTMLElement>}
        placement={placement}
        align="start"
        actions={[
          { label: "Confirmar", onClick: () => setOpen(false) },
          { label: "Cancelar", onClick: () => setOpen(false) }
        ]}
      />
    </div>
  );
}`;

const POPUP_PROPS: ShowcasePropRow[] = [
  { prop: "anchorRef", type: "RefObject<HTMLElement>", defaultValue: "-", description: "Elemento ancora obrigatorio." },
  { prop: "open / defaultOpen / onOpenChange", type: "boolean / boolean / callback", defaultValue: "controlado / false / -", description: "Controle de visibilidade." },
  { prop: "title / subtitle / children", type: "string / string / ReactNode", defaultValue: "- / - / -", description: "Conteudo textual e corpo customizado." },
  { prop: "placement / preferPlacement / align", type: "tokens", defaultValue: "auto / right / start", description: "Posicionamento e alinhamento do popup." },
  { prop: "offset / padding", type: "number", defaultValue: "8 / 8", description: "Distancia e margem de viewport." },
  { prop: "closeOnOutsideClick / closeOnEscape", type: "boolean", defaultValue: "true / true", description: "Regras de fechamento." },
  { prop: "actions", type: "SgPopupAction[]", defaultValue: "[]", description: "Acoes do rodape." },
  { prop: "className / style / zIndex / minWidth", type: "string / CSSProperties / number / number|string", defaultValue: "- / - / 1000 / -", description: "Customizacoes visuais." },
  { prop: "onOpen / onClose", type: "callbacks", defaultValue: "-", description: "Eventos de ciclo de abertura." }
];

export default function SgPopupPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgPopup");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const iconBtnRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [iconOpen, setIconOpen] = React.useState(false);
  const customBtnRef = React.useRef<HTMLButtonElement>(null);
  const [customOpen, setCustomOpen] = React.useState(false);
  const actionsBtnRef = React.useRef<HTMLButtonElement>(null);
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState("");
  const positionBtnRef = React.useRef<HTMLButtonElement>(null);
  const [positionOpen, setPositionOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<SgPopupPlacement>("bottom");
  const [align, setAlign] = React.useState<SgPopupAlign>("start");
  const fixedBtnRef = React.useRef<HTMLButtonElement>(null);
  const [fixedOpen, setFixedOpen] = React.useState(false);

  const actions: SgPopupAction[] = [
    {
      label: t(i18n, "showcase.component.popup.actions.confirm"),
      onClick: () => console.log("confirm")
    },
    {
      label: t(i18n, "showcase.component.popup.actions.cancel"),
      onClick: () => console.log("cancel")
    }
  ];
  const iconActions: SgPopupAction[] = [
    {
      label: t(i18n, "showcase.component.popup.actions.approve"),
      hint: t(i18n, "showcase.component.popup.actions.approveHint"),
      icon: <Check className="h-4 w-4" />,
      onClick: () => console.log("approve")
    },
    {
      label: t(i18n, "showcase.component.popup.actions.reject"),
      hint: t(i18n, "showcase.component.popup.actions.rejectHint"),
      icon: <X className="h-4 w-4" />,
      onClick: () => console.log("reject")
    }
  ];

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.popup.title")}
          subtitle={t(i18n, "showcase.component.popup.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.popup.sections.basic.title")}`}
        description={t(i18n, "showcase.component.popup.sections.basic.description")}
      >
        <div className="w-full flex items-center gap-3">
          <SgButton ref={btnRef} onClick={() => setOpen(true)}>
            {t(i18n, "showcase.component.popup.labels.open")}
          </SgButton>
          <SgPopup
            title={t(i18n, "showcase.component.popup.labels.title")}
            subtitle={t(i18n, "showcase.component.popup.labels.content")}
            open={open}
            onOpenChange={setOpen}
            anchorRef={btnRef as React.RefObject<HTMLElement>}
            placement="auto"
            preferPlacement="right"
            align="start"
            actions={actions}
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-popup/samples/basico.tsx.sample" />
      </Section>

      <Section
        title={`2) ${t(i18n, "showcase.component.popup.sections.iconHint.title")}`}
        description={t(i18n, "showcase.component.popup.sections.iconHint.description")}
      >
        <div className="w-full flex items-center gap-3">
          <SgButton ref={iconBtnRef} onClick={() => setIconOpen(true)}>
            {t(i18n, "showcase.component.popup.labels.openIcon")}
          </SgButton>
          <SgPopup
            title={t(i18n, "showcase.component.popup.labels.title")}
            open={iconOpen}
            onOpenChange={setIconOpen}
            anchorRef={iconBtnRef as React.RefObject<HTMLElement>}
            placement="auto"
            preferPlacement="right"
            align="start"
            actions={iconActions}
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-popup/samples/icone-hint.tsx.sample" />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.popup.sections.custom.title")}`}
        description={t(i18n, "showcase.component.popup.sections.custom.description")}
      >
        <div className="w-full flex items-center gap-3">
          <SgButton ref={customBtnRef} onClick={() => setCustomOpen(true)}>
            {t(i18n, "showcase.component.popup.labels.openCustom")}
          </SgButton>
          <SgPopup
            title={t(i18n, "showcase.component.popup.labels.config")}
            open={customOpen}
            onOpenChange={setCustomOpen}
            anchorRef={customBtnRef as React.RefObject<HTMLElement>}
            placement="auto"
          >
            <SgInputText id="popup-mode" label={t(i18n, "showcase.component.popup.labels.mode")} />
          </SgPopup>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-popup/samples/custom.tsx.sample" />
      </Section>

      <Section
        title={`4) ${t(i18n, "showcase.component.popup.sections.actions.title")}`}
        description={t(i18n, "showcase.component.popup.sections.actions.description")}
      >
        <div className="w-full flex items-center gap-3">
          <SgButton ref={actionsBtnRef} appearance="outline" onClick={() => setActionsOpen(true)}>
            {t(i18n, "showcase.component.popup.sections.actions.title")}
          </SgButton>
          {lastAction ? <span className="text-sm">{t(i18n, "showcase.component.popup.labels.lastAction")}: {lastAction}</span> : null}
          <SgPopup
            open={actionsOpen}
            onOpenChange={setActionsOpen}
            anchorRef={actionsBtnRef as React.RefObject<HTMLElement>}
            actions={[
              { label: t(i18n, "showcase.component.popup.actions.edit"), icon: <Pencil className="h-4 w-4" />, hint: t(i18n, "showcase.component.popup.actions.editHint"), onClick: () => setLastAction(t(i18n, "showcase.component.popup.actions.lastEdit")) },
              { label: t(i18n, "showcase.component.popup.actions.duplicate"), icon: <Copy className="h-4 w-4" />, closeOnClick: false, onClick: () => setLastAction(t(i18n, "showcase.component.popup.actions.lastDuplicate")) },
              { label: t(i18n, "showcase.component.popup.actions.unavailable"), enabled: false },
              { label: t(i18n, "showcase.component.popup.actions.delete"), icon: <Trash2 className="h-4 w-4" />, severity: "danger", onClick: () => setLastAction(t(i18n, "showcase.component.popup.actions.lastDelete")) }
            ]}
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-popup/samples/acoes.tsx.sample" />
      </Section>

      <Section
        title={`5) ${t(i18n, "showcase.component.popup.sections.positioning.title")}`}
        description={t(i18n, "showcase.component.popup.sections.positioning.description")}
      >
        <div className="w-full space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["auto", "top", "right", "bottom", "left"] as const).map((p) => (
              <SgButton key={p} size="sm" appearance={placement === p ? "solid" : "outline"} onClick={() => setPlacement(p)}>
                {p}
              </SgButton>
            ))}
            {(["start", "center", "end"] as const).map((a) => (
              <SgButton key={a} size="sm" appearance={align === a ? "solid" : "outline"} onClick={() => setAlign(a)}>
                {`align ${a}`}
              </SgButton>
            ))}
          </div>
          <SgButton ref={positionBtnRef} onClick={() => setPositionOpen(true)}>
            {t(i18n, "showcase.component.popup.labels.openPosition")}
          </SgButton>
          <SgPopup
            open={positionOpen}
            onOpenChange={setPositionOpen}
            anchorRef={positionBtnRef as React.RefObject<HTMLElement>}
            placement={placement}
            align={align}
          >
            <span className="text-sm">{`${placement} / ${align}`}</span>
          </SgPopup>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-popup/samples/posicionamento.tsx.sample" />
      </Section>

      <Section
        title={`6) ${t(i18n, "showcase.component.popup.sections.closing.title")}`}
        description={t(i18n, "showcase.component.popup.sections.closing.description")}
      >
        <div className="w-full flex items-center gap-3">
          <SgButton ref={fixedBtnRef} onClick={() => setFixedOpen(true)}>
            {t(i18n, "showcase.component.popup.labels.openFixed")}
          </SgButton>
          <SgPopup
            title={t(i18n, "showcase.component.popup.labels.fixed")}
            open={fixedOpen}
            onOpenChange={setFixedOpen}
            anchorRef={fixedBtnRef as React.RefObject<HTMLElement>}
            closeOnOutsideClick={false}
            closeOnEscape={false}
            actions={[{ label: t(i18n, "showcase.component.popup.labels.close") }]}
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-popup/samples/fechamento.tsx.sample" />
      </Section>

        <Section title={`7) ${t(i18n, "showcase.common.playground.sectionTitle")}`} description={t(i18n, "showcase.component.popup.playgroundDescription")}>
          <SgPlayground
            title="SgPopup Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-popup/sg-popup.tsx.playground"
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={POPUP_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

