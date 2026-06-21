import React from "react";
import { FileText, CreditCard, ShieldCheck } from "lucide-react";
import { SgAccordion } from "@seedgrid/fe-components";
const items = [
  { id: "dados", title: "Dados cadastrais", icon: <FileText size={16} />, content: "Nome, CPF, e-mail e telefone do cliente." },
  { id: "pagamento", title: "Pagamento", icon: <CreditCard size={16} />, content: "Forma de pagamento, parcelas e vencimento." },
  { id: "seguranca", title: "Segurança", icon: <ShieldCheck size={16} />, content: "Autenticação em duas etapas e permissões de acesso." },
];
export function Basic() {
  return <div style={{ maxWidth: 420 }}><SgAccordion items={items} defaultOpenFirst /></div>;
}
export function Multiple() {
  return <div style={{ maxWidth: 420 }}><SgAccordion items={items} multiple defaultActiveIndex={[0, 1]} /></div>;
}
