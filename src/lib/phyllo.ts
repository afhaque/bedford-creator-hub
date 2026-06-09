export { PLATFORMS, getPlatformIcon } from "./platforms";
export type { Platform } from "./platforms";

const SANDBOX_BASE = "https://api.sandbox.getphyllo.com";
const PROD_BASE = "https://api.getphyllo.com";

export function isSandbox() {
  return process.env.PHYLLO_ENV !== "production";
}

export function getBaseUrl() {
  return process.env.PHYLLO_ENV === "production" ? PROD_BASE : SANDBOX_BASE;
}

export function getAuthHeader() {
  const key = process.env.PHYLLO_API_KEY || "";
  return `Basic ${Buffer.from(key).toString("base64")}`;
}

export async function phylloFetch(path: string, options: RequestInit = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Phyllo API ${res.status}: ${text}`);
  }
  return res.json();
}
