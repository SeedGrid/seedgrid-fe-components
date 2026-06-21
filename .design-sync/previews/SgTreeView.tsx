import React from "react";
import { Shield, Users, BarChart3, FileText } from "lucide-react";
import { SgTreeView } from "@seedgrid/fe-components";
const nodes = [
  {
    id: "admin",
    label: "Administração",
    icon: <Shield size={15} />,
    children: [
      {
        id: "users",
        label: "Usuários",
        icon: <Users size={15} />,
        children: [
          { id: "users.list", label: "Listar usuários", icon: <FileText size={15} /> },
          { id: "users.create", label: "Novo usuário", icon: <FileText size={15} /> },
        ],
      },
      {
        id: "reports",
        label: "Relatórios",
        icon: <BarChart3 size={15} />,
        children: [
          { id: "reports.sales", label: "Vendas", icon: <FileText size={15} /> },
          { id: "reports.fin", label: "Financeiro", icon: <FileText size={15} /> },
        ],
      },
    ],
  },
];
export function Basic() {
  return (
    <div style={{ maxWidth: 320 }}>
      <SgTreeView nodes={nodes} defaultExpandedIds={["admin", "users", "reports"]} />
    </div>
  );
}
export function Checkable() {
  return (
    <div style={{ maxWidth: 320 }}>
      <SgTreeView nodes={nodes} checkable defaultExpandedIds={["admin", "users"]} defaultCheckedIds={["users.list"]} />
    </div>
  );
}
