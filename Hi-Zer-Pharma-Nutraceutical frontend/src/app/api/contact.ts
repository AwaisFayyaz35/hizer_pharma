import { api } from "./client";

export const contactApi = {
  send: (name: string, email: string, message: string) =>
    api.post<null>("/contact", { name, email, message }),
};
