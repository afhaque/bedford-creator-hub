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

export function getPlatformIcon(name: string): string {
  const match = PLATFORMS.find(
    (p) => p.name.toLowerCase() === name.toLowerCase() || p.slug === name.toLowerCase()
  );
  return match?.icon || "🌐";
}
