import { api } from "./client";
import type { Order, OrderStatus, ShippingAddress } from "../types";

export interface PlaceOrderPayload {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  prescriptionUrl?: string;
}

export interface OrderListParams {
  status?: string;
  search?: string;
}

function toQuery(params: object) {
  const q = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const ordersApi = {
  place: (payload: PlaceOrderPayload) => api.post<Order>("/orders", payload),
  track: (orderNumber: string, contact: string) =>
    api.get<Order>(`/orders/track${toQuery({ orderNumber, contact })}`),
  list: (params: OrderListParams = {}) => api.get<Order[]>(`/orders${toQuery(params)}`),
  get: (id: string) => api.get<Order>(`/orders/${id}`),
  updateStatus: (id: string, status: OrderStatus, note?: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status, note }),
};
