import { api } from "./client";
import type { ContactMessage } from "../types";

export const contactApi = {
  send: (name: string, email: string, message: string) =>
    api.post<null>("/contact", { name, email, message }),
  list: () => api.get<ContactMessage[]>("/contact"),
  remove: (id: string) => api.delete<null>(`/contact/${id}`),
};
