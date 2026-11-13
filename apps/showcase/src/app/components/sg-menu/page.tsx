"use client";

import React from "react";
import {
  SgAvatar,
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  toast,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { BarChart2, ClipboardList, CreditCard, DollarSign, Download, Home, LayoutGrid, Plus, Printer, Save, Search, Settings, ShoppingCart, Trash2, Users, Wallet } from "lucide-react";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n, type ShowcaseI18n } from "../../../i18n";

const K = "showcase.component.menu";

const menu = (i18n: ShowcaseI18n): SgMenuNode[] => [
  { id: "dashboard", label: t(i18n, `${K}.items.dashboard`), url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "customers",
    label: t(i18n, `${K}.items.customers`),
    icon: <Users className="size-4" />,
    children: [
      {
        id: "customers-new",
        label: t(i18n, `${K}.items.new`),
        icon: <LayoutGrid className="size-4" />,
        children: [
          { id: "customer-create", label: t(i18n, `${K}.items.customer`), url: "/customers/new/customer" },
          { id: "customer-duplicate", label: t(i18n, `${K}.items.duplicate`), url: "/customers/new/duplicate" }
        ]
      },
      {
        id: "customers-reports",
        label: t(i18n, `${K}.items.reports`),
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "customers-cohort", label: t(i18n, `${K}.items.cohort`), url: "/customers/reports/cohort" },
          { id: "customers-churn", label: t(i18n, `${K}.items.churn`), url: "/customers/reports/churn" }
        ]
      }
    ]
  },
  {
    id: "orders",
    label: t(i18n, `${K}.items.orders`),
    icon: <LayoutGrid className="size-4" />,
    children: [
      {
        id: "orders-sales",
        label: t(i18n, `${K}.items.sales`),
        icon: <Search className="size-4" />,
        children: [
          { id: "orders-open", label: t(i18n, `${K}.items.openOrders`), url: "/orders/sales/open", badge: 4 },
          { id: "orders-closed", label: t(i18n, `${K}.items.closedOrders`), url: "/orders/sales/closed" }
        ]
      },
      { id: "orders-returns", label: t(i18n, `${K}.items.returns`), url: "/orders/returns", badge: 7 }
    ]
  },
  { id: "profile", label: t(i18n, `${K}.items.profileLabel`), url: "/profile", icon: <Settings className="size-4" /> }
];

const tieredMenu = (i18n: ShowcaseI18n): SgMenuNode[] => [
  { id: "dashboard", label: t(i18n, `${K}.items.dashboard`), url: "/dashboard", icon: <Home className="size-4" />, onClick: () => toast.message(t(i18n, `${K}.items.dashboard`)) },
  {
    id: "customers",
    label: t(i18n, `${K}.items.customers`),
    icon: <Users className="size-4" />,
    children: [
      {
        id: "customers-new",
        label: t(i18n, `${K}.items.new`),
        icon: <LayoutGrid className="size-4" />,
        children: [
          { id: "customer-create", label: t(i18n, `${K}.items.customer`), url: "/customers/new/customer", onClick: () => toast.message(t(i18n, `${K}.items.customer`)) },
          { id: "customer-duplicate", label: t(i18n, `${K}.items.duplicate`), url: "/customers/new/duplicate", onClick: () => toast.message(t(i18n, `${K}.items.duplicate`)) }
        ]
      },
      {
        id: "customers-reports",
        label: t(i18n, `${K}.items.reports`),
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "customers-cohort", label: t(i18n, `${K}.items.cohort`), url: "/customers/reports/cohort", onClick: () => toast.message(t(i18n, `${K}.items.cohort`)) },
          { id: "customers-churn", label: t(i18n, `${K}.items.churn`), url: "/customers/reports/churn", onClick: () => toast.message(t(i18n, `${K}.items.churn`)) }
        ]
      }
    ]
  },
  {
    id: "orders",
    label: t(i18n, `${K}.items.orders`),
    icon: <LayoutGrid className="size-4" />,
    children: [
      {
        id: "orders-sales",
        label: t(i18n, `${K}.items.sales`),
        icon: <Search className="size-4" />,
        children: [
          { id: "orders-open", label: t(i18n, `${K}.items.openOrders`), url: "/orders/sales/open", badge: 4, onClick: () => toast.message(t(i18n, `${K}.items.openOrders`)) },
          { id: "orders-closed", label: t(i18n, `${K}.items.closedOrders`), url: "/orders/sales/closed", onClick: () => toast.message(t(i18n, `${K}.items.closedOrders`)) }
        ]
      },
      { id: "orders-returns", label: t(i18n, `${K}.items.returns`), url: "/orders/returns", badge: 7, onClick: () => toast.message(t(i18n, `${K}.items.returns`)) }
    ]
  },
  { id: "profile", label: t(i18n, `${K}.items.profileLabel`), url: "/profile", icon: <Settings className="size-4" />, onClick: () => toast.message(t(i18n, `${K}.items.profileLabel`)) }
];

