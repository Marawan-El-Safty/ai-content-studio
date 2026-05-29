import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AI Content Studio — Generate premium marketing copy",
  description:
    "Generate, refine, and organize high-converting marketing copy with AI. Ad copy, emails, landing pages, social posts and more.",
  keywords: ["AI copywriting", "marketing copy", "Gemini", "content generator"],
  authors: [{ name: "Marawan Elsafty" }],
  openGraph: {
    title: "AI Content Studio",
    description: "Generate premium marketing copy with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{ className: "font-sans" }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
