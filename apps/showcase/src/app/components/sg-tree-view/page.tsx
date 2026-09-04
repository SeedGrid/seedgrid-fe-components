"use client";

import React from "react";
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Shield, Users, FileText, BarChart3, Star } from "lucide-react";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
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
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const DATA: SgTreeNode[] = [
  {
    id: "root",
    label: "Admin",
    icon: <Shield className="h-4 w-4" />,
    children: [
      {
        id: "users",
        label: "Users",
        icon: <Users className="h-4 w-4" />,
        children: [
          { id: "users.list", label: "List users", icon: <FileText className="h-4 w-4" /> },
          { id: "users.create", label: "Create user", icon: <FileText className="h-4 w-4" /> }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        icon: <BarChart3 className="h-4 w-4" />,
        children: [
          { id: "reports.sales", label: "Sales report", icon: <FileText className="h-4 w-4" /> },
          { id: "reports.financial", label: "Financial report", icon: <FileText className="h-4 w-4" /> }
        ]
      }
    ]
  }
];

const JSON_DATA = [
  {
    id: "root",
    label: "Admin",
    children: [
      {
        id: "users",
        label: "Users",
        children: [
          { id: "users.list", label: "List users", checked: true },
          { id: "users.create", label: "Create user" }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "reports.sales", label: "Sales report", checked: true },
          { id: "reports.financial", label: "Financial report" }
        ]
      }
    ]
  }
];

const TREE_VIEW_PLAYGROUND_CODE = `import * as React from "react";
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const nodes: SgTreeNode[] = [
  {
    id: "root",
    label: "Admin",
    children: [
      {
        id: "users",
        label: "Users",
        children: [
          { id: "users.list", label: "List users" },
          { id: "users.create", label: "Create user" }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "reports.sales", label: "Sales report" },
          { id: "reports.financial", label: "Financial report" }
        ]
      }
    ]
  }
];

export default function App() {
  const [checkable, setCheckable] = React.useState(true);
  const [searchable, setSearchable] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="flex gap-4 text-xs">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={checkable} onChange={(e) => setCheckable(e.target.checked)} />checkable</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={searchable} onChange={(e) => setSearchable(e.target.checked)} />searchable</label>
      </div>
      <SgTreeView
        nodes={nodes}
        searchable={searchable}
        searchPlaceholder="Search..."
        checkable={checkable}
        defaultExpandedIds={["root", "users"]}
      />
    </div>
  );
}`;

const TREE_VIEW_PROPS: ShowcasePropRow[] = [
  { prop: "nodes", type: "SgTreeNode[]", defaultValue: "[]", description: "Estrutura hierárquica de nós." },
  { prop: "checkable / checkMode / confirmSelection", type: "boolean / token / token", defaultValue: "false / instant / all", description: "Comportamento de seleção com checkboxes." },
  { prop: "checkedIds / defaultCheckedIds / onCheckedChange", type: "string[] / string[] / callback", defaultValue: "controlado / [] / -", description: "Estado de seleção." },
  { prop: "checkableLabel", type: "string", defaultValue: "-", description: "Cabeçalho da coluna do checkbox principal (só aparece com tracks)." },
  { prop: "tracks", type: "SgTreeTrack[]", defaultValue: "-", description: "Colunas extras por linha: boolean e enum têm cascata pai→filhos independente; custom não tem estado (a árvore cede a célula e você renderiza). Cada trilha tem label, width e — nas de seleção — adornment para conteúdo livre ao lado do controle." },
  { prop: "expandedIds / defaultExpandedIds / onExpandedChange", type: "string[] / string[] / callback", defaultValue: "controlado / [] / -", description: "Estado de expansão." },
  { prop: "searchable / searchPlaceholder / searchValue", type: "boolean / string / string", defaultValue: "false / Search... / controlado", description: "Busca e filtro da árvore." },
  { prop: "size / density / tone / iconTone", type: "tokens", defaultValue: "md / normal / default / default", description: "Ajustes visuais do componente." },
  { prop: "onLeafClick / onExpand / onCollapse", type: "callbacks", defaultValue: "-", description: "Eventos de interação." },
  { prop: "confirmBar / emptyText / maxHeightClassName", type: "objeto / string / string", defaultValue: "- / No results / -", description: "Configurações complementares da interface." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes extras no container." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Inline style adicional no container." }
];

