import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { ApiError } from "../utils/ApiError.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const REMEMBER_ME_DAYS = 30;
const SESSION_DAYS = 1;

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// ---------- Access token: short-lived JWT, sent in the Authorization header ----------

export function signAccessToken(user) {
  return jwt.sign({ role: user.role }, env.jwtAccessSecret, {
    subject: user.id,
    expiresIn: env.accessTokenExpiresIn,
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret, { algorithms: ["HS256"] });
}

// ---------- Refresh token: random value kept in an httpOnly cookie, checked against the database ----------

export async function issueRefreshToken(userId, { rememberMe = false, userAgent, ip } = {}) {
  const token = crypto.randomBytes(48).toString("hex");
  const lifetimeMs = (rememberMe ? REMEMBER_ME_DAYS : SESSION_DAYS) * DAY_MS;
  const expiresAt = new Date(Date.now() + lifetimeMs);

  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(token),
    expiresAt,
    rememberMe,
    userAgent,
    ip,
  });

  return { token, expiresAt, rememberMe };
}

export async function revokeAllRefreshTokensForUser(userId) {
  await RefreshToken.updateMany({ user: userId, revokedAt: null }, { revokedAt: new Date() });
}

export async function revokeRefreshToken(token) {
  if (!token) return;
  await RefreshToken.updateOne(
    { tokenHash: hashToken(token), revokedAt: null },
    { revokedAt: new Date() },
  );
}

// Each refresh token works only once. Using it gives a brand new one and cancels the old one.
export async function rotateRefreshToken(oldToken, meta = {}) {
  if (!oldToken) {
    throw new ApiError(401, "Please log in again.", { code: "NO_REFRESH_TOKEN" });
  }

  const record = await RefreshToken.findOne({ tokenHash: hashToken(oldToken) });
  if (!record) {
    throw new ApiError(401, "Your session is not valid. Please log in again.", {
      code: "INVALID_REFRESH_TOKEN",
    });
  }

  // A token that was already used is being used again. It may have been stolen,
  // so every session of this user is cancelled.
  if (record.revokedAt) {
    await revokeAllRefreshTokensForUser(record.user);
    throw new ApiError(401, "Your session is no longer valid. Please log in again.", {
      code: "REFRESH_TOKEN_REUSED",
    });
  }

  if (record.expiresAt <= new Date()) {
    throw new ApiError(401, "Your session has expired. Please log in again.", {
      code: "REFRESH_TOKEN_EXPIRED",
    });
  }

  record.revokedAt = new Date();
  await record.save();

  const refreshToken = await issueRefreshToken(record.user, {
    rememberMe: record.rememberMe,
    ...meta,
  });
  return { userId: record.user, refreshToken };
}