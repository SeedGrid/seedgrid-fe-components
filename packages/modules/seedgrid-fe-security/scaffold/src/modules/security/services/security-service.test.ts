import { describe, expect, it } from "vitest";

import { ApiClientError } from "@/modules/core";

import {
  classifySelfEnterInvitationAdminError,
  classifySelfEnterInvitationError,
  isSelfEnterInvitationEmailMismatchError,
} from "./security-service";

describe("classifySelfEnterInvitationError", () => {
  it("classifies status 409 responses as consumed invitations", () => {
    const error = new ApiClientError("API request failed with status 409", 409, {
      detail: "Invitation already used.",
    });

    expect(classifySelfEnterInvitationError(error)).toBe("consumed");
  });

  it("classifies expired invitation messages as invalid", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      detail: "Convite expirado.",
    });

    expect(classifySelfEnterInvitationError(error)).toBe("invalid");
  });

  it("returns unknown when the backend error is not recognized", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      detail: "Unexpected validation failure.",
    });

    expect(classifySelfEnterInvitationError(error)).toBe("unknown");
  });
});

describe("isSelfEnterInvitationEmailMismatchError", () => {
  it("detects friendly email mismatch cases", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      detail: "O email nao corresponde ao convite.",
    });

    expect(isSelfEnterInvitationEmailMismatchError(error)).toBe(true);
  });

  it("ignores unrelated backend errors", () => {
    const error = new ApiClientError("API request failed with status 400", 400, {
      detail: "Senha obrigatoria.",
    });

    expect(isSelfEnterInvitationEmailMismatchError(error)).toBe(false);
  });
});

describe("classifySelfEnterInvitationAdminError", () => {
  it("classifies conflict responses as duplicate email problems", () => {
    const error = new ApiClientError("API request failed with status 409", 409, {
      detail: "An active entry request already exists for email: duplicate@test.com",
    });

    expect(classifySelfEnterInvitationAdminError(error)).toBe("duplicate_email");
  });

  it("returns unknown when the create-invitation error is not recognized", () => {
    const error = new ApiClientError("API request failed with status 422", 422, {
      detail: "Invitation cannot be resent.",
    });

    expect(classifySelfEnterInvitationAdminError(error)).toBe("unknown");
  });
});
