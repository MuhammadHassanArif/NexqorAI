import * as authService from "../services/authService.js";
import { env } from "../config/env.js";

const REFRESH_COOKIE_NAME = "nexqor_refresh";

// httpOnly: JavaScript in the browser cannot read this cookie, so a script injected into the page cannot steal it.
// path: the browser sends it only to /api/auth/..., not to every request.
const baseCookieOptions = {
  httpOnly: true,
  secure: env.isProduction || env.cookieSameSite === "none",
  sameSite: env.cookieSameSite,
  path: "/api/auth",
};

function setRefreshCookie(res, { token, expiresAt, rememberMe }) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...baseCookieOptions,
    // "Keep me signed in" -> cookie survives closing the browser.
    // Otherwise it is a session cookie and disappears when the browser is closed.
    ...(rememberMe ? { expires: expiresAt } : {}),
  });
}

const getRequestMeta = (req) => ({ userAgent: req.get("user-agent"), ip: req.ip });

export async function register(req, res) {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body,
    getRequestMeta(req),
  );
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user, accessToken });
}

export async function login(req, res) {
  const { user, accessToken, refreshToken } = await authService.login(
    req.body,
    getRequestMeta(req),
  );
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
}

export async function refresh(req, res) {
  const { user, accessToken, refreshToken } = await authService.refreshSession(
    req.cookies[REFRESH_COOKIE_NAME],
    getRequestMeta(req),
  );
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
}

export async function logout(req, res) {
  await authService.logout(req.cookies[REFRESH_COOKIE_NAME]);
  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions);
  res.status(204).end();
}

export async function me(req, res) {
  const user = await authService.getCurrentUser(req.user.id);
  res.json({ user });
}