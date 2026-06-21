import React from "react";
import { Home, Users, ShoppingCart, Settings } from "lucide-react";
import { SgMenu } from "@seedgrid/fe-components";
const MENU = [
  { id: "dashboard", label: "Dashboard", icon: <Home size={16} /> },
  {
    id: "clientes",
    label: "Clientes",
    icon: <Users size={16} />,
    children: [
      { id: "clientes-novo", label: "Novo cliente" },
      { id: "clientes-rel", label: "Relatórios" },
    ],
  },
  {
    id: "pedidos",
    label: "Pedidos",
    icon: <ShoppingCart size={16} />,
    children: [{ id: "pedidos-vendas", label: "Vendas" }],
  },
  { id: "config", label: "Configurações", icon: <Settings size={16} /> },
];
export function Panel() {
  return (
    <div style={{ maxWidth: 280 }}>
      <SgMenu menu={MENU} menuStyle="panel" selection={{ activeId: "dashboard" }} brand={{ title: "SeedGrid ERP" }} onNavigate={() => {}} />
    </div>
  );
}
