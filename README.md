# AI Content Studio

A tool for writing marketing copy quickly. You describe what you're promoting,
pick a format (ad, email, landing page, social post, blog intro, or pitch),
choose a tone and length, and it gives you a few variations to pick from. You can
save the ones you like to a library and copy them out.

It runs locally with no API keys or accounts, so it works straight away and
deploys for free. The text generation lives in one file (`src/lib/ai.ts`), so if
you ever want to plug in a real language model later, that's the only place you'd
change.

**Live:** https://ai-content-studio-navy-one.vercel.app

## Screenshots

![Landing](docs/landing.png)
![Studio](docs/studio.png)
![Library](docs/library.png)

## What's in it

- Six copy formats, each with its own writing style
- Tone (Professional, Friendly, Bold, Playful, Luxury, Technical) and length
- Generate up to three variations and compare them
- Save, favorite, and copy pieces from a library
- Dark mode, responsive, keyboard-friendly

## Built with

Next.js 14, TypeScript, and Tailwind CSS. Saved pieces use the browser's
localStorage by default; there's an optional Supabase schema in `supabase/` if
you want real accounts and cloud storage.

## Running it

```bash
npm install
npm run dev
```

No keys required.
