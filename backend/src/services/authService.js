import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import {
  issueRefreshToken,
  revokeAllRefreshTokensForUser,
  revokeRefreshToken,
  rotateRefreshToken,
  signAccessToken,
} from "./tokenService.js";

// Used when the email does not exist. We still do a password check on this fake hash,
// so the answer takes the same time and nobody can find out which emails are registered.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("not-a-real-password-for-timing", 12);

async function startSession(user, meta) {
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id, meta);
  return { user: user.toJSON(), accessToken, refreshToken };
}

export async function register({ fullName, email, password }, meta) {
  const emailTaken = await User.exists({ email });
  if (emailTaken) {
    throw new ApiError(409, "Please check the highlighted field.", {
      fieldErrors: { email: "An account with this email already exists." },
      code: "EMAIL_TAKEN",
    });
  }

  // The User model hashes the password with bcrypt before it is saved
  const user = await User.create({ name: fullName, email, password });
  return startSession(user, { ...meta, rememberMe: false });
}

export async function login({ email, password, rememberMe }, meta) {
  const user = await User.findOne({ email }).select("+password");

  const passwordMatches = user
    ? await user.comparePassword(password)
    : await bcrypt.compare(password, DUMMY_PASSWORD_HASH);

  // Same message for "no such email" and "wrong password"
  if (!user || !passwordMatches) {
    throw new ApiError(401, "Email or password is incorrect.", { code: "INVALID_CREDENTIALS" });
  }
  if (user.status !== "active") {
    throw new ApiError(403, "This account is suspended. Please contact support.", {
      code: "ACCOUNT_SUSPENDED",
    });
  }

  return startSession(user, { ...meta, rememberMe });
}

export async function refreshSession(oldRefreshToken, meta) {
  const { userId, refreshToken } = await rotateRefreshToken(oldRefreshToken, meta);

  const user = await User.findById(userId);
  if (!user || user.status !== "active") {
    await revokeAllRefreshTokensForUser(userId);
    throw new ApiError(401, "Your session is not valid. Please log in again.", {
      code: "INVALID_REFRESH_TOKEN",
    });
  }

  return { user: user.toJSON(), accessToken: signAccessToken(user), refreshToken };
}

export async function logout(refreshToken) {
  await revokeRefreshToken(refreshToken);
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user || user.status !== "active") {
    throw new ApiError(401, "Your session is not valid. Please log in again.", {
      code: "INVALID_TOKEN",
    });
  }
  return user.toJSON();
}