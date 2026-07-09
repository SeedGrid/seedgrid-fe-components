"use server";

// seedgrid:managed

import { getTranslator } from "@/i18n";
import { ApiClientError, createApiClient } from "@seedgrid/fe-core";
import { captureException, runGuarded } from "@/modules/core";

import {
  type CreatePublicTenantActionResult,
  type CreatePublicTenantPayload,
} from "../signup/types";
import { resolvePublicApiBaseUrl } from "./public-api-base-url";
import { normalizeSubdomain, validateSubdomain } from "@seedgrid/fe-subdomain-tenancy";

export async function createPublicTenantAction(
  payload: CreatePublicTenantPayload
): Promise<CreatePublicTenantActionResult> {
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

    const client = createApiClient({
      baseUrl: await resolvePublicApiBaseUrl(),
      defaultCache: "no-store",
    });

    try {
      await client.post("/public/tenants", {
        body: {
          ...payload,
          subdomain: normalizedSubdomain,
        },
        requireAuth: false,
        retry: {
          attempts: 2,
          baseDelayMs: 350,
          retryOn: [429, 502, 503, 504],
        },
        cache: "no-store",
      });

      return {
        ok: true,
        tenantSubdomain: normalizedSubdomain,
        rootEmail: payload.rootEmail,
        message: t("multitenancy.signup.actions.create.success"),
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
        source: "multitenancy.createPublicTenantAction",
      });

      return {
        ok: false,
        message: t("multitenancy.signup.actions.create.unavailable"),
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

  if (error.status === 409) {
    return t("multitenancy.signup.actions.create.conflict");
  }

  if (error.status === 400) {
    return t("multitenancy.signup.actions.create.invalid_payload");
  }

  return t("multitenancy.signup.actions.create.generic");
}

function pickObjectString(value: object, key: string) {
  const candidate = Reflect.get(value, key);
  return typeof candidate === "string" && candidate.trim() ? candidate : null;
}
