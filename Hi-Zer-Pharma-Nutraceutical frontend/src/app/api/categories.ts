import { api } from "./client";
import type { Category } from "../types";

export const categoriesApi = {
  list: () => api.get<Category[]>("/categories"),
  create: (data: { name: string; icon?: string }) => api.post<Category>("/categories", data),
  update: (id: string, data: { name?: string; icon?: string }) =>
    api.put<Category>(`/categories/${id}`, data),
  remove: (id: string) => api.delete<null>(`/categories/${id}`),
  addSubcategory: (id: string, name: string) =>
    api.post<Category>(`/categories/${id}/subcategories`, { name }),
  removeSubcategory: (id: string, name: string) =>
    api.delete<Category>(`/categories/${id}/subcategories/${encodeURIComponent(name)}`),
};
