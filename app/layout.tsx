import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// Intentionally no next/font/google here — a system-font stack (defined in
// globals.css) renders identically everywhere this gets cloned and run,
// with zero external font fetch at build or request time.

export const metadata: Metadata = {
  title: "GenoRoot Hair & Scalp Intake",
  description: "A voice-and-tap intake copilot that fills your hair & scalp consultation form before you walk in.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximumScale lock — capping pinch-zoom is a well-known accessibility
  // anti-pattern (WCAG 1.4.4/1.4.10), and the one group most likely to need
  // to zoom past our base sizing is exactly who this app is built for.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#181a1c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", "font-sans")}>
      <body className="min-h-full flex flex-col">
        {/* Follows the device's own light/dark setting — most phones already
            switch to dark automatically in low light, or the patient has it
            on by choice; forcing light regardless was fighting that. */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider delay={200}>
            <ThemeToggle />
            {children}
            <Toaster position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
