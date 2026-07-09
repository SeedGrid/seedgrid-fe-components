import { type NextRequest, NextResponse } from "next/server";

const CITIES_API_BASE_URL = "https://cities.seedgrid.com.br";

type StateOption = {
  id: string;
  label: string;
  value: string;
  data: {
    stateId: string;
  };
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim().toLowerCase() ?? "";
  const apiUsername = process.env.SEEDGRID_CITIES_API_USERNAME?.trim();
  const apiKey = process.env.SEEDGRID_CITIES_API_KEY?.trim();
  const authorizationHeader = apiUsername && apiKey
    ? `Basic ${Buffer.from(`${apiUsername}:${apiKey}`).toString("base64")}`
    : "";

  if (!authorizationHeader) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const upstream = await fetch(`${CITIES_API_BASE_URL}/states?countryId=1`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: authorizationHeader,
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json([], { status: upstream.status });
    }

    const payload = await upstream.json();
    const options = normalizeStateOptions(payload).filter((item) => {
      if (!query) {
        return true;
      }

      return `${item.value} ${item.label}`.toLowerCase().includes(query);
    });

    return NextResponse.json(options, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

function normalizeStateOptions(payload: unknown): StateOption[] {
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(readProperty(payload, "data"))
      ? (readProperty(payload, "data") as unknown[])
      : [];

  return records
    .map((record) => {
      const stateId = readNumber(record, "id");
      const stateCode =
        readString(record, "uf") ??
        readString(record, "code") ??
        readString(record, "abbreviation") ??
        readString(record, "sigla");
      const stateName =
        readString(record, "name") ??
        readString(record, "nome") ??
        readString(record, "label") ??
        readString(record, "descricao");

      if (!stateId || !stateCode || !stateName) {
        return null;
      }

      return {
        id: stateId,
        label: `${stateCode} - ${stateName}`,
        value: stateCode,
        data: {
          stateId,
        },
      } satisfies StateOption;
    })
    .filter((item): item is StateOption => item !== null);
}

function readProperty(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return Reflect.get(value, key);
}

function readString(value: unknown, key: string) {
  const candidate = readProperty(value, key);

  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : null;
}

function readNumber(value: unknown, key: string) {
  const candidate = readProperty(value, key);

  if (typeof candidate === "number" && Number.isFinite(candidate)) {
    return String(candidate);
  }

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim();
  }

  return null;
}