const megaMenu = (i18n: ShowcaseI18n): SgMenuNode[] => [
  {
    id: "fashion",
    label: t(i18n, `${K}.items.fashion`),
    icon: <Users className="size-4" />,
    children: [
      {
        id: "fashion-woman",
        label: t(i18n, `${K}.items.woman`),
        children: [
          { id: "fashion-woman-1", label: t(i18n, `${K}.items.womanCasual`), url: "/fashion/woman/1" },
          { id: "fashion-woman-2", label: t(i18n, `${K}.items.womanFormal`), url: "/fashion/woman/2" }
        ]
      },
      {
        id: "fashion-men",
        label: t(i18n, `${K}.items.men`),
        children: [
          { id: "fashion-men-1", label: t(i18n, `${K}.items.menCasual`), url: "/fashion/men/1" },
          { id: "fashion-men-2", label: t(i18n, `${K}.items.menFormal`), url: "/fashion/men/2" }
        ]
      }
    ]
  },
  {
    id: "electronics",
    label: t(i18n, `${K}.items.electronics`),
    icon: <Settings className="size-4" />,
    children: [
      {
        id: "electronics-computer",
        label: t(i18n, `${K}.items.computer`),
        children: [
          { id: "electronics-computer-1", label: t(i18n, `${K}.items.laptop`), url: "/electronics/computer/1" },
          { id: "electronics-computer-2", label: t(i18n, `${K}.items.desktop`), url: "/electronics/computer/2" }
        ]
      },
      {
        id: "electronics-tv",
        label: t(i18n, `${K}.items.tv`),
        children: [
          { id: "electronics-tv-1", label: t(i18n, `${K}.items.smartTv`), url: "/electronics/tv/1" },
          { id: "electronics-tv-2", label: t(i18n, `${K}.items.homeTheater`), url: "/electronics/tv/2" }
        ]
      }
    ]
  }
];

const userMenu = (i18n: ShowcaseI18n): SgMenuNode[] => [
  { id: "perfil", label: t(i18n, `${K}.items.profile`), onClick: () => {} },
  { id: "preferencias", label: t(i18n, `${K}.items.preferences`), onClick: () => {} },
  { id: "logout", label: t(i18n, `${K}.items.signOut`), onClick: () => {} }
];

const dockableMenu = (i18n: ShowcaseI18n): SgMenuNode[] => [
  { id: "dk-dashboard", label: t(i18n, `${K}.items.dashboard`), url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "dk-financeiro",
    label: t(i18n, `${K}.items.finance`),
    icon: <DollarSign className="size-4" />,
    children: [
      {
        id: "dk-contas-pagar",
        label: t(i18n, `${K}.items.accountsPayable`),
        icon: <CreditCard className="size-4" />,
        children: [
          { id: "dk-pagar-aberto", label: t(i18n, `${K}.items.open`), url: "/financeiro/pagar/aberto", badge: 12 },
          { id: "dk-pagar-vencidas", label: t(i18n, `${K}.items.overdue`), url: "/financeiro/pagar/vencidas", badge: 3 }
        ]
      },
      {
        id: "dk-contas-receber",
        label: t(i18n, `${K}.items.accountsReceivable`),
        icon: <Wallet className="size-4" />,
        children: [
          { id: "dk-receber-aberto", label: t(i18n, `${K}.items.open`), url: "/financeiro/receber/aberto", badge: 8 },
          { id: "dk-receber-recebidas", label: t(i18n, `${K}.items.received`), url: "/financeiro/receber/recebidas" }
        ]
      },
      { id: "dk-financeiro-rel", label: t(i18n, `${K}.items.reports`), icon: <BarChart2 className="size-4" />, url: "/financeiro/relatorios" }
    ]
  },
  {
    id: "dk-clientes",
    label: t(i18n, `${K}.items.customers`),
    icon: <Users className="size-4" />,
    children: [
      { id: "dk-clientes-cadastro", label: t(i18n, `${K}.items.register`), url: "/clientes/cadastro" },
      {
        id: "dk-clientes-relatorios",
        label: t(i18n, `${K}.items.reports`),
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "dk-clientes-cohort", label: t(i18n, `${K}.items.cohort`), url: "/clientes/relatorios/cohort" },
          { id: "dk-clientes-churn", label: t(i18n, `${K}.items.churn`), url: "/clientes/relatorios/churn" }
        ]
      }
    ]
  },
  {
    id: "dk-pedidos",
    label: t(i18n, `${K}.items.orders`),
    icon: <ShoppingCart className="size-4" />,
    children: [
      {
        id: "dk-pedidos-vendas",
        label: t(i18n, `${K}.items.sales`),
        icon: <Search className="size-4" />,
        children: [
          { id: "dk-pedidos-abertos", label: t(i18n, `${K}.items.open`), url: "/pedidos/vendas/aberto", badge: 4 },
          { id: "dk-pedidos-fechados", label: t(i18n, `${K}.items.closed`), url: "/pedidos/vendas/encerrados" }
        ]
      },
      { id: "dk-pedidos-devolucoes", label: t(i18n, `${K}.items.returns`), url: "/pedidos/devolucoes", badge: 7 }
    ]
  },
  {
    id: "dk-configuracoes",
    label: t(i18n, `${K}.items.settings`),
    icon: <Settings className="size-4" />,
    children: [
      { id: "dk-config-usuarios", label: t(i18n, `${K}.items.users`), url: "/configuracoes/usuarios" },
      { id: "dk-config-perfis", label: t(i18n, `${K}.items.accessProfiles`), url: "/configuracoes/perfis" },
      { id: "dk-config-sistema", label: t(i18n, `${K}.items.system`), url: "/configuracoes/sistema" }
    ]
  }
];

const dockableUserMenu = (i18n: ShowcaseI18n): SgMenuNode[] => [
  { id: "dk-meu-perfil", label: t(i18n, `${K}.items.profile`), onClick: () => {} },
  { id: "dk-preferencias", label: t(i18n, `${K}.items.preferences`), onClick: () => {} },
  { id: "dk-trocar-empresa", label: t(i18n, `${K}.items.switchCompany`), onClick: () => {} },
  { id: "dk-logout", label: t(i18n, `${K}.items.signOut`), onClick: () => {} }
];

type MenuI18n = ReturnType<typeof useShowcaseI18n>;

