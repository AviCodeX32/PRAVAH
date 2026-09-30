/**
 * PRAVAH API Configuration & Endpoint Resolver
 * Automatically resolves between local development and production backend (e.g. Render).
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  ''
).replace(/\/+$/, '');

/**
 * Checks if running on a deployed domain (like Vercel) without a configured backend URL.
 */
export const isMissingProductionBackend = () => {
  if (typeof window === 'undefined') return false;
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  return !isLocal && !API_BASE_URL;
};

/**
 * Resolves a full API URL.
 * In development without VITE_API_URL, returns the relative path (proxied by Vite).
 * In production or when VITE_API_URL is configured, prepends the backend base URL.
 *
 * @param {string} path - e.g. '/api/auth/register'
 * @returns {string} - Full URL or relative path
 */
export function apiUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return cleanPath;
  }
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Gentle warm-up ping for free-tier cloud instances (e.g., Render spin-down).
 * Call this early on initial app load so the container starts waking up.
 */
export async function pingBackendWarmup() {
  try {
    const url = apiUrl('/api/health');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    // Non-blocking background warm-up
    return false;
  }
}
