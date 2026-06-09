"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const PLATFORMS = [
  { name: "YouTube", icon: "🎬", slug: "youtube", supported: true, mediaType: "Video" },
  { name: "Instagram", icon: "📸", slug: "instagram", supported: true, mediaType: "Image/Reel" },
  { name: "TikTok", icon: "🎵", slug: "tiktok", supported: true, mediaType: "Video" },
  { name: "Facebook", icon: "👤", slug: "facebook", supported: false, mediaType: "Post" },
  { name: "LinkedIn", icon: "💼", slug: "linkedin", supported: false, mediaType: "Post" },
  { name: "Substack", icon: "📝", slug: "substack", supported: false, mediaType: "Article" },
];

export default function PublishPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function togglePlatform(slug: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]
    );
  }

  async function handlePublish() {
    if (!title.trim() || !body.trim() || selectedPlatforms.length === 0) return;
    setPublishing(true);
    setResult(null);

    try {
      const res = await fetch("/api/phyllo/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, platforms: selectedPlatforms }),
      });
      const data = await res.json();

      if (data.success) {
        setResult(`Published to ${selectedPlatforms.length} platform(s) successfully.`);
        setTitle("");
        setBody("");
        setSelectedPlatforms([]);
      } else {
        setResult(`Error: ${data.error || "Failed to publish"}`);
      }
    } catch {
      setResult("Failed to publish. Check API configuration.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Create & Publish</h2>
        <p className="text-zinc-400 mt-1">
          Compose content and publish to your connected platforms via Phyllo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-white">Compose</CardTitle>
              <CardDescription className="text-zinc-400">
                Write your content once, publish everywhere
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Title</label>
                <Input
                  placeholder="Enter your post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Content</label>
                <Textarea
                  placeholder="Write your content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[200px]"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-zinc-500">
                  {selectedPlatforms.length} platform(s) selected
                </span>
                <Button
                  onClick={handlePublish}
                  disabled={publishing || !title.trim() || !body.trim() || selectedPlatforms.length === 0}
                >
                  {publishing ? "Publishing..." : "Publish Now"}
                </Button>
              </div>
              {result && (
                <p className={`text-sm ${result.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
                  {result}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-200">Publish To</h3>
          <div className="space-y-3">
            {PLATFORMS.map((platform) => (
              <Card
                key={platform.slug}
                className={`border-zinc-800 bg-zinc-900 cursor-pointer transition-all ${
                  platform.supported
                    ? selectedPlatforms.includes(platform.slug)
                      ? "border-white ring-1 ring-white"
                      : "hover:border-zinc-700"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => platform.supported && togglePlatform(platform.slug)}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{platform.icon}</span>
                      <div>
                        <p className="font-medium text-white text-sm">{platform.name}</p>
                        <p className="text-xs text-zinc-500">{platform.mediaType}</p>
                      </div>
                    </div>
                    {platform.supported ? (
                      selectedPlatforms.includes(platform.slug) ? (
                        <Badge className="bg-white text-zinc-900 text-xs">Selected</Badge>
                      ) : (
                        <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                          Available
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="border-amber-700 text-amber-400 text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-zinc-500">
                Publishing is handled by Phyllo&apos;s Publish API. Currently supports YouTube, Instagram,
                and TikTok. Facebook, LinkedIn, and Substack publishing is on Phyllo&apos;s roadmap.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
