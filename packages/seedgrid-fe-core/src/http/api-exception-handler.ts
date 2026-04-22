// seedgrid:managed

export type ExceptionArea = "api" | "client" | "server";

export type ExceptionContext = {
  area?: ExceptionArea;
  source?: string;
  status?: number;
  retryable?: boolean;
  metadata?: Record<string, unknown>;
};

export type ExceptionReporter = (
  error: Error,
  context: ExceptionContext
) => void | Promise<void>;

const reporters = new Set<ExceptionReporter>();
const CAPTURED_ERROR_SYMBOL = Symbol.for("seedgrid.captured_exception");

export function suppressException(error: Error) {
  markAsCaptured(error);
}

export function registerExceptionReporter(reporter: ExceptionReporter) {
  reporters.add(reporter);

  return () => {
    reporters.delete(reporter);
  };
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error("Unknown application error");
}

export async function captureException(
  error: unknown,
  context: ExceptionContext = {}
) {
  const normalized = normalizeError(error);

  if (wasCaptured(normalized)) {
    return normalized;
  }

  markAsCaptured(normalized);

  console.error("[seedgrid]", normalized, context);

  for (const reporter of reporters) {
    try {
      await reporter(normalized, context);
    } catch (reporterError) {
      console.error("[seedgrid] reporter failed", reporterError);
    }
  }

  return normalized;
}

export async function runGuarded<T>(
  action: () => Promise<T> | T,
  context: ExceptionContext = {}
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    await captureException(error, context);
    throw error;
  }
}

function wasCaptured(error: Error) {
  return Boolean(
    (error as Error & { [CAPTURED_ERROR_SYMBOL]?: boolean })[
      CAPTURED_ERROR_SYMBOL
    ]
  );
}

function markAsCaptured(error: Error) {
  (
    error as Error & {
      [CAPTURED_ERROR_SYMBOL]?: boolean;
    }
  )[CAPTURED_ERROR_SYMBOL] = true;
}