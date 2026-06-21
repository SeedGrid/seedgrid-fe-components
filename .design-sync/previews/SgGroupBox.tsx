import React from "react";
import { SgGroupBox, SgInputText } from "@seedgrid/fe-components";
export function Basic() {
  return (
    <SgGroupBox title="Dados pessoais" style={{ maxWidth: 380 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SgInputText id="gb-nome" label="Nome" onChange={() => {}} />
        <SgInputText id="gb-email" label="E-mail" onChange={() => {}} />
      </div>
    </SgGroupBox>
  );
}
