import Settings from "../models/Settings.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ok } from "../utils/apiResponse.js";

export const getSettings = asyncHandler(async function getSettings(req, res) {
  const settings = await Settings.getSingleton();
  ok(res, settings);
});

export const updateSettings = asyncHandler(async function updateSettings(req, res) {
  const { bankName, accountTitle, accountNumber, iban, qrCodeImage, deliveryFee } = req.body;

  const update = {};
  if (bankName !== undefined) update.bankName = String(bankName).trim();
  if (accountTitle !== undefined) update.accountTitle = String(accountTitle).trim();
  if (accountNumber !== undefined) update.accountNumber = String(accountNumber).trim();
  if (iban !== undefined) update.iban = String(iban).trim();
  if (qrCodeImage !== undefined) {
    if (!qrCodeImage?.url || !qrCodeImage?.publicId) {
      throw new ApiError(400, "qrCodeImage must include url and publicId");
    }
    update.qrCodeImage = { url: String(qrCodeImage.url), publicId: String(qrCodeImage.publicId) };
  }
  if (deliveryFee !== undefined) {
    const fee = Number(deliveryFee);
    if (!Number.isFinite(fee) || fee < 0) {
      throw new ApiError(400, "Delivery fee must be a non-negative number");
    }
    update.deliveryFee = fee;
  }

  const settings = await Settings.getSingleton();
  Object.assign(settings, update);
  await settings.save();

  ok(res, settings, "Settings updated");
});
