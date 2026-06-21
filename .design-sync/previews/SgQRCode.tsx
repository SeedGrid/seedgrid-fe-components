import React from "react";
import { SgQRCode } from "@seedgrid/fe-components";

export function Site() {
  return (
    <div style={{ padding: 16 }}>
      <SgQRCode value="https://seedgrid.com.br" size={180} />
    </div>
  );
}

export function Pix() {
  return (
    <div style={{ padding: 16 }}>
      <SgQRCode
        value="00020126580014BR.GOV.BCB.PIX0136contato@seedgrid.com.br5204000053039865802BR5922SEEDGRID TECNOLOGIA6009SAO PAULO62140510SEEDGRID1236304ABCD"
        size={180}
      />
    </div>
  );
}
