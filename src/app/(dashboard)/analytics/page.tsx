"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPosts } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

type Post = (typeof mockPosts)[number];

const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6", "#f59e0b", "#10b981", "#06b6d4"];

export default function AnalyticsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedPlatform) return mockPosts;
    return mockPosts.filter((p) => p.platform === selectedPlatform);
  }, [selectedPlatform]);

  const totals = useMemo(() => {
    const posts = filteredPosts;
    return {
      views: posts.reduce((s, p) => s + p.engagement.views, 0),
      likes: posts.reduce((s, p) => s + p.engagement.likes, 0),
      comments: posts.reduce((s, p) => s + p.engagement.comments, 0),
      shares: posts.reduce((s, p) => s + p.engagement.shares, 0),
      posts: posts.length,
    };
  }, [filteredPosts]);

  const platformBreakdown = useMemo(() => {
    const map = new Map<string, { platform: string; views: number; likes: number; posts: number }>();
    filteredPosts.forEach((p) => {
      const existing = map.get(p.platform) || { platform: p.platform, views: 0, likes: 0, posts: 0 };
      existing.views += p.engagement.views;
      existing.likes += p.engagement.likes;
      existing.posts += 1;
      map.set(p.platform, existing);
    });
    return Array.from(map.values());
  }, [filteredPosts]);

  const postBarData = useMemo(() => {
    return filteredPosts.map((p) => ({
      name: p.title.length > 25 ? p.title.slice(0, 25) + "..." : p.title,
      views: p.engagement.views,
      likes: p.engagement.likes,
      comments: p.engagement.comments,
      fullTitle: p.title,
      post: p,
    }));
  }, [filteredPosts]);

  const platforms = [...new Set(mockPosts.map((p) => p.platform))];

  if (selectedPost) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedPost(null)}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          ← Back to overview
        </button>

        <div>
          <h2 className="text-2xl font-bold text-white">{selectedPost.title}</h2>
          <p className="text-zinc-400 mt-1">
            {selectedPost.platformIcon} {selectedPost.platform} ·{" "}
            {new Date(selectedPost.publishedAt).toLocaleDateString()} · {selectedPost.type}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Views" value={selectedPost.engagement.views} />
          <MetricCard label="Likes" value={selectedPost.engagement.likes} />
          <MetricCard label="Comments" value={selectedPost.engagement.comments} />
          <MetricCard label="Shares" value={selectedPost.engagement.shares} />
        </div>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white text-base">Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { metric: "Views", value: selectedPost.engagement.views },
                    { metric: "Likes", value: selectedPost.engagement.likes },
                    { metric: "Comments", value: selectedPost.engagement.comments },
                    { metric: "Shares", value: selectedPost.engagement.shares },
                  ]}
                >
                  <XAxis dataKey="metric" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="pt-6">
            <p className="text-xs text-zinc-500">
              Data sourced from Phyllo&apos;s <code className="text-zinc-400">GET /v1/social/contents</code> endpoint.
              Metrics include view_count, like_count, comment_count, and share_count per content item.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics</h2>
          <p className="text-zinc-400 mt-1">
            Track content performance across all your connected platforms.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={selectedPlatform === null ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedPlatform === null
                ? "bg-white text-zinc-900"
                : "border-zinc-700 text-zinc-400 hover:text-white"
            }`}
            onClick={() => setSelectedPlatform(null)}
          >
            All Platforms
          </Badge>
          {platforms.map((p) => (
            <Badge
              key={p}
              variant={selectedPlatform === p ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedPlatform === p
                  ? "bg-white text-zinc-900"
                  : "border-zinc-700 text-zinc-400 hover:text-white"
              }`}
              onClick={() => setSelectedPlatform(p)}
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Total Views" value={totals.views} />
        <MetricCard label="Total Likes" value={totals.likes} />
        <MetricCard label="Total Comments" value={totals.comments} />
        <MetricCard label="Total Shares" value={totals.shares} />
        <MetricCard label="Posts" value={totals.posts} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white text-base">Views by Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postBarData} layout="vertical">
                  <XAxis type="number" stroke="#71717a" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={11} width={140} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value) => Number(value).toLocaleString()}
                  />
                  <Bar
                    dataKey="views"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    cursor="pointer"
                    onClick={(_data, index) => {
                      if (typeof index === "number" && postBarData[index]?.post) {
                        setSelectedPost(postBarData[index].post);
                      }
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {!selectedPlatform && (
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-white text-base">Views by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformBreakdown}
                      dataKey="views"
                      nameKey="platform"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={(props: any) => `${props.name || ""} ${((props.percent || 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {platformBreakdown.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                      formatter={(value) => Number(value).toLocaleString()}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Post list */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-200">All Posts</h3>
        <div className="space-y-2">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="border-zinc-800 bg-zinc-900 hover:border-zinc-700 cursor-pointer transition-colors"
              onClick={() => setSelectedPost(post)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg">{post.platformIcon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{post.title}</p>
                      <p className="text-xs text-zinc-500">
                        {post.platform} · {new Date(post.publishedAt).toLocaleDateString()} · {post.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-right shrink-0">
                    <div>
                      <p className="text-sm font-medium text-white">{post.engagement.views.toLocaleString()}</p>
                      <p className="text-xs text-zinc-500">views</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{post.engagement.likes.toLocaleString()}</p>
                      <p className="text-xs text-zinc-500">likes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{post.engagement.comments.toLocaleString()}</p>
                      <p className="text-xs text-zinc-500">comments</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardContent className="pt-4 pb-4">
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-xs text-zinc-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
