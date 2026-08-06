import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { AUTH_COOKIE_NAME } from "../utils/generateToken.js";
import User from "../models/User.js";

export const protect = asyncHandler(async function protect(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired session");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

export function authorize(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Not authorized to perform this action");
    }
    next();
  };
}
