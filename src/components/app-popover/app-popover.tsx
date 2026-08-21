"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import UserInfo from "../user-info";
import LanguageMenu from "./language-menu";
import { useSidebar } from "../ui/sidebar";
import { useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUpRight,
  ChevronRight,
  CircleFadingArrowUp,
  HelpCircle,
  LogOut,
  Settings,
} from "@/icons/icon";

export function AppPopover() {
  const { state } = useSidebar();
  const t = useTranslations("sidebar.sidebarFooter");
  return (
    <Popover>
      <PopoverTrigger
        className={`${state === "collapsed" ? "p-0 rounded-full" : "h-12"} justify-start`}
        render={<UserInfo />}
      />
      <PopoverContent className="gap-0.5" side="top">
        <Button variant={"ghost"} className={"justify-between py-4.5"}>
          <p className="flex items-center gap-1">
            <Settings className="size-4" />
            {t("settings")}
          </p>
        </Button>
        <LanguageMenu />
        <Button variant={"ghost"} className={"justify-between py-4.5"}>
          <p className="flex items-center gap-1">
            <HelpCircle className="size-4" />
            {t("help")}
          </p>
          <ChevronRight className="size-4" />
        </Button>
        <Separator className={"my-1"} />
        <Button variant={"ghost"} className={"justify-between py-4.5"} disabled>
          <p className="flex items-center gap-1">
            <CircleFadingArrowUp className="size-4" />
            {t("upgradePlan")}
          </p>
          <ArrowUpRight className="size-4" />
        </Button>
        <Button variant={"ghost"} className={"justify-between py-4.5"}>
          <p className="flex items-center gap-1">
            <LogOut className="size-4" />
            {t("logOut")}
          </p>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
