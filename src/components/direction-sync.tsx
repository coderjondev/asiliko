"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { languages } from "@/components/app-popover/languages";

export function DirectionSync() {
  const locale = useLocale();

  useEffect(() => {
    const currentLanguage = languages.find((lang) => lang.id === locale);
    const dir = currentLanguage?.rtl ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
