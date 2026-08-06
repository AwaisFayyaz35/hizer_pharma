import { api } from "./client";
import type { Customer, Order } from "../types";

export const customersApi = {
  list: () => api.get<Customer[]>("/customers"),
  get: (email: string) =>
    api.get<{ name: string; email: string; phone: string; orders: Order[]; spent: number }>(
      `/customers/${encodeURIComponent(email)}`
    ),
};
