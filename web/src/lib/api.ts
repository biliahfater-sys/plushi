import type { CartItemRef, CheckoutPayload, Order, Product } from "./types";

const BASE = "/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const { method = "GET", body, signal } = opts;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Не удалось связаться с сервером", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error ?? "Ошибка запроса",
      res.status,
      (data as { details?: unknown }).details,
    );
  }
  return data as T;
}

export const api = {
  getProducts: () => request<{ items: Product[] }>("/products"),
  previewCart: (items: CartItemRef[]) =>
    request<Order>("/cart/preview", { method: "POST", body: { items } }),
  checkout: (payload: CheckoutPayload) =>
    request<{ ok: boolean; message: string; order: Order }>("/cart/checkout", {
      method: "POST",
      body: payload,
    }),
  subscribe: (email: string, consent: boolean) =>
    request<{ ok: boolean; message?: string }>("/subscribe", {
      method: "POST",
      body: { email, consent },
    }),
};
