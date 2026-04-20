import { getToken, getApiKey } from "../utils/storage";
import type { ApiErrorBody } from "../types";

const BASE = "https://v2.api.noroff.dev";

export class ApiError extends Error {
  public readonly status: number;
  public readonly errors: Array<{ message: string }>;

  constructor(status: number, errors?: Array<{ message: string }>) {
    super(errors?.[0]?.message ?? "API error");
    this.status = status;
    this.errors = errors ?? [];
    this.name = "ApiError";
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

async function parseResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  const apiKey = getApiKey();

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (apiKey) headers["X-Noroff-API-Key"] = apiKey;

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const errBody = data as ApiErrorBody | null;
    throw new ApiError(res.status, errBody?.errors);
  }

  return data as T;
}

type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export const api = {
  get<T>(endpoint: string, params?: QueryParams): Promise<T> {
    let url = endpoint;
    if (params) {
      const q = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      );
      if (q.toString()) url += "?" + q.toString();
    }
    return request<T>(url, { method: "GET" });
  },

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, { method: "POST", body });
  },

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, { method: "PUT", body });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: "DELETE" });
  },
};
