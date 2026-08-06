import { api } from "./client";
import type { AdminUser } from "../types";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AdminUser>("/auth/login", { email, password }),
  logout: () => api.post<null>("/auth/logout"),
  me: () => api.get<AdminUser>("/auth/me"),
  createAdmin: (name: string, email: string, password: string) =>
    api.post<AdminUser>("/auth/admins", { name, email, password }),
};
