import React from "react";
import { SgWizard, SgWizardPage } from "@seedgrid/fe-components";
const step: React.CSSProperties = { border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 16, background: "hsl(var(--muted))" };
export function Basic() {
  return (
    <div style={{ maxWidth: 480 }}>
      <SgWizard labels={{ next: "Avançar", previous: "Voltar", finish: "Concluir" }} onFinish={() => {}}>
        <SgWizardPage>
          <div style={step}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Dados da empresa</div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Razão social, CNPJ e endereço.</p>
          </div>
        </SgWizardPage>
        <SgWizardPage>
          <div style={step}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Responsável</div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Nome, CPF e contato do responsável.</p>
          </div>
        </SgWizardPage>
        <SgWizardPage>
          <div style={step}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Confirmação</div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Revise os dados e conclua o cadastro.</p>
          </div>
        </SgWizardPage>
      </SgWizard>
    </div>
  );
}