function buildAccordionMenu(i18n: MenuI18n): SgMenuNode[] {
  return [
    {
      id: "relatorios",
      label: t(i18n, `${K}.items.reports`),
      children: [
        { id: "relatorio-mensal", label: t(i18n, `${K}.items.monthly`) },
        { id: "relatorio-anual", label: t(i18n, `${K}.items.annual`) }
      ]
    },
    {
      id: "cadastros",
      label: t(i18n, `${K}.items.registrations`),
      children: [
        { id: "produtos", label: t(i18n, `${K}.items.products`) },
        { id: "fornecedores", label: t(i18n, `${K}.items.suppliers`) }
      ]
    }
  ];
}

function buildSimpleMenu(i18n: MenuI18n): SgMenuNode[] {
  return [
    { id: "painel", label: t(i18n, `${K}.items.dashboard`), icon: <Home className="size-4" /> },
    { id: "financeiro", label: t(i18n, `${K}.items.finance`), icon: <DollarSign className="size-4" /> }
  ];
}

function buildUserActionsMenu(i18n: MenuI18n): SgMenuNode[] {
  return [
    { id: "perfil", label: t(i18n, `${K}.items.profile`) },
    { id: "preferencias", label: t(i18n, `${K}.items.preferences`) },
    { id: "sair", label: t(i18n, `${K}.items.signOut`) }
  ];
}

const DOCKABLE_SHELL_STYLE = {
  "--primary": "27 62% 47%",
  "--primary-foreground": "0 0% 100%",
  "--muted": "35 55% 94%",
  "--muted-foreground": "28 30% 36%",
  "--border": "32 42% 83%",
  "--ring": "27 62% 47%",
  "--background": "40 33% 97%",
  "--card": "40 33% 97%"
} as React.CSSProperties;

const DOCKABLE_MENU_STYLE_OPTIONS: SgRadioGroupOption[] = [
  { label: "PanelMenu", value: "PanelMenu" },
  { label: "Tiered Menu", value: "Tiered" }
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

const MENU_CODE_SNIPPET = `const MENU = [
  { id: "dashboard", label: "Painel", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "customers",
    label: "Clientes",
    icon: <Users className="size-4" />,
    children: [
      {
        id: "customers-new",
        label: "Novo",
        icon: <LayoutGrid className="size-4" />,
        children: [
          { id: "customer-create", label: "Cliente", url: "/customers/new/customer" },
          { id: "customer-duplicate", label: "Duplicar", url: "/customers/new/duplicate" }
        ]
      },
      {
        id: "customers-reports",
        label: "Relatórios",
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "customers-cohort", label: "Coorte", url: "/customers/reports/cohort" },
          { id: "customers-churn", label: "Churn", url: "/customers/reports/churn" }
        ]
      }
    ]
  },
  {
    id: "orders",
    label: "Pedidos",
    icon: <LayoutGrid className="size-4" />,
    children: [
      {
        id: "orders-sales",
        label: "Vendas",
        icon: <Search className="size-4" />,
        children: [
          { id: "orders-open", label: "Pedidos abertos", url: "/orders/sales/open", badge: 4 },
          { id: "orders-closed", label: "Pedidos fechados", url: "/orders/sales/closed" }
        ]
      },
      { id: "orders-returns", label: "Devoluções", url: "/orders/returns", badge: 7 }
    ]
  },
  { id: "profile", label: "Perfil", url: "/profile", icon: <Settings className="size-4" /> }
];`;

const MEGA_MENU_CODE_SNIPPET = `const MEGA_MENU = [
  {
    id: "fashion",
    label: "Moda",
    icon: <Users className="size-4" />,
    children: [
      {
        id: "fashion-woman",
        label: "Mulher",
        children: [
          { id: "fashion-woman-1", label: "Mulher casual", url: "/fashion/woman/1" },
          { id: "fashion-woman-2", label: "Mulher formal", url: "/fashion/woman/2" }
        ]
      },
      {
        id: "fashion-men",
        label: "Homem",
        children: [
          { id: "fashion-men-1", label: "Homem casual", url: "/fashion/men/1" },
          { id: "fashion-men-2", label: "Homem formal", url: "/fashion/men/2" }
        ]
      }
    ]
  },
  {
    id: "electronics",
    label: "Eletrônicos",
    icon: <Settings className="size-4" />,
    children: [
      {
        id: "electronics-computer",
        label: "Computador",
        children: [
          { id: "electronics-computer-1", label: "Notebook", url: "/electronics/computer/1" },
          { id: "electronics-computer-2", label: "Desktop", url: "/electronics/computer/2" }
        ]
      },
      {
        id: "electronics-tv",
        label: "TV",
        children: [
          { id: "electronics-tv-1", label: "Smart TV", url: "/electronics/tv/1" },
          { id: "electronics-tv-2", label: "Home theater", url: "/electronics/tv/2" }
        ]
      }
    ]
  }
];`;

const USER_MENU_CODE_SNIPPET = `const USER_MENU = [
  { id: "perfil", label: "Meu perfil", onClick: () => {} },
  { id: "preferencias", label: "Preferências", onClick: () => {} },
  { id: "logout", label: "Sair", onClick: () => {} }
];`;

const EXAMPLE_SIDEBAR_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

${USER_MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="h-[460px] overflow-hidden rounded-lg border border-border">
      <div className="flex h-full">
        <SgMenu
          menu={MENU}
          selection={{ activeId }}
          menuStyle="sidebar"
          mode="accordion"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseButton
          search={{ enabled: true, placeholder: "Search module..." }}
          brand={{ title: "SeedGrid ERP" }}
          user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
          userMenu={USER_MENU}
          onNavigate={(node) => setActiveId(node.id)}
        />
        <div className="flex-1 space-y-3 p-4">
          <h3 className="text-base font-semibold">Main content</h3>
          <p className="text-sm text-muted-foreground">
            Active item: <span className="font-medium text-foreground">{activeId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}`;

const EXAMPLE_DRAWER_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerPinned, setDrawerPinned] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <SgButton onClick={() => setDrawerOpen(true)}>Open mobile menu</SgButton>
        <SgButton appearance="outline" onClick={() => setDrawerPinned((v) => !v)}>
          \${drawerPinned ? "Unpin drawer" : "Pin drawer"}
        </SgButton>
      </div>

      <SgMenu
        menu={MENU}
        selection={{ activeId }}
        menuStyle="drawer"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        pinned={drawerPinned}
        onPinnedChange={setDrawerPinned}
        showPinButton
        closeOnNavigate
        search={{ enabled: true, placeholder: "Search..." }}
        brand={{ title: "SeedGrid ERP" }}
        onNavigate={(node) => setActiveId(node.id)}
      />
    </>
  );
}`;

const EXAMPLE_PANEL_MENU_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="h-[320px] overflow-auto rounded-md border border-border">
        <SgMenu menu={MENU} selection={{ activeId }} menuStyle="inline" menuVariantStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
      </div>
    </div>
  );
}`;

const EXAMPLE_TIERED_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
        <SgMenu menu={MENU} selection={{ activeId }} menuStyle="inline" menuVariantStyle="Tiered" onNavigate={(node) => setActiveId(node.id)} />
      </div>
    </div>
  );
}`;

