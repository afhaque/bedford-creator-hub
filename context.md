# Bedford Creator Hub — Context Document

## What Is This?

This is a **prototype application** built by Overclock Accelerator to demonstrate a multi-platform creator analytics and publishing hub for **Bedford**, a training program for content creators.

Bedford trains students to create content across social media. Students complete assignments that involve posting to platforms like YouTube, Instagram, TikTok, LinkedIn, Facebook, and Substack. Bedford needs a way to:

1. **Track student performance** — aggregate views, likes, comments, and shares across all platforms into one dashboard
2. **Connect student accounts** — each student links their own social accounts securely via OAuth
3. **Enable content publishing** — students publish assignments directly from the platform to multiple channels
4. **Discover relevant creators** — find influencers in specific niches for research and inspiration

## Why Phyllo?

After evaluating Buffer (no analytics API), Ayrshare, and other aggregators, **Phyllo** emerged as the strongest API option because:

- **Multi-platform identity and engagement** in a single API
- **Connect SDK** handles OAuth flows per platform — Bedford never sees student credentials
- **Per-post engagement metrics** (views, likes, comments, shares) via REST + webhooks
- **Publishing API** for YouTube, Instagram, and TikTok

## Platform Coverage

| Platform | Identity | Engagement | Audience | Comments | Publish |
|----------|----------|------------|----------|----------|---------|
| YouTube | Supported | Supported | Supported | Supported | Supported |
| Instagram | Supported | Supported | Supported | Supported | Supported |
| TikTok | Supported | Supported | Supported | Not available | Supported |
| Facebook | Supported | Supported | Supported | Not available | Coming soon |
| LinkedIn | Supported | Not available | Not available | Not available | Coming soon |
| Substack | Supported | Supported | Not available | Not available | Coming soon |

### Key Gap: LinkedIn

LinkedIn has **Identity only** — no engagement data in Phyllo's production API. The Engagement table schema lists LinkedIn metrics (views, likes, comments, shares), but the Products table shows no Engagement product active for LinkedIn. If Bedford requires LinkedIn analytics, a direct LinkedIn API integration would be needed as a supplement.

## Engagement Metrics Available

| Metric | YouTube | Instagram | TikTok | Facebook | LinkedIn | Substack |
|--------|---------|-----------|--------|----------|----------|----------|
| view_count | Supported | Supported | Supported | Supported | Unverified | Not available |
| like_count | Supported | Supported | Supported | Supported | Unverified | Supported |
| comment_count | Supported | Supported | Supported | Supported | Unverified | Supported |
| share_count | Not available | Supported | Supported | Not available | Unverified | Not available |
| save_count | Not available | Supported | Supported | Not available | Not available | Not available |

## Architecture

- **Frontend**: Next.js 15, Tailwind CSS, shadcn/ui, Recharts
- **API Layer**: Next.js API routes proxying Phyllo calls (API key stays server-side)
- **Auth**: Middleware-based password gate (not user auth — this is a demo)
- **Phyllo Integration**: Connect SDK for account linking, REST API for engagement/profiles/publishing
- **Environment**: Sandbox mode by default, production toggle via `PHYLLO_ENV`

## Account Model for Bedford

```
Bedford (Phyllo API consumer)
├── Student A (Phyllo User)
│   ├── YouTube account (Phyllo Account)
│   ├── Instagram account (Phyllo Account)
│   └── TikTok account (Phyllo Account)
├── Student B (Phyllo User)
│   ├── LinkedIn account (Phyllo Account)
│   ├── Substack account (Phyllo Account)
│   └── Facebook account (Phyllo Account)
└── ... up to 2,500 accounts total
```

Each student is a Phyllo User. Each connected platform is a Phyllo Account. Bedford's plan includes 2,500 accounts/month — roughly 250 students with 10 accounts each.

## What This Prototype Demonstrates

1. **Connect Tab** — Phyllo Connect SDK integration for account linking
2. **Research Tab** — Demo mode with mock influencer data + Live mode showing real Phyllo profile data
3. **Publish Tab** — Multi-platform content creation with Coming Soon badges for unsupported platforms
4. **Analytics Tab** — Cross-platform performance dashboard with drill-down to platform and individual post level

## Next Steps (Production Build)

1. Sandbox validation — verify historical backfill behavior
2. Real student onboarding flow with Phyllo user-per-student model
3. Webhook integration for real-time content/engagement updates
4. Direct LinkedIn API integration to fill the engagement gap
5. Student management layer (cohorts, assignments, progress tracking)
6. Production deployment with proper auth (not just password gate)
