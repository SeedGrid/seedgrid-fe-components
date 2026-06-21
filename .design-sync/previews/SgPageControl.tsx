import React from "react";
import { UserRound, Receipt, ShieldCheck } from "lucide-react";
import { SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";
export function Basic() {
  return (
    <div style={{ maxWidth: 460 }}>
      <SgPageControl defaultActivePageId="cadastro">
        <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound size={15} />}>
          <div style={{ padding: 12, fontSize: 14 }}>Dados do cliente: nome, CPF, contato.</div>
        </SgPageControlPage>
        <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt size={15} />}>
          <div style={{ padding: 12, fontSize: 14 }}>Informações fiscais e tributárias.</div>
        </SgPageControlPage>
        <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck size={15} />}>
          <div style={{ padding: 12, fontSize: 14 }}>Permissões e autenticação.</div>
        </SgPageControlPage>
      </SgPageControl>
    </div>
  );
}
