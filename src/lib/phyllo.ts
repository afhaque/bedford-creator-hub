const SANDBOX_BASE = "https://api.sandbox.getphyllo.com";
const PROD_BASE = "https://api.getphyllo.com";

export function getBaseUrl() {
  return process.env.PHYLLO_ENV === "production" ? PROD_BASE : SANDBOX_BASE;
}

export function getAuthHeader() {
  const key = process.env.PHYLLO_API_KEY || "";
  // Phyllo uses Basic auth with client_id:client_secret base64 encoded
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

export type Platform = {
  name: string;
  slug: string;
  icon: string;
  publishSupported: boolean;
  engagementSupported: boolean;
};

export const PLATFORMS: Platform[] = [
  { name: "YouTube", slug: "youtube", icon: "🎬", publishSupported: true, engagementSupported: true },
  { name: "Instagram", slug: "instagram", icon: "📸", publishSupported: true, engagementSupported: true },
  { name: "TikTok", slug: "tiktok", icon: "🎵", publishSupported: true, engagementSupported: true },
  { name: "Facebook", slug: "facebook", icon: "👤", publishSupported: false, engagementSupported: true },
  { name: "LinkedIn", slug: "linkedin", icon: "💼", publishSupported: false, engagementSupported: false },
  { name: "Substack", slug: "substack", icon: "📝", publishSupported: false, engagementSupported: true },
];
