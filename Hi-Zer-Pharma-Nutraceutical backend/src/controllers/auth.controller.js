import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ok, created } from "../utils/apiResponse.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";

function sanitize(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export const login = asyncHandler(async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);
  setAuthCookie(res, token);
  ok(res, sanitize(user), "Logged in");
});

export const logout = asyncHandler(async function logout(req, res) {
  clearAuthCookie(res);
  ok(res, null, "Logged out");
});

export const me = asyncHandler(async function me(req, res) {
  ok(res, sanitize(req.user), "Current user");
});

export const createAdmin = asyncHandler(async function createAdmin(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email: email.toLowerCase(), password, role: "admin" });
  created(res, sanitize(user), "Admin account created");
});
