"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockInfluencers, mockCreatorDetails, trendingTopics } from "@/lib/mock-data";
import { getPlatformIcon } from "@/lib/platforms";
import { useMode } from "@/lib/mode-context";

type Influencer = (typeof mockInfluencers)[number];

export default function ResearchPage() {
  const { mode } = useMode();
  const isLive = mode === "live";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Influencer | null>(null);
  const [liveProfiles, setLiveProfiles] = useState<Influencer[]>([]);
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

  const fetchLiveProfiles = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (isLive) fetchLiveProfiles();
  }, [isLive, fetchLiveProfiles]);

  const displayData = isLive ? liveProfiles : filteredInfluencers;

  // Creator detail view
  if (selectedCreator) {
    const details = mockCreatorDetails[selectedCreator.id];
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCreator(null)}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          ← Back to research
        </button>

        {/* Creator header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 bg-zinc-800">
            <AvatarFallback className="bg-zinc-800 text-white text-lg">
              {selectedCreator.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{selectedCreator.name}</h2>
            <p className="text-zinc-400">
              {selectedCreator.platformIcon} {selectedCreator.handle} · {selectedCreator.platform}
            </p>
            <p className="text-sm text-zinc-500 mt-1">{selectedCreator.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedCreator.topics.map((t) => (
                <Badge key={t} variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">{t}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Followers" value={selectedCreator.followers.toLocaleString()} />
          <StatCard label="Avg Views" value={selectedCreator.avgViews.toLocaleString()} />
          <StatCard label="Engagement" value={`${selectedCreator.avgEngagement}%`} />
          <StatCard label="Posts/Week" value={String(details?.postsPerWeek || "—")} />
          <StatCard label="Growth" value={details?.growthRate || "—"} />
        </div>

        {details && (
          <>
            {/* Niche fit */}
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Niche Fit Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300">{details.nicheFit}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Audience demographics */}
              <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Audience Demographics</CardTitle>
                  <CardDescription className="text-zinc-500">Age distribution of followers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {details.audienceSplit.map((seg) => (
                      <div key={seg.label} className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 w-12">{seg.label}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${seg.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-400 w-10 text-right">{seg.pct}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content mix */}
              <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Content Mix</CardTitle>
                  <CardDescription className="text-zinc-500">Types of content posted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {details.contentMix.map((mix) => (
                      <div key={mix.type} className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 w-28 truncate">{mix.type}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${mix.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-400 w-10 text-right">{mix.pct}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Posting schedule</span>
                      <span className="text-zinc-300">{details.peakPostingTime}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Frequency</span>
                      <span className="text-zinc-300">{details.avgPostFrequency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top performing content */}
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Top Performing Content</CardTitle>
                <CardDescription className="text-zinc-500">
                  Highest engagement posts from this creator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.topContent.map((content, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{content.title}</p>
                        <p className="text-xs text-zinc-500">{new Date(content.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-6 text-right shrink-0 ml-4">
                        <div>
                          <p className="text-sm font-medium text-white">{content.views.toLocaleString()}</p>
                          <p className="text-xs text-zinc-500">views</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{content.likes.toLocaleString()}</p>
                          <p className="text-xs text-zinc-500">likes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="pt-6">
            <p className="text-xs text-zinc-500">
              Creator data sourced from Phyllo&apos;s Identity and Engagement APIs.
              In production, this pulls real-time metrics from <code className="text-zinc-400">GET /v1/profiles</code> and <code className="text-zinc-400">GET /v1/social/contents</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main research view
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Research Influencers</h2>
        <p className="text-zinc-400 mt-1">
          Discover creators posting about topics relevant to your assignments. Click any creator for a deep dive.
        </p>
      </div>

      {!isLive && (
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

      {isLive && (
        <Card className="border-blue-900/50 bg-blue-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-300">
              <strong>Live Mode</strong> — Showing real profile data from your connected Phyllo accounts.
              Connect more accounts in the Connect tab to see them here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Trending topics */}
      {!isLive && !searchQuery && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-200">Trending Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {trendingTopics.slice(0, 8).map((t) => (
              <Card
                key={t.topic}
                className="border-zinc-800 bg-zinc-900 hover:border-zinc-700 cursor-pointer transition-colors"
                onClick={() => setSearchQuery(t.topic.split(" ")[0].toLowerCase())}
              >
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm font-medium text-white">{t.topic}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-green-400 font-medium">{t.growth}</span>
                    <span className="text-xs text-zinc-500">{t.postsThisWeek.toLocaleString()} posts/wk</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {t.platforms.map((p) => (
                      <Badge key={p} variant="outline" className="border-zinc-700 text-zinc-400 text-[10px] px-1.5 py-0">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Creator list */}
      {liveLoading && isLive ? (
        <div className="text-center text-zinc-500 py-12">Loading live profiles from Phyllo...</div>
      ) : displayData.length === 0 ? (
        <div className="text-center text-zinc-500 py-12">
          {isLive
            ? "No connected accounts found. Connect accounts first."
            : "No creators match your search."}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-200">
            {searchQuery ? `Results for "${searchQuery}"` : "Creators"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayData.map((inf) => (
              <Card
                key={inf.id}
                className="border-zinc-800 bg-zinc-900 hover:border-zinc-700 cursor-pointer transition-colors"
                onClick={() => setSelectedCreator(inf)}
              >
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
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {inf.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {inf.topics.length > 2 && (
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 text-xs">
                          +{inf.topics.length - 2}
                        </Badge>
                      )}
                    </div>
                    {inf.avgViews > 0 && (
                      <span className="text-xs text-zinc-500">{inf.avgEngagement}% eng.</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardContent className="pt-4 pb-4">
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
