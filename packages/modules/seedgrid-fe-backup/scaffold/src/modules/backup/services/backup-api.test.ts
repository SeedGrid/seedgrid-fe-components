// seedgrid:managed

import { describe, expect, it } from "vitest";

import { ApiClientError } from "@/modules/core";

import { extractBackupApiMessage } from "./backup-api";

describe("extractBackupApiMessage", () => {
  it("returns the first violation message from backend validation errors", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      type: "https://seedgrid.com.br/dados-invalidos",
      title: "Dados invalidos",
      status: 400,
      detail: "Revise os campos informados.",
      devMessage: "",
      instance: "/exports",
      violations: [
        {
          field: "exportRequest.format",
          message: "Formato de exportacao invalido",
        },
      ],
    });

    expect(extractBackupApiMessage(error)).toBe("Formato de exportacao invalido");
  });

  it("returns the rfc7807 detail when the response has no violations", () => {
    const error = new ApiClientError("API request failed with status 403", 403, {
      type: "https://seedgrid.com.br/acesso-negado",
      title: "Acesso negado",
      status: 403,
      detail: "Voce nao tem permissao para criar exportacoes",
      devMessage: "",
      instance: "/exports",
    });

    expect(extractBackupApiMessage(error)).toBe(
      "Voce nao tem permissao para criar exportacoes"
    );
  });

  it("parses stringified problem json responses before extracting the message", () => {
    const error = new ApiClientError(
      "API request failed with status 400",
      400,
      JSON.stringify({
        type: "https://seedgrid.com.br/dados-invalidos",
        title: "Dados invalidos",
        status: 400,
        detail: "Revise os campos informados.",
        devMessage: "",
        instance: "/exports",
        violations: [
          {
            field: "exportRequest.format",
            message: "Formato e obrigatorio",
          },
          {
            field: "exportRequest.scope",
            message: "Escopo e obrigatorio",
          },
        ],
      })
    );

    expect(extractBackupApiMessage(error)).toBe("Formato e obrigatorio");
  });

  it("falls back to the api client message when the response has no readable details", () => {
    const error = new ApiClientError("API request failed with status 500", 500, {
      status: 500,
    });

    expect(extractBackupApiMessage(error)).toBe(
      "API request failed with status 500"
    );
  });

  it("falls back to the api client message for an empty response body", () => {
    // Corpo vazio {} e tao "sem conteudo legivel" quanto { status: 500 } (o
    // teste-irmao acima) — ambos caem no message do ApiClientError, de forma
    // consistente. (Antes este teste esperava null, um contrato divergente do
    // irmao que o codigo nunca honrou.)
    const error = new ApiClientError("API request failed with status 500", 500, {});

    expect(extractBackupApiMessage(error)).toBe(
      "API request failed with status 500"
    );
  });

  it("maps fetch failures to a friendly server connection message", () => {
    const result = extractBackupApiMessage(new Error("fetch failed"));
    // The message is resolved from i18n — verify it is a non-null string
    expect(result).not.toBeNull();
    expect(typeof result).toBe("string");
  });

  it("maps 'failed to fetch' to the server connection message", () => {
    const result = extractBackupApiMessage(new Error("Failed to fetch"));
    expect(result).not.toBeNull();
    expect(typeof result).toBe("string");
  });

  it("returns null for non-Error unknown values", () => {
    expect(extractBackupApiMessage(null)).toBeNull();
    expect(extractBackupApiMessage(undefined)).toBeNull();
    expect(extractBackupApiMessage("string error")).toBeNull();
    expect(extractBackupApiMessage(42)).toBeNull();
  });

  it("returns null when the response body is an HTML page", () => {
    const error = new ApiClientError(
      "API request failed with status 502",
      502,
      "<!DOCTYPE html><html><body>Bad Gateway</body></html>"
    );

    expect(extractBackupApiMessage(error)).toBeNull();
  });
});
