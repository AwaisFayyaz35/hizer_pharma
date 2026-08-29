import { api } from "./client";
<<<<<<< HEAD
=======
import type { ContactMessage } from "../types";
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

export const contactApi = {
  send: (name: string, email: string, message: string) =>
    api.post<null>("/contact", { name, email, message }),
<<<<<<< HEAD
=======
  list: () => api.get<ContactMessage[]>("/contact"),
  remove: (id: string) => api.delete<null>(`/contact/${id}`),
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
};
