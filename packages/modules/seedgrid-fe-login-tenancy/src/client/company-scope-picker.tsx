"use client";

// Passo de seleção de empresa pós-login (login-tenancy). Portado do report-client
// CompanySelect (Tauri) e DESACOPLADO do transporte: recebe listCompanies/selectCompany
// por props — o app pluga action/route/invoke. Sem chrome de app (o app envolve isto no
// próprio card); slots de texto via props.

import { useEffect, useState } from "react";
import { SgButton, SgCombobox } from "@seedgrid/fe-components";

import { companyLabel, type MyCompany, type SelectCompanyResult } from "../company";

export interface CompanyScopePickerProps {
  /** Carrega as empresas do usuário (GET /me/companies via action/route do app). */
  listCompanies: () => Promise<MyCompany[]>;
  /** Escopa o token na empresa escolhida (POST /me/select-company via action/route). */
  selectCompany: (publicId: string) => Promise<SelectCompanyResult>;
  /** Login concluído. Recebe o nome da empresa escopada pro app exibir no header. */
  onSignedIn: (scopedCompanyName?: string) => void;
  /** Voltar ao login (opcional). */
  onCancel?: () => void;

  // Slots de texto (defaults pt-BR).
  description?: string;
  companyFieldLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Extrai a mensagem exibível de um erro lançado. Default: err.message. */
  readError?: (err: unknown) => string;
}

const defaultReadError = (err: unknown): string =>
  err instanceof Error && err.message ? err.message : "Erro inesperado.";

export function CompanyScopePicker({
  listCompanies,
  selectCompany,
  onSignedIn,
  onCancel,
  description = "Sua conta tem acesso a mais de uma empresa. Escolha com qual deseja entrar.",
  companyFieldLabel = "Empresa",
  confirmLabel = "Entrar",
  cancelLabel = "Voltar ao login",
  readError = defaultReadError,
}: CompanyScopePickerProps) {
  const [companies, setCompanies] = useState<MyCompany[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const list = await listCompanies();
        if (!active) return;
        setCompanies(list);
        if (list.length > 0) {
          setSelected(list[0]!.publicId);
        }
      } catch (err) {
        if (active) setError(readError(err));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // listCompanies/readError são estáveis por contrato do app; roda só na montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConfirm() {
    if (!selected) {
      setError("Selecione uma empresa.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await selectCompany(selected);
      if (result.kind === "signed_in") {
        const chosen = companies.find((c) => c.publicId === selected);
        onSignedIn(chosen ? companyLabel(chosen) : undefined);
      } else {
        setError(result.message ?? "Não foi possível selecionar a empresa.");
      }
    } catch (err) {
      setError(readError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sg-company-scope-picker">
      {description ? (
        <p className="mb-4 text-sm text-sg-muted">{description}</p>
      ) : null}

      <SgCombobox<MyCompany>
        id="company-scope-select"
        label={companyFieldLabel}
        source={companies}
        value={selected ?? ""}
        mapItem={(item) => ({
          id: item.publicId,
          label: companyLabel(item),
          value: item.publicId,
        })}
        onValueChange={(value) =>
          setSelected(value == null || value === "" ? null : String(value))
        }
      />

      <SgButton
        severity="primary"
        appearance="solid"
        loading={busy}
        disabled={loading || !selected}
        onClick={() => void handleConfirm()}
        className="mt-3 w-full"
      >
        {confirmLabel}
      </SgButton>

      {onCancel ? (
        <div className="mt-4 flex justify-center">
          <SgButton severity="primary" appearance="ghost" onClick={onCancel}>
            {cancelLabel}
          </SgButton>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-sg-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