export default function SgTreeViewPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgTreeView");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const treeRef = React.useRef<SgTreeViewRef>(null);
  const confirmRef = React.useRef<SgTreeViewRef>(null);
  const [checkedIds, setCheckedIds] = React.useState<string[]>([]);
  const [readAll, setReadAll] = React.useState<string[]>([]);
  const [readLeafs, setReadLeafs] = React.useState<string[]>([]);
  const [confirmed, setConfirmed] = React.useState<string[]>([]);
  // Sandbox da prop `tracks`: uma trilha boolean ("prioridade") + uma enum ("tipo de conta") na
  // MESMA arvore, cada uma com sua propria cascata pai->filhos, independente da outra e do
  // checkable principal.
  const [priorityIds, setPriorityIds] = React.useState<string[]>([]);
  const [accountTypeByNode, setAccountTypeByNode] = React.useState<Record<string, string | undefined>>({});

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.treeView.title")}
          subtitle={t(i18n, "showcase.component.treeView.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.treeView.sections.basic.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.basic.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.permissions")}>
          <SgTreeView
            ref={treeRef}
            nodes={DATA}
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
            checkable
            checkedIds={checkedIds}
            onCheckedChange={setCheckedIds}
            onLeafClick={(id) => console.log("leaf click", id)}
            size="md"
            density="normal"
            tone="default"
            style={{ border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 12, padding: 8 }}
          />
        </SgCard>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-sm"
            onClick={() => setReadAll(treeRef.current?.getCheckedIds() ?? [])}
          >
            {t(i18n, "showcase.component.treeView.labels.readAll")}
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-sm"
            onClick={() => setReadLeafs(treeRef.current?.getCheckedLeafIds() ?? [])}
          >
            {t(i18n, "showcase.component.treeView.labels.readLeafs")}
          </button>
        </div>
        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">checkedIds:</span>{" "}
            {readAll.length ? readAll.join(", ") : "-"}
          </div>
          <div>
            <span className="font-medium text-foreground">leafIds:</span>{" "}
            {readLeafs.length ? readLeafs.join(", ") : "-"}
          </div>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-tree-view/samples/basico.tsx.sample" />
      </Section>

      <Section title="2) Icon Tone" description="Altere a cor dos icones para primary.">
        <SgCard title="Icons in Primary">
          <SgTreeView
            nodes={DATA}
            iconTone="primary"
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
          />
        </SgCard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-tree-view/samples/icon-tone.tsx.sample" />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.treeView.sections.confirm.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.confirm.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.confirmTitle")}>
          <SgTreeView
            ref={confirmRef}
            nodes={DATA}
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
            checkable
            checkMode="confirm"
            confirmSelection="leafOnly"
            confirmBar={{
              label: t(i18n, "showcase.component.treeView.labels.confirm"),
              showCancel: true,
              cancelLabel: t(i18n, "showcase.component.treeView.labels.clear"),
              onConfirm: (ids) => setConfirmed(ids),
              onCancel: () => confirmRef.current?.clearChecked()
            }}
          />
        </SgCard>
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">confirmIds:</span>{" "}
          {confirmed.length ? confirmed.join(", ") : "-"}
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-tree-view/samples/confirm.tsx.sample" />
      </Section>

      <Section
        title={`4) ${t(i18n, "showcase.component.treeView.sections.size.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.size.description")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SgTreeView nodes={DATA} size="sm" density="compact" />
          <SgTreeView nodes={DATA} size="md" density="normal" />
          <SgTreeView nodes={DATA} size="lg" density="comfortable" />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-tree-view/samples/size.tsx.sample" />
      </Section>

      <Section
        title={`5) ${t(i18n, "showcase.component.treeView.sections.expanded.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.expanded.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.expandedTitle")}>
          <SgTreeView
            nodes={DATA}
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
            defaultExpandedIds={["root", "users"]}
          />
        </SgCard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-tree-view/samples/expanded.tsx.sample" />
      </Section>

      <Section
        title={`6) ${t(i18n, "showcase.component.treeView.sections.jsonChecked.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.jsonChecked.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.jsonTitle")}>
          {(() => {
            const { nodes, checkedIds } = sgTreeFromJsonWithChecked(JSON_DATA);
            return (
              <SgTreeView
                nodes={nodes}
                checkable
                defaultCheckedIds={checkedIds}
                defaultExpandedIds={["root", "users"]}
              />
            );
          })()}
        </SgCard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-tree-view/samples/json-checked.tsx.sample" />
      </Section>

      <Section
        title="8) Tracks (colunas extras por linha)"
        description="Uma coluna por trilha, cada uma com seu cabecalho (label) e largura (width). As trilhas boolean e enum tem cascata pai->filhos propria e independente; a trilha custom nao tem estado nenhum -- a arvore so' cede a celula e a tela desenha o que quiser. O adornment poe conteudo livre ao lado do controle (aqui, uma estrela em 'List users')."
      >
        <SgCard title="Ativo + Prioridade + Tipo + coluna livre">
          <SgTreeView
            nodes={DATA}
            checkable
            checkableLabel="Ativo"
            checkedIds={checkedIds}
            onCheckedChange={setCheckedIds}
            defaultExpandedIds={["root", "users", "reports"]}
            tracks={[
              {
                id: "priority",
                kind: "boolean",
                label: "Prioridade",
                ariaLabel: "Prioridade",
                checkedIds: priorityIds,
                onCheckedChange: setPriorityIds,
                adornment: (node) =>
                  node.id === "users.list" ? (
                    <Star className="h-3.5 w-3.5 text-amber-500" aria-label="Destaque" />
                  ) : null
              },
              {
                id: "accountType",
                kind: "enum",
                label: "Tipo de conta",
                width: "150px",
                placeholder: "—",
                mixedLabel: "— misto —",
                options: [
                  { value: "fixo", label: "Custo fixo" },
                  { value: "variavel", label: "Custo variável" },
                  { value: "despesa", label: "Despesa variável" },
                  { value: "investimento", label: "Investimento" }
                ],
                valueByNodeId: accountTypeByNode,
                onChange: setAccountTypeByNode
              },
              {
                id: "acao",
                kind: "custom",
                label: "Coluna livre",
                width: "130px",
                render: (node) =>
                  node.children?.length ? null : (
                    <button
                      type="button"
                      className="cursor-pointer border-none bg-transparent text-xs text-sg-muted underline"
                      onClick={() => setAccountTypeByNode((prev) => ({ ...prev, [node.id]: "fixo" }))}
                    >
                      marcar fixo
                    </button>
                  )
              }
            ]}
          />
        </SgCard>
        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">checkedIds (principal):</span>{" "}
            {checkedIds.length ? checkedIds.join(", ") : "-"}
          </div>
          <div>
            <span className="font-medium text-foreground">priorityIds (trilha boolean):</span>{" "}
            {priorityIds.length ? priorityIds.join(", ") : "-"}
          </div>
          <div>
            <span className="font-medium text-foreground">accountTypeByNode (trilha enum):</span>{" "}
            {Object.keys(accountTypeByNode).length
              ? Object.entries(accountTypeByNode)
                  .map(([k, v]) => `${k}=${v}`)
                  .join(", ")
              : "-"}
          </div>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-tree-view/samples/tracks.tsx.sample" />
      </Section>

      <Section title="7) Playground (SgPlayground)" description="Teste interativo das principais props do SgTreeView.">
        <SgPlayground
          title="SgTreeView Playground"
          interactive
          codeContract="appFile"
          playgroundFile="apps/showcase/src/app/components/sg-tree-view/sg-tree-view.tsx.playground"
          height={560}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference rows={TREE_VIEW_PROPS} />
      {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
      {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

