"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockInfluencers } from "@/lib/mock-data";
import { getPlatformIcon } from "@/lib/platforms";

export default function ResearchPage() {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveProfiles, setLiveProfiles] = useState<typeof mockInfluencers>([]);
  const [liveLoading, setLiveLoading] = useState(false);

  const filteredInfluencers = useMemo(() => {
    if (!searchQuery.trim()) return mockInfluencers;
    const q = searchQuery.toLowerCase();
    return mockInfluencers.filter(
      (inf) =>
        inf.name.toLowerCase().includes(q) ||
        inf.topics.some((t) => t.toLowerCase().includes(q)) ||
        inf.platform.toLowerCase().includes(q) ||
        inf.bio.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  async function fetchLiveProfiles() {
    setLiveLoading(true);
    try {
      const res = await fetch("/api/phyllo/profiles");
      const data = await res.json();
      setLiveProfiles(
        (data.profiles || []).map((p: Record<string, unknown>) => ({
          id: p.id as string,
          name: (p.full_name as string) || (p.username as string) || "Unknown",
          platform: (p.platform as string) || "Unknown",
          platformIcon: getPlatformIcon((p.platform as string) || ""),
          handle: `@${p.username || "unknown"}`,
          followers: (p.follower_count as number) || 0,
          topics: [],
          avgViews: 0,
          avgEngagement: 0,
          avatarUrl: (p.image_url as string) || null,
          bio: (p.introduction as string) || "",
        }))
      );
    } catch {
      setLiveProfiles([]);
    } finally {
      setLiveLoading(false);
    }
  }

  function handleModeSwitch(live: boolean) {
    setIsLiveMode(live);
    if (live) fetchLiveProfiles();
  }

  const displayData = isLiveMode ? liveProfiles : filteredInfluencers;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Research Influencers</h2>
          <p className="text-zinc-400 mt-1">
            Discover creators posting about topics relevant to your assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${!isLiveMode ? "text-white font-medium" : "text-zinc-500"}`}>
            Demo
          </span>
          <Switch checked={isLiveMode} onCheckedChange={handleModeSwitch} />
          <span className={`text-sm ${isLiveMode ? "text-white font-medium" : "text-zinc-500"}`}>
            Live
          </span>
        </div>
      </div>

      {!isLiveMode && (
        <div className="relative">
          <Input
            placeholder="Search by topic, platform, or creator name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 pl-10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
        </div>
      )}

      {isLiveMode && (
        <Card className="border-blue-900/50 bg-blue-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-300">
              <strong>Live Mode</strong> — Showing real profile data from your connected Phyllo accounts.
              Connect more accounts in the Connect tab to see them here.
            </p>
          </CardContent>
        </Card>
      )}

      {liveLoading ? (
        <div className="text-center text-zinc-500 py-12">Loading live profiles from Phyllo...</div>
      ) : displayData.length === 0 ? (
        <div className="text-center text-zinc-500 py-12">
          {isLiveMode
            ? "No connected accounts found. Connect accounts first."
            : "No creators match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayData.map((inf) => (
            <Card key={inf.id} className="border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-zinc-800">
                    <AvatarFallback className="bg-zinc-800 text-white text-sm">
                      {inf.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-base">{inf.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {inf.platformIcon} {inf.handle} · {inf.followers.toLocaleString()} followers
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                    {inf.platform}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 mb-3">{inf.bio}</p>
                {inf.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {inf.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
                {inf.avgViews > 0 && (
                  <div className="flex gap-4 mt-3 text-xs text-zinc-500">
                    <span>Avg views: {inf.avgViews.toLocaleString()}</span>
                    <span>Engagement: {inf.avgEngagement}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

