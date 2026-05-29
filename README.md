<div align="center">

# ✨ AI Content Studio

**Generate, refine, and organize premium marketing copy with Claude.**

A polished, production-ready AI writing tool built with Next.js 14, TypeScript,
Tailwind CSS, and the Anthropic Claude API.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Claude](https://img.shields.io/badge/Claude-API-d97757?logo=anthropic)

</div>

---

## 📸 Screenshots

> _Add screenshots / a GIF here after deploying — drop them in `public/` and
> reference them below. Suggested shots: landing hero, the Studio generating
> copy, and the content Library._

| Landing | Studio | Library |
| :-----: | :----: | :-----: |
| `docs/landing.png` | `docs/studio.png` | `docs/library.png` |

---

## 🚀 Overview

AI Content Studio turns a one-line product brief into high-converting marketing
copy across six formats — ad copy, emails, landing-page heroes, social posts,
blog intros, and pitches. Pick a tone and length, generate multiple variations,
and save the winners to your personal library.

It's built to feel like a premium SaaS product: clean design system, dark mode,
smooth micro-interactions, skeleton loaders, and thoughtful empty states.

## ✨ Features

- **Six tuned copy formats** — each uses format-specific prompt engineering.
- **Tone & length control** — Professional, Friendly, Bold, Playful, Luxury, Technical.
- **Multiple variations** — generate up to 3 options per request and compare.
- **Content library** — save, favorite, copy, and delete pieces.
- **Graceful demo mode** — runs with zero config; returns realistic mock copy
  until you add an API key, so the UI is always demoable.
- **Dark mode** — system-aware, persisted, no flash on load.
- **Type-safe end to end** — strict TypeScript, validated API route.
- **Accessible & responsive** — keyboard-friendly, mobile-first layout.

## 🛠️ Tech Stack

| Layer        | Tech                                                        |
| ------------ | ---------------------------------------------------------- |
| Framework    | [Next.js 14](https://nextjs.org/) (App Router, RSC)        |
| Language     | [TypeScript](https://www.typescriptlang.org/)             |
| Styling      | [Tailwind CSS](https://tailwindcss.com/) + CSS variables  |
| UI           | Custom shadcn-style components, [Lucide](https://lucide.dev/) icons |
| Animation    | [Framer Motion](https://www.framer.com/motion/)           |
| AI           | [Anthropic Claude](https://www.anthropic.com/) via official SDK |
| Persistence  | localStorage (default) · [Supabase](https://supabase.com/) (optional) |
| Toasts       | [Sonner](https://sonner.emilkowal.ski/)                   |

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx            # Landing page (animated hero, features, CTA)
│   ├── studio/             # Core generation experience
│   ├── library/            # Saved content, favorites, filters
│   ├── api/generate/       # Validated server route → Claude
│   ├── layout.tsx          # Theme provider + fonts + toaster
│   └── globals.css         # Design tokens (light/dark)
├── components/
│   ├── ui/                 # Reusable primitives (button, card, …)
│   ├── studio/             # Result card + skeleton
│   └── …                   # Navbar, theme toggle, reveal
├── hooks/
│   └── use-library.ts      # Persistence store (Supabase-ready shape)
└── lib/
    ├── claude.ts           # AI integration + demo fallback
    ├── content-types.ts    # Format definitions & prompt guidance
    ├── supabase.ts         # Browser client (null when unconfigured)
    └── utils.ts            # Helpers
```

**Design decisions worth noting**

- **Demo-first**: every integration degrades gracefully so the app never shows a
  broken screen — ideal for a portfolio link.
- **Separation of concerns**: prompt logic lives in `lib/`, UI never talks to the
  AI SDK directly — it goes through a validated `/api/generate` route.
- **Drop-in Supabase**: the library store shape matches `supabase/schema.sql`, so
  swapping localStorage for an authenticated cloud table is a contained change.

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/<your-username>/ai-content-studio.git
cd ai-content-studio
npm install
cp .env.example .env.local   # optional — app runs without keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

All optional — the app runs in demo mode without them.

| Variable                        | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `ANTHROPIC_API_KEY`             | Enables real AI generation               |
| `ANTHROPIC_MODEL`               | Override the Claude model (optional)      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Enables cloud library (optional)          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (optional)              |

## ☁️ Deployment

Deploy to [Vercel](https://vercel.com/) in two minutes:

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add `ANTHROPIC_API_KEY` (and Supabase keys if desired) in **Settings →
   Environment Variables**.
4. Deploy. ✅

For cloud persistence, create a Supabase project and run
[`supabase/schema.sql`](./supabase/schema.sql) in the SQL editor.

## 📜 Scripts

| Command             | Description                |
| ------------------- | -------------------------- |
| `npm run dev`       | Start dev server           |
| `npm run build`     | Production build           |
| `npm run start`     | Run the built app          |
| `npm run lint`      | Lint                       |
| `npm run typecheck` | Type-check without emitting |

## 📄 License

MIT — free to use, learn from, and build on.

---

<div align="center">
Built by <b>Marawan Elsafty</b> · Frontend & Fullstack Developer
</div>
