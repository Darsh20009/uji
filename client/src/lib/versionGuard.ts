declare const __UJI_APP_VERSION__: string;

const APP_VERSION = __UJI_APP_VERSION__;
const VERSION_COOKIE = "uji_app_version";
const VERSION_STORAGE_KEY = "uji_app_version";

function getCookie(name: string): string | null {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

function setVersionCookie() {
  document.cookie = [
    `${VERSION_COOKIE}=${encodeURIComponent(APP_VERSION)}`,
    "Max-Age=31536000",
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

function clearBrowserCookies() {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";

  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (name) {
      document.cookie = `${name}=; expires=${expires}; Max-Age=0; Path=/`;
    }
  }
}

function readStoredVersion(): string | null {
  try {
    return localStorage.getItem(VERSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredVersion() {
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
  } catch {
    // Storage can be disabled by privacy settings; the cookie still works.
  }
}

function clearBrowserStorage() {
  try {
    localStorage.clear();
  } catch {
    // Ignore disabled storage and continue with cookies/cache cleanup.
  }

  try {
    sessionStorage.clear();
  } catch {
    // Ignore disabled storage and continue with cookies/cache cleanup.
  }
}

async function clearServiceWorkerState() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }
}

/**
 * Returns true when the app can render. On a version mismatch it clears
 * browser state, refreshes the service worker, and reloads once.
 */
export async function ensureCurrentAppVersion(): Promise<boolean> {
  const previousCookieVersion = getCookie(VERSION_COOKIE);
  const previousStorageVersion = readStoredVersion();
  const hasOldState = [previousCookieVersion, previousStorageVersion].some(
    (version) => version !== null && version !== APP_VERSION,
  );

  if (hasOldState) {
    clearBrowserCookies();
    clearBrowserStorage();
    setVersionCookie();
    writeStoredVersion();
    await clearServiceWorkerState().catch(() => {});
    window.location.reload();
    return false;
  }

  setVersionCookie();
  writeStoredVersion();
  return true;
}