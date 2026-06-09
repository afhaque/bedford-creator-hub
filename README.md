# Bedford Creator Hub

A multi-platform creator analytics and publishing prototype built for **Bedford** — a training program for content creators. Powered by the **Phyllo API** for social account aggregation, engagement tracking, and content publishing.

**Built by Overclock Accelerator** as a demonstration of how Bedford can give students a unified dashboard for tracking their content performance across YouTube, Instagram, TikTok, Facebook, LinkedIn, and Substack.

## The Problem

Bedford trains content creators. Students post assignments across multiple social platforms. Bedford needs to:
- See how each student's content is performing across all platforms
- Let students connect their accounts securely (OAuth via Phyllo)
- Enable publishing from a single interface
- Provide research tools to discover relevant creators

## What This Prototype Does

| Tab | Feature | Phyllo Integration |
|-----|---------|-------------------|
| **Connect** | Link social accounts via Phyllo Connect SDK | `POST /v1/users` + SDK token |
| **Research** | Demo mode (mock data) + Live mode (real Phyllo profiles) | `GET /v1/profiles` |
| **Publish** | Compose and publish to connected platforms | `POST /v1/social/contents/publish` |
| **Analytics** | Cross-platform dashboard with platform/post drill-down | `GET /v1/social/contents` |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **API**: Phyllo (identity, engagement, publishing)
- **Auth**: Middleware-based password gate
- **Deployment**: Vercel

## Setup

### Prerequisites
- Node.js 18+
- A Phyllo API key (get one at [getphyllo.com](https://getphyllo.com))

### Install & Run

```bash
git clone https://github.com/afhaque/bedford-creator-hub.git
cd bedford-creator-hub
npm install
cp .env.example .env.local
# Edit .env.local with your Phyllo API key
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PHYLLO_API_KEY` | Your Phyllo API key | — |
| `PHYLLO_ENV` | `sandbox` or `production` | `sandbox` |
| `SITE_PASSWORD` | Password for demo access | `Overclock123!` |

### Phyllo Environments

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| Sandbox | `api.sandbox.getphyllo.com` | Development — mocked OAuth, no real data |
| Production | `api.getphyllo.com` | Live — real account connections and data |

## Architecture

```
Browser → Middleware (password check)
       → Next.js Pages (4 tabs)
       → API Routes (/api/phyllo/*) → Phyllo REST API
                                        ↓
                                   Server-side only
                                   (API key never exposed)
```

All Phyllo API calls are proxied through Next.js API routes. The Phyllo API key is stored as a server-side environment variable and never sent to the client.

## Phyllo Platform Coverage

| Platform | Identity | Engagement | Publish |
|----------|----------|------------|---------|
| YouTube | Supported | Supported | Supported |
| Instagram | Supported | Supported | Supported |
| TikTok | Supported | Supported | Supported |
| Facebook | Supported | Supported | Coming soon |
| LinkedIn | Supported | **Not available** | Coming soon |
| Substack | Supported | Supported | Coming soon |

**Note**: LinkedIn engagement data is not available in Phyllo's production API. See [context.md](./context.md) for the full platform assessment.

## Detailed Context

See [context.md](./context.md) for:
- Full Bedford use case background
- Phyllo API assessment and platform coverage matrix
- Engagement metrics available per platform
- Account model for 2,500 students
- Production build roadmap
