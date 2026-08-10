import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { languages } from "@/components/app-popover/languages";
import { DirectionSync } from "@/components/direction-sync";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asiliko.vercel.app"),

  title: {
    default: "Asiliko – Next-Generation AI Assistant",
    template: "%s | Asiliko",
  },

  description:
    "Asiliko is a next-generation AI platform designed for intelligent conversations, coding, writing, research, translation, and productivity. Experience fast, secure, and powerful artificial intelligence in one place.",

  keywords: [
    "Asiliko",
    "AI",
    "AI Assistant",
    "Artificial Intelligence",
    "Chat AI",
    "ChatGPT Alternative",
    "Claude Alternative",
    "AI Chatbot",
    "Coding AI",
    "AI Writer",
    "Machine Learning",
    "LLM",
    "Productivity",
    "Next.js",
    "Open Source AI",
    "ai chat",
    "ai",
    "asiliko ai login",
    "asiliko website",
    "chat asiliko",
    "chat",
    "chatai",
    "asiliko chat",
    "asiliko login",
    "chat",
    "asiliko",
  ],

  authors: [{ name: "Asilbek Egamnazarov" }],
  creator: "Asilbek Egamnazarov",
  publisher: "Asiliko",
  applicationName: "Asiliko",
  category: "Technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Asiliko",
    url: "https://asiliko.vercel.app",
    title: "Asiliko – Next-Generation AI Assistant",
    description:
      "Your intelligent AI assistant for chatting, coding, writing, research, and productivity.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Asiliko – Next-Generation AI Assistant",
    description:
      "Powerful AI for coding, writing, research, and intelligent conversations.",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch.png",
        sizes: "180x180",
      },
    ],
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLanguage = languages.find((lang) => lang.id === locale);
  const dir = currentLanguage?.rtl ? "rtl" : "ltr";

  const contentClassName =
    "h-[calc(100dvh-16px)] rounded-lg lg:bg-card lg:border shadow-sm p-2.5";

  const isRtl = ["ar"].includes(locale);
  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <DirectionSync />
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {" "}
            <TooltipProvider delay={0}>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset className={`py-2 ${isRtl ? "pl-2" : "pr-2"}`}>
                  <section className={contentClassName}>{children}</section>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
