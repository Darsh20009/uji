import type { Express, Request, Response } from "express";

export const APP_VERSION = process.env.APP_VERSION || "1.0.0";
const VERSION_COOKIE = "uji_app_version";

function readCookies(request: Request): Record<string, string> {
  const header = request.headers.cookie;
  if (!header) return {};

  return header.split(";").reduce<Record<string, string>>((cookies, part) => {
    const separator = part.indexOf("=");
    if (separator === -1) return cookies;

    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (name) {
      try {
        cookies[name] = decodeURIComponent(value);
      } catch {
        cookies[name] = value;
      }
    }
    return cookies;
  }, {});
}

function clearCookies(response: Response, cookieNames: string[]) {
  const secure = !!process.env.REPL_ID || process.env.NODE_ENV === "production";
  const sameSite = process.env.REPL_ID ? "none" : "lax";

  for (const name of cookieNames) {
    response.clearCookie(name, { path: "/", secure, sameSite });
  }
}

function setVersionCookie(response: Response) {
  const secure = !!process.env.REPL_ID || process.env.NODE_ENV === "production";
  const sameSite = process.env.REPL_ID ? "None" : "Lax";
  const secureFlag = secure ? "; Secure" : "";
  response.append(
    "Set-Cookie",
    `${VERSION_COOKIE}=${encodeURIComponent(APP_VERSION)}; Max-Age=31536000; Path=/; SameSite=${sameSite}${secureFlag}`,
  );
}

/**
 * Clears cookies from older app versions before express-session reads them.
 * The browser also runs the matching client-side guard so HttpOnly cookies
 * and server sessions are reset as well.
 */
export function setupVersionGuard(app: Express) {
  app.use((request, response, next) => {
    const cookies = readCookies(request);
    const storedVersion = cookies[VERSION_COOKIE];
    const hasLegacySession = !storedVersion && Object.keys(cookies).some((name) => name === "connect.sid");

    if ((storedVersion && storedVersion !== APP_VERSION) || hasLegacySession) {
      clearCookies(response, Object.keys(cookies));
      // Do not let express-session load a session that belongs to an older
      // release before the browser receives the deletion headers.
      request.headers.cookie = undefined;
      response.setHeader("X-UJI-Version-Reset", "1");
    }

    setVersionCookie(response);
    next();
  });
}