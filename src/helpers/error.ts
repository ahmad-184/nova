import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export class PublicError extends Error {
  code?: string = "ERROR";

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export function returnCustomApiError(
  err: unknown,
  status?: number,
  code?: string
) {
  const error = err as Error;
  return {
    error: {
      status: status ?? 500,
      statusText: error.name,
      data: error.message,
      ...(!!code && { code }),
    },
  };
}

type NormalizedError =
  | {
      status: number;
      message: string;
      code: string;
    }
  | undefined;

export function getErrorInfo(
  error: FetchBaseQueryError | SerializedError | undefined
): NormalizedError {
  if (!error) return undefined;

  if ("status" in error) {
    return {
      status: typeof error.status === "number" ? error.status : 500,
      message:
        typeof error.data === "string"
          ? error.data
          : (error.data as any)?.message || "Something went wrong",
      code: (error.data as any)?.code || "",
    };
  }

  return {
    status: 500,
    message: error.message || "An unknown error occurred",
    code: error.code || "",
  };
}
