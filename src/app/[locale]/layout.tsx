import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
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
      google: "UgXB6Yx7FfwHOj3O2z-nYdmBFa0WbjglMexWTg4RPCA",
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
            <TooltipProvider delay={0}>{children}</TooltipProvider>

            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
