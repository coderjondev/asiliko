"use client";

import SidebarToggle from "./sidebar-toggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { AppPopover } from "./app-popover/app-popover";
import { Separator } from "@/components/ui/separator";
import { useLocale, useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import logo from "@/../public/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Images,
  MessageSquarePlus,
  MessagesSquare,
  Search,
} from "@/icons/icon";
import Image from "next/image";

export function AppSidebar() {
  const { state } = useSidebar();
  const t = useTranslations("sidebar");
  const locale = useLocale();

  const isRtl = ["ar"].includes(locale);

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      side={isRtl ? "right" : "left"}
    >
      <SidebarHeader className="flex-row items-center justify-between">
        {state === "expanded" && (
          <Link href={"/"}>
            <Image
              src={logo}
              alt="This is logo"
              className="w-9 h-9"
              loading="eager"
            />
          </Link>
        )}
        <div className="flex items-center gap-2">
          {state === "expanded" && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={t("search")}
                  >
                    <Search className="size-4.5" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>{t("search")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          <SidebarToggle className={"cursor-w-resize"} />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="flex flex-col min-h-0 overflow-hidden">
        <SidebarGroup className="shrink-0 flex flex-col gap-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href={"/"}>
                <SidebarMenuButton
                  tooltip={{
                    children: t("newChat"),
                    side: isRtl ? "left" : "right",
                  }}
                  className="rounded-lg px-2.5 h-10"
                >
                  <MessageSquarePlus className="size-4.5" />{" "}
                  {state === "expanded" && t("newChat")}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href={"/images"}>
                <SidebarMenuButton
                  tooltip={{
                    children: t("images"),
                    side: isRtl ? "left" : "right",
                  }}
                  className="rounded-lg px-2.5 h-10"
                >
                  {" "}
                  <Images className="size-4.5" />{" "}
                  {state === "expanded" && t("images")}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={{
                  children: t("chats"),
                  side: isRtl ? "left" : "right",
                }}
                className="rounded-lg px-2.5 h-9"
              >
                <MessagesSquare className="size-4.5" />{" "}
                {state === "expanded" && t("chats")}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {state === "expanded" && (
          <SidebarGroup className="min-h-0 flex-1 overflow-y-scroll custom-scrollbar"></SidebarGroup>
        )}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <AppPopover />
      </SidebarFooter>
    </Sidebar>
  );
}
