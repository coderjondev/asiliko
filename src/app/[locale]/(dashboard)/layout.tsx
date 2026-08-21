import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { cn } from "@/lib/utils";
import { languages } from "@/components/app-popover/languages";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const currentLanguage = languages.find((language) => language.id === locale);

  const isRtl = currentLanguage?.rtl ?? false;

  return (
    <SidebarProvider className="h-dvh min-h-0">
      <AppSidebar />

      <SidebarInset
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          "my-1.5",
          "sm:rounded-lg sm:bg-card sm:border sm:shadow-sm",
          isRtl ? "mr-1 sm:mr-0 sm:ml-2" : "ml-1 sm:ml-0 sm:mr-2",
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
