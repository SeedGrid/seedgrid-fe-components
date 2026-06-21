import React from "react";
import { SgDatatable } from "@seedgrid/fe-components";
type Row = { id: number; code: string; name: string; category: string; price: number; stock: number };
const ROWS: Row[] = [
  { id: 1, code: "P-1000", name: "Notebook Pro 14", category: "Computadores", price: 7899, stock: 22 },
  { id: 2, code: "P-1001", name: "Teclado Mecânico", category: "Acessórios", price: 549, stock: 64 },
  { id: 3, code: "P-1002", name: "Mouse Ergonômico", category: "Acessórios", price: 289, stock: 48 },
  { id: 4, code: "P-1003", name: "Monitor 4K 27\"", category: "Monitores", price: 2499, stock: 8 },
  { id: 5, code: "P-1004", name: "Dock USB-C", category: "Acessórios", price: 919, stock: 11 },
  { id: 6, code: "P-1005", name: "Headset com Cancelamento", category: "Áudio", price: 1329, stock: 31 },
];
const COLUMNS = [
  { field: "code", header: "Código", sortable: true },
  { field: "name", header: "Produto", sortable: true },
  { field: "category", header: "Categoria", sortable: true },
  { field: "stock", header: "Estoque", sortable: true, align: "right" as const },
  { field: "price", header: "Preço (R$)", sortable: true, align: "right" as const },
];
export function Basic() {
  return (
    <div style={{ minWidth: 560 }}>
      <SgDatatable value={ROWS} columns={COLUMNS} />
    </div>
  );
}
export function Paginated() {
  return (
    <div style={{ minWidth: 560 }}>
      <SgDatatable value={ROWS} columns={COLUMNS} paginator rows={4} selectionMode="single" />
    </div>
  );
}