const EXAMPLE_MEGA_HORIZONTAL_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MEGA_MENU_CODE_SNIPPET}

export default function Example() {
  return (
    <div className="rounded-lg border border-border p-3">
      <SgMenu
        menu={MEGA_MENU}
        selection={{ activeId: "fashion" }}
        menuStyle="inline"
        menuVariantStyle="MegaMenuHorizontal"
      />
    </div>
  );
}`;

const EXAMPLE_MEGA_VERTICAL_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MEGA_MENU_CODE_SNIPPET}

export default function Example() {
  return (
    <div className="rounded-lg border border-border p-3">
      <SgMenu
        menu={MEGA_MENU}
        selection={{ activeId: "fashion" }}
        menuStyle="inline"
        menuVariantStyle="MegaMenuVertical"
      />
    </div>
  );
}`;

const EXAMPLE_DOCKABLE_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { BarChart2, ClipboardList, CreditCard, DollarSign, Download, Home, Plus, Printer, Save, Search, Settings, ShoppingCart, Trash2, Users, Wallet } from "lucide-react";

const DOCKABLE_MENU = [
  { id: "dk-dashboard", label: "Painel", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "dk-financeiro",
    label: "Financeiro",
    icon: <DollarSign className="size-4" />,
    children: [
      {
        id: "dk-contas-pagar",
        label: "Contas a pagar",
        icon: <CreditCard className="size-4" />,
        children: [
          { id: "dk-pagar-aberto", label: "Em aberto", url: "/financeiro/pagar/aberto", badge: 12 },
          { id: "dk-pagar-vencidas", label: "Vencido", url: "/financeiro/pagar/vencidas", badge: 3 }
        ]
      },
      {
        id: "dk-contas-receber",
        label: "Contas a receber",
        icon: <Wallet className="size-4" />,
        children: [
          { id: "dk-receber-aberto", label: "Em aberto", url: "/financeiro/receber/aberto", badge: 8 },
          { id: "dk-receber-recebidas", label: "Recebido", url: "/financeiro/receber/recebidas" }
        ]
      },
      { id: "dk-financeiro-rel", label: "Relatórios", icon: <BarChart2 className="size-4" />, url: "/financeiro/relatorios" }
    ]
  },
  {
    id: "dk-clientes",
    label: "Clientes",
    icon: <Users className="size-4" />,
    children: [
      { id: "dk-clientes-cadastro", label: "Cadastro", url: "/clientes/cadastro" },
      {
        id: "dk-clientes-relatorios",
        label: "Relatórios",
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "dk-clientes-cohort", label: "Coorte", url: "/clientes/relatorios/cohort" },
          { id: "dk-clientes-churn", label: "Churn", url: "/clientes/relatorios/churn" }
        ]
      }
    ]
  },
  {
    id: "dk-pedidos",
    label: "Pedidos",
    icon: <ShoppingCart className="size-4" />,
    children: [
      {
        id: "dk-pedidos-vendas",
        label: "Vendas",
        icon: <Search className="size-4" />,
        children: [
          { id: "dk-pedidos-abertos", label: "Em aberto", url: "/pedidos/vendas/aberto", badge: 4 },
          { id: "dk-pedidos-fechados", label: "Fechado", url: "/pedidos/vendas/encerrados" }
        ]
      },
      { id: "dk-pedidos-devolucoes", label: "Devoluções", url: "/pedidos/devolucoes", badge: 7 }
    ]
  },
  {
    id: "dk-configuracoes",
    label: "Configurações",
    icon: <Settings className="size-4" />,
    children: [
      { id: "dk-config-usuarios", label: "Usuários", url: "/configuracoes/usuarios" },
      { id: "dk-config-perfis", label: "Perfis de acesso", url: "/configuracoes/perfis" },
      { id: "dk-config-sistema", label: "Sistema", url: "/configuracoes/sistema" }
    ]
  }
];

const DOCKABLE_USER_MENU = [
  { id: "dk-meu-perfil", label: "Meu perfil", onClick: () => {} },
  { id: "dk-preferencias", label: "Preferências", onClick: () => {} },
  { id: "dk-trocar-empresa", label: "Trocar empresa", onClick: () => {} },
  { id: "dk-logout", label: "Sair", onClick: () => {} }
];

const DOCKABLE_MENU_STYLE_OPTIONS = [
  { label: "PanelMenu", value: "PanelMenu" },
  { label: "Tiered Menu", value: "Tiered" }
];

const DOCKABLE_SHELL_STYLE = {
  "--primary": "27 62% 47%",
  "--primary-foreground": "0 0% 100%",
  "--muted": "35 55% 94%",
  "--muted-foreground": "28 30% 36%",
  "--border": "32 42% 83%",
  "--ring": "27 62% 47%",
  "--background": "40 33% 97%",
  "--card": "40 33% 97%"
};

