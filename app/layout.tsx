import type { Metadata } from "next";
import { Press_Start_2P, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNavbar } from "@/components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "WebPets",
    template: "%s | WebPets",
  },
  description:
    "Tiny, friendly web pets you can drop into any site. Pick a character, set the vibe, and let it roam your page.",
  openGraph: {
    title: "WebPets",
    description:
      "Tiny, friendly web pets you can drop into any site. Pick a character, set the vibe, and let it roam your page.",
    url: "/",
    siteName: "WebPets",
    images: [
      {
        url: "/meta.png",
        width: 1200,
        height: 630,
        alt: "WebPets social card",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebPets",
    description:
      "Tiny, friendly web pets you can drop into any site. Pick a character, set the vibe, and let it roam your page.",
    images: ["/meta.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `(() => {
  try {
    const key = "theme";
    const stored = localStorage.getItem(key);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = stored === "dark" || stored === "light"
      ? stored
      : prefersDark
        ? "dark"
        : "light";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  } catch {
  }
})();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        pixelFont.variable,
        "font-sans",
        figtree.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteNavbar />
          <main className="flex-1">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
