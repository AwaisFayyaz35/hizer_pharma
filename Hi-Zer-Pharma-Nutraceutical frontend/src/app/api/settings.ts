import { api } from "./client";
import type { Settings } from "../types";

export interface UpdateSettingsPayload {
  bankName?: string;
  accountTitle?: string;
  accountNumber?: string;
  iban?: string;
  qrCodeImage?: { url: string; publicId: string };
  deliveryFee?: number;
}

export const settingsApi = {
  get: () => api.get<Settings>("/settings"),
  update: (payload: UpdateSettingsPayload) => api.put<Settings>("/settings", payload),
};
