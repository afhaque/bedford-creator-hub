"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLATFORMS } from "@/lib/platforms";
import { useMode } from "@/lib/mode-context";

type Account = {
  id: string;
  platform: string;
  platformIcon: string;
  handle: string;
  status: string;
  followers: number;
};

const AVAILABLE_PLATFORMS = PLATFORMS.map((p) => ({ name: p.name, icon: p.icon, slug: p.slug }));

export default function ConnectPage() {
  const { mode } = useMode();
  const isLive = mode === "live";
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  const fetchAccounts = useCallback(async (live: boolean) => {
    setLoading(true);
    try {
      const url = live ? "/api/phyllo/accounts?mode=live" : "/api/phyllo/accounts";
      const res = await fetch(url);
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts(isLive);
  }, [fetchAccounts, isLive]);

  async function handleConnect(platformSlug: string) {
    setConnecting(platformSlug);
    try {
      const res = await fetch("/api/phyllo/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformSlug, mode: isLive ? "live" : "demo" }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`Connect failed (${res.status}): ${data.error || "Unknown error"}`);
        return;
      }

      if (data.sdkToken && data.userId) {
        alert(
          `Phyllo Connect SDK would open here.\n\nSDK Token: ${data.sdkToken.slice(0, 20)}...\nUser ID: ${data.userId}\n\nIn production, the Phyllo Connect widget handles the full OAuth flow for ${platformSlug}.`
        );
        await fetchAccounts(isLive);
      }
    } catch (err) {
      alert(`Failed to connect: ${err}`);
    } finally {
      setConnecting(null);
    }
  }

  const connectedSlugs = new Set(accounts.map((a) => a.platform?.toLowerCase()));
  const unconnected = AVAILABLE_PLATFORMS.filter((p) => !connectedSlugs.has(p.slug));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Connect Accounts</h2>
        <p className="text-zinc-400 mt-1">
          Link your social media accounts through Phyllo to enable analytics, publishing, and research.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Loading accounts...</div>
      ) : (
        <>
          {/* Connected accounts */}
          {accounts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-200">Connected Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account) => (
                  <Card key={account.id} className="border-zinc-800 bg-zinc-900">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{account.platformIcon}</span>
                          <div>
                            <p className="font-medium text-white">{account.platform}</p>
                            <p className="text-sm text-zinc-400">{account.handle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-green-700 text-green-400">
                            Connected
                          </Badge>
                          <p className="text-xs text-zinc-500 mt-1">
                            {account.followers?.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available platforms to connect */}
          {unconnected.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-200">Available Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unconnected.map((platform) => (
                  <Card key={platform.slug} className="border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <CardTitle className="text-white">{platform.name}</CardTitle>
                      </div>
                      <CardDescription className="text-zinc-400">
                        Connect your {platform.name} account to track performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleConnect(platform.slug)}
                        disabled={connecting === platform.slug}
                        className="w-full"
                        variant="outline"
                      >
                        {connecting === platform.slug ? "Connecting..." : `Connect ${platform.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-sm text-zinc-300 font-medium">Powered by Phyllo Connect SDK</p>
              <p className="text-sm text-zinc-500 mt-1">
                Account connections are handled securely through Phyllo&apos;s OAuth widget. Each student
                connects their own accounts — Bedford never sees their credentials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
