import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

const BASE_URL = "https://asiliko.vercel.app";

const routes = [
  {
    path: "",
    changeFrequency: "daily" as const,
    priority: 1,
  },
  {
    path: "/images",
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    routes.map((route) => {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

      return {
        url: `${BASE_URL}${prefix}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      };
    }),
  );
}
