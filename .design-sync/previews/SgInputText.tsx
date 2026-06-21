import React from "react";
import { Search } from "lucide-react";
import { SgInputText } from "@seedgrid/fe-components";

const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 };

export function Basic() {
  return (
    <div style={col}>
      <SgInputText id="nome" label="Nome completo" placeholder="Maria Silva" onChange={() => {}} />
    </div>
  );
}

export function Required() {
  return (
    <div style={col}>
      <SgInputText id="email" label="E-mail" required placeholder="maria@empresa.com.br" hintText="Campo obrigatório" onChange={() => {}} />
    </div>
  );
}

export function WithAffixes() {
  return (
    <div style={col}>
      <SgInputText id="busca" label="Buscar cliente" prefixIcon={<Search size={16} />} placeholder="Nome ou CPF" onChange={() => {}} />
      <SgInputText id="dominio" label="Site" prefixText="https://" suffixText=".com.br" onChange={() => {}} />
    </div>
  );
}

export function States() {
  return (
    <div style={col}>
      <SgInputText id="filled" label="Preenchido" filled placeholder="Estilo filled" onChange={() => {}} />
      <SgInputText id="readonly" label="Somente leitura" readOnly inputProps={{ defaultValue: "Valor fixo" }} onChange={() => {}} />
      <SgInputText id="erro" label="Com erro" error="CPF inválido" onChange={() => {}} />
    </div>
  );
}
