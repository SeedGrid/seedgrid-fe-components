import React from "react";
import { Layers, Building2, Box, FilePen } from "lucide-react";
import { SgBreadcrumb } from "@seedgrid/fe-components";
const items = [
  { id: "modulos", label: "Módulos", href: "#", icon: <Layers size={15} /> },
  { id: "cadastros", label: "Cadastros", href: "#", icon: <Building2 size={15} /> },
  { id: "produtos", label: "Produtos", href: "#", icon: <Box size={15} /> },
  { id: "editar", label: "Editar", icon: <FilePen size={15} /> },
];
export function Basic() {
  return <SgBreadcrumb items={items} separator="chevron" showHomeIcon />;
}
export function Slash() {
  return <SgBreadcrumb items={items} separator="slash" />;
}
