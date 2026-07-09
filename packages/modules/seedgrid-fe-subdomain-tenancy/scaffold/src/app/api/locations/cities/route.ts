import { type NextRequest, NextResponse } from "next/server";

const CITIES_API_BASE_URL = "https://cities.seedgrid.com.br";

type CityOption = {
  id: string;
  label: string;
  value: string;
  data: {
    cityId: string;
    stateId: string;
  };
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim().toLowerCase() ?? "";
  const stateId = request.nextUrl.searchParams.get("stateId")?.trim() ?? "";
  const apiUsername = process.env.SEEDGRID_CITIES_API_USERNAME?.trim();
  const apiKey = process.env.SEEDGRID_CITIES_API_KEY?.trim();
  const authorizationHeader = apiUsername && apiKey
    ? `Basic ${Buffer.from(`${apiUsername}:${apiKey}`).toString("base64")}`
    : "";

  if (!authorizationHeader || !stateId) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const upstream = await fetch(
      `${CITIES_API_BASE_URL}/cities?stateId=${encodeURIComponent(stateId)}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: authorizationHeader,
        },
        cache: "no-store",
      }
    );

    if (!upstream.ok) {
      return NextResponse.json([], { status: upstream.status });
    }

    const payload = await upstream.json();
    const options = normalizeCityOptions(payload).filter((item) => {
      if (!query) {
        return true;
      }

      return item.label.toLowerCase().includes(query);
    });

    return NextResponse.json(options, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

function normalizeCityOptions(payload: unknown): CityOption[] {
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(readProperty(payload, "data"))
      ? (readProperty(payload, "data") as unknown[])
      : [];

  return records
    .map((record) => {
      const cityId = readNumber(record, "id");
      const stateId =
        readNumber(record, "stateId") ??
        readNumber(record, "estadoId") ??
        readNumber(record, "state_id");
      const cityName =
        readString(record, "name") ??
        readString(record, "nome") ??
        readString(record, "label") ??
        readString(record, "descricao");

      if (!cityId || !stateId || !cityName) {
        return null;
      }

      return {
        id: cityId,
        label: cityName,
        value: cityName,
        data: {
          cityId,
          stateId,
        },
      } satisfies CityOption;
    })
    .filter((item): item is CityOption => item !== null);
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
