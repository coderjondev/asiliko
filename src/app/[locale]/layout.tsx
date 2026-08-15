import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { DirectionSync } from "@/components/direction-sync";

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { languages } from "@/components/app-popover/languages";

import { notFound } from "next/navigation";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  const baseUrl = "https://asiliko.vercel.app";

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: t("title"),
      template: `%s | Asiliko`,
    },

    description: t("description"),

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
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${baseUrl}/${locale}`]),
      ),
    },

    openGraph: {
      type: "website",
      locale,
      siteName: "Asiliko",
      url: `${baseUrl}/${locale}`,
      title: t("ogTitle"),
      description: t("ogDescription"),
    },

    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        {
          url: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
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
    verification: {
      google: "kbEoXtXgYrz5c5cza97qLYq72ZHJMv9w-kdvMDhoRkg",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
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

  const currentLanguage = languages.find((language) => language.id === locale);

  const dir = currentLanguage?.rtl ? "rtl" : "ltr";
  const isRtl = currentLanguage?.rtl ?? false;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        inter.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="h-dvh overflow-hidden">
        <NextIntlClientProvider>
          <DirectionSync />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delay={0}>
              <SidebarProvider className="h-dvh min-h-0">
                <AppSidebar />

                <SidebarInset
                  className={cn(
                    "min-h-0 min-w-0 flex-1",
                    "py-1",
                    "sm:py-2",
                    isRtl ? "pr-1 sm:pr-0 sm:pl-2" : "pl-1 sm:pl-0 sm:pr-2",
                  )}
                >
                  <section
                    className={cn(
                      "h-full min-h-0 min-w-0",
                      "overflow-hidden",
                      "bg-card",
                      "rounded-md sm:rounded-lg",
                      "border",
                      "shadow-sm",
                      "p-1 sm:p-2.5",
                    )}
                  >
                    {children}
                  </section>
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
