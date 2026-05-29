import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "docs";
mkdirSync(OUT, { recursive: true });

const sampleDrafts = [
  {
    id: "s1",
    title: "A productivity app that turns meeting notes into tasks",
    body: "It's time to dominate your meeting notes.\n\nGame-changing by design and unstoppable where it counts. No fluff. No friction. Just results.\n\n👉 Start now",
    contentTypeId: "ad",
    tone: "Bold",
    brief: "A productivity app that turns meeting notes into tasks",
    createdAt: new Date().toISOString(),
    favorite: true,
  },
  {
    id: "s2",
    title: "Re-engage trial users who never upgraded",
    body: "Subject: Reliable results — without the busywork\n\nHi there,\n\nStreamline how your team handles trial conversions. Built for teams that value precision.\n\nGet started today →\n\nCheers,\nThe Team",
    contentTypeId: "email",
    tone: "Professional",
    brief: "Re-engage trial users who never upgraded",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    favorite: false,
  },
  {
    id: "s3",
    title: "Announce our new AI search feature",
    body: "Plot twist: finding anything in your workspace is now ridiculously easy. 🚀\n\nLess grind, more high-fives.\n\nThe best part? It's fun.\n\nLet's go 👇",
    contentTypeId: "social",
    tone: "Playful",
    brief: "Announce our new AI search feature",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    favorite: true,
  },
  {
    id: "s4",
    title: "A no-code tool for building internal dashboards",
    body: "Refined dashboards, finally simple.\n\nCrafted for those who appreciate the details.\n\n• Refined from day one\n• Elegant at any scale\n• Set up in minutes, not weeks\n\n[ Discover more ]",
    contentTypeId: "landing",
    tone: "Luxury",
    brief: "A no-code tool for building internal dashboards",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    favorite: false,
  },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await ctx.newPage();

// 1) Landing
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/landing.png` });
console.log("✓ landing.png");

// 2) Studio — generate copy
await page.goto(`${BASE}/studio`, { waitUntil: "networkidle" });
await page.fill(
  "#brief",
  "A productivity app that turns meeting notes into tasks",
);
await page.getByRole("button", { name: "Bold", exact: true }).click();
await page.getByRole("button", { name: /Generate copy/i }).click();
await page.getByText("Variation 1").first().waitFor({ timeout: 5000 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/studio.png` });
console.log("✓ studio.png");

// 3) Library — seed localStorage then reload
await page.addInitScript((drafts) => {
  localStorage.setItem("acs.library.v1", JSON.stringify(drafts));
}, sampleDrafts);
await page.goto(`${BASE}/library`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/library.png` });
console.log("✓ library.png");

await browser.close();
console.log("Done.");
