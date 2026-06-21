import React from "react";
import { SgToaster, toast } from "@seedgrid/fe-components";

export function Basic() {
  React.useEffect(() => {
    toast.success("Cliente salvo", { description: "Ana Souza foi cadastrada com sucesso.", duration: 1000000 });
    toast.warning("Documento pendente", { description: "Envie o CNPJ para concluir.", duration: 1000000 });
  }, []);
  return (
    <div style={{ position: "relative", minHeight: 220, padding: 16 }}>
      <SgToaster position="top-center" />
    </div>
  );
}
