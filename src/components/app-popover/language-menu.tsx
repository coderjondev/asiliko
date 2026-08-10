"use client";

import { ChevronRight, Globe } from "@/icons/icon";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { languages } from "./languages";

const LanguageMenu = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const changeLanguage = (nextLocale: string) => {
    router.replace(
      // @ts-expect-error -- pathname
      { pathname, params },
      { locale: nextLocale },
    );
  };

  const currentLanguage = languages.find((lang) => lang.id === locale);

  const isRtl = ["ar"].includes(locale);

  const t = useTranslations("");

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant={"ghost"} className={"justify-between py-4.5"}>
            <p className="flex items-center gap-1">
              <Globe className="size-4.5" />
              {t("sidebar.sidebarFooter.language")}
            </p>
            <span className="flex items-center gap-1 text-muted-foreground">
              {currentLanguage?.flag} {currentLanguage?.nativeName}
              <ChevronRight className="size-4.5" />
            </span>
          </Button>
        }
      />
      <PopoverContent
        side={isRtl ? "left" : "right"}
        className={`absolute ${isRtl ? "right-5" : "left-5"} -bottom-10 max-h-70 w-50 gap-1 p-1 overflow-y-scroll custom-scrollbar`}
      >
        {languages.map((lang) => (
          <Button
            key={lang.id}
            variant={"ghost"}
            data-active={lang.id === locale}
            className={"justify-start gap-2 data-[active=true]:bg-accent"}
            onClick={() => changeLanguage(lang.id)}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            {t(`languages.${lang.id}`)}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default LanguageMenu;
