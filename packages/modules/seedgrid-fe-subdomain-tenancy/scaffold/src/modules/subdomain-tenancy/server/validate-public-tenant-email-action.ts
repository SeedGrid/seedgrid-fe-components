"use server";

// seedgrid:managed

import { getTranslator } from "@/i18n";
import { ApiClientError, createApiClient } from "@seedgrid/fe-core";
import { captureException, runGuarded } from "@/modules/core";

import { normalizeSubdomain, validateSubdomain } from "@seedgrid/fe-subdomain-tenancy";
import { resolvePublicApiBaseUrl } from "./public-api-base-url";

type ValidatePublicTenantEmailActionPayload = {
  subdomain: string;
  code: string;
};

type ValidatePublicTenantEmailActionResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
      status?: number;
    };

export async function validatePublicTenantEmailAction(
  payload: ValidatePublicTenantEmailActionPayload
): Promise<ValidatePublicTenantEmailActionResult> {
  return runGuarded(async () => {
    const t = getTranslator();
    const normalizedSubdomain = normalizeSubdomain(payload.subdomain);
    const subdomainValidation = validateSubdomain(normalizedSubdomain, t);

    if (subdomainValidation) {
      return {
        ok: false,
        message: subdomainValidation,
        status: 400,
      };
    }

    const normalizedCode = payload.code.replace(/\D/g, "").slice(0, 6);

    if (normalizedCode.length !== 6) {
      return {
        ok: false,
        message: t("multitenancy.signup.actions.validate.code_required"),
        status: 400,
      };
    }

    const client = createApiClient({
      baseUrl: await resolvePublicApiBaseUrl(),
      defaultCache: "no-store",
    });

    try {
      const response = await client.post<{ message?: string }>(
        "/public/tenants/validate-email",
        {
          body: {
            subdomain: normalizedSubdomain,
            code: normalizedCode,
          },
          requireAuth: false,
          retry: {
            attempts: 2,
            baseDelayMs: 350,
            retryOn: [429, 502, 503, 504],
          },
          cache: "no-store",
        }
      );

      return {
        ok: true,
        message:
          response.message?.trim() ||
          t("multitenancy.signup.actions.validate.success"),
      };
    } catch (error) {
      if (error instanceof ApiClientError) {
        return {
          ok: false,
          message: extractApiErrorMessage(error, t),
          status: error.status,
        };
      }

      await captureException(error, {
        area: "server",
        source: "multitenancy.validatePublicTenantEmailAction",
      });

      return {
        ok: false,
        message: t("multitenancy.signup.actions.validate.unavailable"),
      };
    }
  });
}

function extractApiErrorMessage(error: ApiClientError, t: ReturnType<typeof getTranslator>) {
  const body = error.responseBody;

  if (typeof body === "string" && body.trim()) {
    return body;
  }

  if (body && typeof body === "object") {
    const message =
      pickObjectString(body, "userMessage") ??
      pickObjectString(body, "message") ??
      pickObjectString(body, "error") ??
      pickObjectString(body, "detail");

    if (message) {
      return message;
    }
  }

  if (error.status === 404) {
    return t("multitenancy.signup.actions.validate.not_found");
  }

  if (error.status === 400) {
    return t("multitenancy.signup.actions.validate.invalid_code");
  }

  return t("multitenancy.signup.actions.validate.generic");
}

function pickObjectString(value: object, key: string) {
  const candidate = Reflect.get(value, key);
  return typeof candidate === "string" && candidate.trim() ? candidate : null;
}
