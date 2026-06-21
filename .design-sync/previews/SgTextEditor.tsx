import React from "react";
import { SgTextEditor } from "@seedgrid/fe-components";
export function Basic() {
  return (
    <div style={{ maxWidth: 560 }}>
      <SgTextEditor
        id="editor"
        valueHtml="<h3>Comunicado interno</h3><p>Prezada equipe, segue o <strong>relatório mensal</strong> de vendas com os principais destaques do período.</p><ul><li>Receita: R$ 128.400</li><li>Novos clientes: 47</li></ul>"
        onChangeHtml={() => {}}
      />
    </div>
  );
}
