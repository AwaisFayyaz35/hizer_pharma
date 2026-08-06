import { api } from "./client";

export interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadApi = {
  productImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<UploadResult>("/upload/product-image", form);
  },
  prescription: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<UploadResult>("/upload/prescription", form);
  },
};