export default function Example() {
  const [dockActiveId, setDockActiveId] = React.useState("dk-dashboard");
  const [dockMenuStyle, setDockMenuStyle] = React.useState<"PanelMenu" | "Tiered">("PanelMenu");

  return (
    <div className="space-y-3">
      <SgRadioGroup
        title="Menu Style"
        source={DOCKABLE_MENU_STYLE_OPTIONS}
        value={dockMenuStyle}
        orientation="horizontal"
        onChange={(value) => {
          if (value === "PanelMenu" || value === "Tiered") setDockMenuStyle(value);
        }}
      />

      <div
        className="relative min-h-[520px] overflow-visible rounded-lg border border-[#e2cebc] bg-[#f0ebe4]"
        style={DOCKABLE_SHELL_STYLE}
      >
        <SgDockLayout
          id="showcase-menu-dock-v2"
          className="grid min-h-[520px] grid-cols-[auto_1fr_auto] grid-rows-[3.5rem_1fr_auto]"
        >
          <SgDockZone zone="top" />
          <SgDockZone zone="left" />
          <SgDockZone zone="right" />
          <SgDockZone zone="bottom" />
          <SgDockZone zone="free">
            <div className="pointer-events-none text-sm text-[#7e5f46]">Free center area</div>
          </SgDockZone>

          <SgMenu
            id="menu-dock-sidebar-v2"
            menu={DOCKABLE_MENU}
            selection={{ activeId: dockActiveId }}
            menuStyle="sidebar"
            menuVariantStyle={dockMenuStyle}
            mode="accordion"
            dockable
            dockZone="left"
            draggable
            showCollapseButton
            search={{ enabled: true, placeholder: "Search module..." }}
            brand={{ title: "SeedGrid ERP", imageSrc: "/logo-seedgrid.svg" }}
            user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
            userMenu={DOCKABLE_USER_MENU}
            userSectionStyle={{ backgroundColor: "#ebe0d4" }}
            onNavigate={(node) => setDockActiveId(node.id)}
          />

          <SgToolBar
            id="toolbar-dock-v1"
            dockZone="top"
            orientationDirection="horizontal-left"
            title="Tools"
            draggable
            collapsible={false}
          >
            <SgToolbarIconButton icon={<Plus className="size-4" />} hint="New record" severity="primary" />
            <SgToolbarIconButton icon={<Save className="size-4" />} hint="Salvar" />
            <SgToolbarIconButton icon={<Printer className="size-4" />} hint="Print" />
            <SgToolbarIconButton icon={<Download className="size-4" />} hint="Export" />
            <SgToolbarIconButton icon={<Trash2 className="size-4" />} hint="Excluir" severity="danger" />
          </SgToolBar>
        </SgDockLayout>
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
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

${MENU_CODE_SNIPPET}

export default function App() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [menuStyle, setMenuStyle] = React.useState<"sidebar" | "drawer" | "inline" | "hybrid">("sidebar");
  const [menuVariantStyle, setMenuVariantStyle] = React.useState<"panel" | "tiered" | "mega-horizontal" | "mega-vertical">("panel");
  const [collapsed, setCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("sidebar")}>sidebar</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("drawer")}>drawer</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("inline")}>inline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("hybrid")}>hybrid</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("panel")}>panel</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("tiered")}>tiered</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("mega-horizontal")}>mega-h</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("mega-vertical")}>mega-v</SgButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setCollapsed((v) => !v)}>toggle collapsed</SgButton>
        <SgButton size="sm" onClick={() => setOpen((v) => !v)}>toggle open</SgButton>
      </div>

      <div className="h-[420px] overflow-hidden rounded-lg border border-border">
        <SgMenu
          menu={MENU}
          selection={{ activeId }}
          menuStyle={menuStyle}
          menuVariantStyle={menuVariantStyle}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          open={open}
          onOpenChange={setOpen}
          showCollapseButton
          onNavigate={(node) => setActiveId(node.id)}
          search={{ enabled: true, placeholder: "Search..." }}
        />
      </div>
    </div>
  );
}`;

const MENU_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Stable menu identifier (recommended for dockable persistence)." },
  { prop: "menu", type: "SgMenuNode[]", defaultValue: "-", description: "Navigation tree rendered by the menu." },
  { prop: "selection", type: "SgMenuSelection", defaultValue: "-", description: "Active item by id or URL." },
  { prop: "brand", type: "SgMenuBrand", defaultValue: "-", description: "Brand block at the top." },
  { prop: "user", type: "SgMenuUser", defaultValue: "-", description: "User block at the top/footer of the menu." },
  { prop: "userMenu", type: "SgMenuNode[]", defaultValue: "-", description: "Actions shown in the user menu." },
  { prop: "menuStyle", type: "\"sidebar\" | \"drawer\" | \"inline\" | \"hybrid\"", defaultValue: "sidebar", description: "General presentation mode." },
  { prop: "menuVariantStyle", type: "SgMenuStyle", defaultValue: "panel", description: "Internal style: panel, tiered, mega-horizontal, or mega-vertical." },
  { prop: "position", type: "\"left\" | \"right\"", defaultValue: "left", description: "Horizontal menu position." },
  { prop: "density", type: "\"compact\" | \"comfortable\"", defaultValue: "comfortable", description: "Visual density of rows and icons." },
  { prop: "indent", type: "number", defaultValue: "16", description: "Indent per depth level." },
  { prop: "collapsedWidth", type: "number | string", defaultValue: "72", description: "Width when collapsed." },
  { prop: "expandedWidth", type: "number | string", defaultValue: "280", description: "Width when expanded." },
  { prop: "overlaySize", type: "SgExpandablePanelSize", defaultValue: "-", description: "Overlay size in drawer/hybrid modes." },
  { prop: "overlayBackdrop", type: "boolean", defaultValue: "-", description: "Controls overlay backdrop." },
  { prop: "dockable", type: "boolean", defaultValue: "false", description: "When true and inside SgDockLayout, the menu can be docked in zones." },
  { prop: "dockZone", type: "\"top\" | \"bottom\" | \"left\" | \"right\" | \"free\"", defaultValue: "left", description: "Initial zone in dockable mode (if omitted, can be inferred from orientationDirection)." },
  { prop: "draggable", type: "boolean", defaultValue: "false", description: "In dockable mode, shows drag handle between dock zones." },
  { prop: "orientationDirection", type: "\"horizontal-left\" | \"horizontal-right\" | \"vertical-up\" | \"vertical-top\" | \"vertical-down\"", defaultValue: "-", description: "Optional direction used as fallback to infer initial dockZone." },
  { prop: "mode", type: "\"accordion\" | \"multiple\"", defaultValue: "multiple", description: "Group expansion strategy." },
  { prop: "expandedIds", type: "string[]", defaultValue: "-", description: "External control of expanded groups." },
  { prop: "defaultExpandedIds", type: "string[]", defaultValue: "[]", description: "Initial state of expanded groups." },
  { prop: "onExpandedIdsChange", type: "(ids: string[]) => void", defaultValue: "-", description: "Callback when expanded groups change." },
  { prop: "collapsed", type: "boolean", defaultValue: "-", description: "External control of collapsed state." },
  { prop: "defaultCollapsed", type: "boolean", defaultValue: "false", description: "Initial collapsed state." },
  { prop: "onCollapsedChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback when collapsing/expanding." },
  { prop: "showCollapseButton", type: "boolean", defaultValue: "false", description: "Shows collapse button in the header." },
  { prop: "open", type: "boolean", defaultValue: "-", description: "External control of drawer/overlay open state." },
  { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state in drawer/overlay." },
  { prop: "onOpenChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback when opening/closing overlay." },
  { prop: "closeOnNavigate", type: "boolean", defaultValue: "-", description: "Closes drawer after navigation." },
  { prop: "pinned", type: "boolean", defaultValue: "-", description: "External control of pinned state." },
  { prop: "defaultPinned", type: "boolean", defaultValue: "false", description: "Initial pinned state." },
  { prop: "onPinnedChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback when pinning/unpinning." },
  { prop: "showPinButton", type: "boolean", defaultValue: "false", description: "Shows pin button in the header." },
  { prop: "onNavigate", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Fired for navigation items (URL)." },
  { prop: "onAction", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Fired for action items." },
  { prop: "onItemClick", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Fired on any item click." },
  { prop: "ariaLabel", type: "string", defaultValue: "\"Menu\"", description: "Accessibility label for nav." },
  { prop: "keyboardNavigation", type: "boolean", defaultValue: "true", description: "Enables keyboard navigation." },
  { prop: "openSubmenuOnHover", type: "boolean", defaultValue: "false", description: "In tiered style, opens submenu on hover when true; default opens on click." },
  { prop: "search", type: "{ enabled: boolean; placeholder?: string }", defaultValue: "{ enabled: false }", description: "Integrated search configuration." },
  { prop: "elevation", type: "\"none\" | \"sm\" | \"md\"", defaultValue: "none", description: "Container elevation/shadow." },
  { prop: "border", type: "boolean", defaultValue: "true", description: "Shows external menu border." },
  { prop: "className", type: "string", defaultValue: "-", description: "Additional CSS classes on root." },
  { prop: "style", type: "CSSProperties", defaultValue: "-", description: "Inline styles on root." },
  { prop: "userSectionClassName", type: "string", defaultValue: "-", description: "Additional CSS classes in the user section (menu footer area)." },
  { prop: "userSectionStyle", type: "CSSProperties", defaultValue: "-", description: "Inline styles in the user section, useful to customize background color." },
  { prop: "footer", type: "ReactNode", defaultValue: "-", description: "Menu footer content." }
];

const MENU_NODE_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Unique item identifier." },
  { prop: "label", type: "string", defaultValue: "-", description: "Text displayed on the item." },
  { prop: "url", type: "string", defaultValue: "-", description: "Navigation route for the item." },
  { prop: "children", type: "SgMenuNode[]", defaultValue: "-", description: "Child items of the current node." },
  { prop: "enabled", type: "boolean", defaultValue: "true", description: "Disables item interaction." },
  { prop: "icon", type: "ReactNode", defaultValue: "-", description: "Direct item icon." },
  { prop: "badge", type: "string | number", defaultValue: "-", description: "Auxiliary badge next to the label." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Local item action." }
];

const MENU_SELECTION_PROPS: ShowcasePropRow[] = [
  { prop: "activeId", type: "string", defaultValue: "-", description: "Active item id." },
  { prop: "activeUrl", type: "string", defaultValue: "-", description: "Active URL for route-based selection." }
];

const MENU_BRAND_PROPS: ShowcasePropRow[] = [
  { prop: "title", type: "string", defaultValue: "-", description: "Title displayed in the brand block." },
  { prop: "imageSrc", type: "string", defaultValue: "-", description: "Brand image URL." },
  { prop: "image", type: "ReactNode", defaultValue: "-", description: "Custom image element." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Action when clicking the brand." }
];

const MENU_USER_PROPS: ShowcasePropRow[] = [
  { prop: "name", type: "string", defaultValue: "-", description: "Name displayed in the user block." },
  { prop: "subtitle", type: "string", defaultValue: "-", description: "User helper text." },
  { prop: "avatarSrc", type: "string", defaultValue: "-", description: "User avatar URL." },
  { prop: "avatar", type: "ReactNode", defaultValue: "-", description: "Custom avatar." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Action when clicking the user block." }
];










export default function SgMenuPage() {
  const i18n = useShowcaseI18n();
  const accordionMenu = React.useMemo(() => buildAccordionMenu(i18n), [i18n]);
  const simpleMenu = React.useMemo(() => buildSimpleMenu(i18n), [i18n]);
  const userActionsMenu = React.useMemo(() => buildUserActionsMenu(i18n), [i18n]);
  const menuNodes = React.useMemo(() => menu(i18n), [i18n]);
  const tieredMenuNodes = React.useMemo(() => tieredMenu(i18n), [i18n]);
  const megaMenuNodes = React.useMemo(() => megaMenu(i18n), [i18n]);
  const userMenuNodes = React.useMemo(() => userMenu(i18n), [i18n]);
  const dockableMenuNodes = React.useMemo(() => dockableMenu(i18n), [i18n]);
  const dockableUserMenuNodes = React.useMemo(() => dockableUserMenu(i18n), [i18n]);
  const aiComponent = useAiManifestComponent("SgMenu");
  const [activeId, setActiveId] = React.useState("dashboard");
  const [tieredActiveId, setTieredActiveId] = React.useState("dashboard");
  const [dockActiveId, setDockActiveId] = React.useState("dashboard");
  const [dockMenuStyle, setDockMenuStyle] = React.useState<"PanelMenu" | "Tiered">("PanelMenu");
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerPinned, setDrawerPinned] = React.useState(false);
  const [userAction, setUserAction] = React.useState("-");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgMenu"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <div className="h-[460px] overflow-hidden rounded-lg border border-border">
            <div className="flex h-full">
              <SgMenu
                menu={menuNodes}
                selection={{ activeId }}
                menuStyle="sidebar"
                mode="accordion"
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
                showCollapseButton
                search={{ enabled: true, placeholder: t(i18n, `${K}.sidebarSearchPlaceholder`) }}
                brand={{ title: "SeedGrid ERP" }}
                user={{ name: "Lucia Souza", subtitle: t(i18n, `${K}.sidebarUserSubtitle`) }}
                userMenu={userMenuNodes}
                onNavigate={(node) => setActiveId(node.id)}
              />
              <div className="flex-1 space-y-3 p-4">
                <h3 className="text-base font-semibold">{t(i18n, `${K}.mainContentTitle`)}</h3>
                <p className="text-sm text-muted-foreground">
                  {t(i18n, `${K}.activeItemLabel`)}: <span className="font-medium text-foreground">{activeId}</span>
                </p>
              </div>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/sidebar-fixa.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => setDrawerOpen(true)}>{t(i18n, `${K}.drawerOpenButton`)}</SgButton>
            <SgButton appearance="outline" onClick={() => setDrawerPinned((v) => !v)}>
              {drawerPinned ? t(i18n, `${K}.drawerUnpinButton`) : t(i18n, `${K}.drawerPinButton`)}
            </SgButton>
          </div>

          <SgMenu
            menu={menuNodes}
            selection={{ activeId }}
            menuStyle="drawer"
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            pinned={drawerPinned}
            onPinnedChange={setDrawerPinned}
            showPinButton
            closeOnNavigate
            search={{ enabled: true, placeholder: t(i18n, `${K}.drawerSearchPlaceholder`) }}
            brand={{ title: "SeedGrid ERP" }}
            onNavigate={(node) => setActiveId(node.id)}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/drawer-mobile.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section3Title`)} description={t(i18n, `${K}.section3Description`)}>
          <div className="rounded-lg border border-border p-3">
            <div className="h-[320px] overflow-auto rounded-md border border-border">
              <SgMenu menu={menuNodes} selection={{ activeId }} menuStyle="inline" menuVariantStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/panel-menu.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
          <div className="rounded-lg border border-border p-3">
            <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
              <SgMenu
                menu={tieredMenuNodes}
                selection={{ activeId: tieredActiveId }}
                menuStyle="inline"
                menuVariantStyle="Tiered"
                onNavigate={(node) => setTieredActiveId(node.id)}
                onItemClick={(node) => setTieredActiveId(node.id)}
              />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/tiered.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section5Title`)} description={t(i18n, `${K}.section5Description`)}>
          <div className="rounded-lg border border-border p-3">
            <SgMenu
              menu={megaMenuNodes}
              selection={{ activeId: "fashion" }}
              menuStyle="inline"
              menuVariantStyle="MegaMenuHorizontal"
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/mega-menu-horizontal.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section6Title`)} description={t(i18n, `${K}.section6Description`)}>
          <div className="rounded-lg border border-border p-3">
            <SgMenu
              menu={megaMenuNodes}
              selection={{ activeId: "fashion" }}
              menuStyle="inline"
              menuVariantStyle="MegaMenuVertical"
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/mega-menu-vertical.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section7Title`)} description={t(i18n, `${K}.section7Description`)}>
          <div className="space-y-3">
            <SgRadioGroup
              title={t(i18n, `${K}.dockMenuStyleTitle`)}
              source={DOCKABLE_MENU_STYLE_OPTIONS}
              value={dockMenuStyle}
              orientation="horizontal"
              onChange={(value) => {
                if (value === "PanelMenu" || value === "Tiered") setDockMenuStyle(value);
              }}
            />

            <div
              className="relative min-h-[520px] overflow-visible rounded-lg border border-[#e2cebc] bg-[#f0ebe4]"
              style={DOCKABLE_SHELL_STYLE}
            >
              <SgDockLayout
                id="showcase-menu-dock-v2"
                className="grid min-h-[520px] grid-cols-[auto_1fr_auto] grid-rows-[3.5rem_1fr_auto]"
              >
                <SgDockZone zone="top" />
                <SgDockZone zone="left" />
                <SgDockZone zone="right" />
                <SgDockZone zone="bottom" />
                <SgDockZone zone="free">
                  <div className="pointer-events-none text-sm text-[#7e5f46]">{t(i18n, `${K}.dockFreeAreaLabel`)}</div>
                </SgDockZone>

                <SgMenu
                  id="menu-dock-sidebar-v2"
                  menu={dockableMenuNodes}
                  selection={{ activeId: dockActiveId }}
                  menuStyle="sidebar"
                  menuVariantStyle={dockMenuStyle}
                  mode="accordion"
                  dockable
                  dockZone="left"
                  draggable
                  showCollapseButton
                  search={{ enabled: true, placeholder: t(i18n, `${K}.dockSearchPlaceholder`) }}
                  brand={{ title: "SeedGrid ERP", imageSrc: "/logo-seedgrid.svg" }}
                  user={{ name: "Lucia Souza", subtitle: t(i18n, `${K}.dockUserSubtitle`) }}
                  userMenu={dockableUserMenuNodes}
                  userSectionStyle={{ backgroundColor: "#ebe0d4" }}
                  onNavigate={(node) => setDockActiveId(node.id)}
                />

                <SgToolBar
                  id="toolbar-dock-v1"
                  dockZone="top"
                  orientationDirection="horizontal-left"
                  title={t(i18n, `${K}.toolbarTitle`)}
                  draggable
                  collapsible={false}
                >
                  <SgToolbarIconButton icon={<Plus className="size-4" />} hint={t(i18n, `${K}.toolbarHintNew`)} severity="primary" />
                  <SgToolbarIconButton icon={<Save className="size-4" />} hint={t(i18n, `${K}.toolbarHintSave`)} />
                  <SgToolbarIconButton icon={<Printer className="size-4" />} hint={t(i18n, `${K}.toolbarHintPrint`)} />
                  <SgToolbarIconButton icon={<Download className="size-4" />} hint={t(i18n, `${K}.toolbarHintExport`)} />
                  <SgToolbarIconButton icon={<Trash2 className="size-4" />} hint={t(i18n, `${K}.toolbarHintDelete`)} severity="danger" />
                </SgToolBar>
              </SgDockLayout>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/sidebar-dockable.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section8Title`)} description={t(i18n, `${K}.section8Description`)}>
          <div className="rounded-lg border border-border p-3">
            <div className="h-[360px] overflow-auto rounded-md border border-border">
              <SgMenu
                menu={accordionMenu}
                selection={{ activeId: "relatorio-mensal" }}
                menuStyle="inline"
                mode="accordion"
                indent={20}
              />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/acordeao-selecao-e-expansao-inicial.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section9Title`)} description={t(i18n, `${K}.section9Description`)}>
          <div className="space-y-3">
            <div className="h-[460px] overflow-hidden rounded-lg border border-border">
              <div className="flex h-full">
                <SgMenu
                  menu={simpleMenu}
                  menuStyle="sidebar"
                  brand={{ title: "SeedGrid ERP" }}
                  user={{
                    name: "Lúcia Souza",
                    subtitle: t(i18n, `${K}.sidebarUserSubtitle`),
                    onClick: () => setUserAction("user-block")
                  }}
                  userMenu={userActionsMenu.map((item) => ({ ...item, onClick: () => setUserAction(item.id) }))}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(i18n, `${K}.lastAction`)}: <span className="font-medium text-foreground">{userAction}</span>
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/usuario-e-menu-do-usuario.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section10Title`)} description={t(i18n, `${K}.section10Description`)}>
          <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
            <SgMenu
              ariaLabel={t(i18n, `${K}.ariaMainNavigation`)}
              menuStyle="inline"
              menuVariantStyle="Tiered"
              openSubmenuOnHover
              menu={[
                {
                  id: "arquivo",
                  label: t(i18n, `${K}.items.file`),
                  children: [
                    { id: "novo", label: t(i18n, `${K}.items.new`) },
                    {
                      id: "exportar",
                      label: t(i18n, `${K}.items.export`),
                      children: [
                        { id: "pdf", label: "PDF" },
                        { id: "csv", label: "CSV" }
                      ]
                    }
                  ]
                },
                { id: "editar", label: t(i18n, `${K}.items.edit`) }
              ]}
            />
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-menu/samples/submenu-ao-passar-o-mouse.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section11Title`)} description={t(i18n, `${K}.section11Description`)}>
          <div className="h-[320px] overflow-hidden rounded-lg border border-border">
            <div className="flex h-full">
              <SgMenu
                menuStyle="sidebar"
                brand={{ title: "SeedGrid ERP" }}
                user={{
                  name: "Lúcia Souza",
                  subtitle: t(i18n, `${K}.sidebarUserSubtitle`),
                  avatar: <SgAvatar size="sm" label="LS" />
                }}
                footer={<span className="text-xs">v1.0</span>}
                menu={[
                  { id: "painel", label: t(i18n, `${K}.items.dashboard`) },
                  { id: "financeiro", label: t(i18n, `${K}.items.finance`) }
                ]}
              />
            </div>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-menu/samples/rodape-e-avatar-do-usuario.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section12Title`)} description={t(i18n, `${K}.section12Description`)}>
          <SgPlayground
            title={t(i18n, `${K}.playgroundTitle`)}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-menu/sg-menu.tsx.playground"
            height={780}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference id="props-reference" title={t(i18n, `${K}.propsMenuTitle`)} rows={MENU_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-node" title={t(i18n, `${K}.propsNodeTitle`)} rows={MENU_NODE_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-selection" title={t(i18n, `${K}.propsSelectionTitle`)} rows={MENU_SELECTION_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-brand" title={t(i18n, `${K}.propsBrandTitle`)} rows={MENU_BRAND_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-user" title={t(i18n, `${K}.propsUserTitle`)} rows={MENU_USER_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}

        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}





