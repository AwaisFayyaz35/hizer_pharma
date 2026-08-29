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
<<<<<<< HEAD
=======
  paymentScreenshot: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<UploadResult>("/upload/payment-screenshot", form);
  },
  qrCode: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<UploadResult>("/upload/qr-code", form);
  },
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
};
