import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function expiresInToMs(expiresIn) {
  const match = /^(\d+)d$/.exec(expiresIn || "7d");
  const days = match ? Number(match[1]) : 7;
  return days * MS_PER_DAY;
}

export function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresInToMs(process.env.JWT_EXPIRES_IN),
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
