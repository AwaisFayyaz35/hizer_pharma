import { api } from "./client";
import type { Product } from "../types";

export interface ProductListParams {
  search?: string;
  category?: string;
  featured?: boolean;
  sort?: "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;
}

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

function toQuery(params: object) {
  const q = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const productsApi = {
  list: (params: ProductListParams = {}) =>
    api.get<ProductListResult>(`/products${toQuery(params)}`),
  get: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<Product>("/products", data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  remove: (id: string) => api.delete<null>(`/products/${id}`),
};
