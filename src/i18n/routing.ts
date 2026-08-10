import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "en",
    "uz",
    "ru",
    "tr",
    "ar",
    "de",
    "fr",
    "es",
    "pt",
    "zh",
    "ja",
    "ko",
  ],

  defaultLocale: "en",

  localePrefix: "as-needed",

  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
