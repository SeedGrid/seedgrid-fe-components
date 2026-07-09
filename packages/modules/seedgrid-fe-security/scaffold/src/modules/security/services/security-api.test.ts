import { describe, expect, it } from "vitest";

import { ApiClientError } from "@/modules/core";

import { extractApiMessage } from "./security-api";

describe("extractApiMessage", () => {
  it("returns the first violation message from backend validation errors", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      type: "https://seedgrid.com.br/dados-invalidos",
      title: "Dados invalidos",
      status: 400,
      detail: "Revise os campos informados.",
      devMessage: "",
      instance: "/public/auth/login",
      violations: [
        {
          field: "login.loginDTO.password",
          message: "Senha e obrigatoria",
        },
      ],
    });

    expect(extractApiMessage(error)).toBe("Senha e obrigatoria");
  });

  it("prioritizes violation messages over generic rfc7807 detail", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      type: "https://seedgrid.com.br/dados-invalidos",
      title: "Dados invalidos",
      status: 400,
      detail: "Revise os campos informados.",
      devMessage:
        "create.dto.name: Nome da role deve ter entre 5 e 30 caracteres alfanuméricos maiúsculos e _",
      instance: "/roles",
      violations: [
        {
          field: "create.dto.name",
          message:
            "Nome da role deve ter entre 5 e 30 caracteres alfanuméricos maiúsculos e _",
        },
      ],
    });

    expect(extractApiMessage(error)).toBe(
      "Nome da role deve ter entre 5 e 30 caracteres alfanuméricos maiúsculos e _"
    );
  });

  it("returns the rfc7807 detail when the response has no violations", () => {
    const error = new ApiClientError("API request failed with status 401", 401, {
      type: "https://seedgrid.com.br/autenticacao-negada",
      title: "Autenticacao negada",
      status: 401,
      detail: "Usuario ou senha invalido",
      devMessage: "",
      instance: "/public/auth/login",
    });

    expect(extractApiMessage(error)).toBe("Usuario ou senha invalido");
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
        instance: "/public/auth/login",
        violations: [
          {
            field: "login.loginDTO.login",
            message: "Login e obrigatorio",
          },
          {
            field: "login.loginDTO.password",
            message: "Senha e obrigatoria",
          },
        ],
      })
    );

    expect(extractApiMessage(error)).toBe("Login e obrigatorio");
  });

  it("reads violation messages from api-client-like errors even without instanceof", () => {
    const error = {
      message: "API request failed with status 400",
      status: 400,
      responseBody: {
        type: "https://seedgrid.com.br/dados-invalidos",
        title: "Dados invalidos",
        status: 400,
        detail: "Revise os campos informados.",
        devMessage:
          "create.dto.name: Nome da role deve conter apenas letras maiusculas e _",
        instance: "/roles",
        violations: [
          {
            field: "create.dto.name",
            message:
              "Nome da role deve conter apenas letras maiusculas e _",
          },
        ],
      },
    };

    expect(extractApiMessage(error)).toBe(
      "Nome da role deve conter apenas letras maiusculas e _"
    );
  });

  it("reads violation messages from wrapped api errors", () => {
    const error = {
      message: "API request failed with status 400",
      cause: {
        responseBody: JSON.stringify({
          type: "https://seedgrid.com.br/dados-invalidos",
          title: "Dados invalidos",
          status: 400,
          detail: "Revise os campos informados.",
          instance: "/roles",
          violations: [
            {
              field: "create.dto.name",
              message: "Nome da role deve conter apenas letras maiusculas e _",
            },
          ],
        }),
      },
    };

    expect(extractApiMessage(error)).toBe(
      "Nome da role deve conter apenas letras maiusculas e _"
    );
  });

  it("falls back to the api client message when the response has no readable details", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      status: 400,
    });

    expect(extractApiMessage(error)).toBe("API request failed with status 400");
  });

  it("maps fetch failures to a friendly server connection message", () => {
    expect(extractApiMessage(new Error("fetch failed"))).toBe(
      "Erro ao conectar ao servidor"
    );
  });

  it("reproduces the role creation error scenario from issue", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      type: "https://seedgrid.com.br/dados-invalidos",
      title: "Dados invalidos",
      status: 400,
      detail: "Revise os campos informados.",
      devMessage:
        "create.dto.name: Nome da role deve ter entre 5 e 30 caracteres alfanuméricos maiúsculos e _",
      instance: "http://crm.seedgrid.com.br:8085/roles",
      violations: [
        {
          field: "create.dto.name",
          message:
            "Nome da role deve ter entre 5 e 30 caracteres alfanuméricos maiúsculos e _",
        },
      ],
    });

    expect(extractApiMessage(error)).toBe(
      "Nome da role deve ter entre 5 e 30 caracteres alfanuméricos maiúsculos e _"
    );
  });
});
