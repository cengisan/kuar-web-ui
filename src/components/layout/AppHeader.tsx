"use client";

import { Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export function AppHeader({
  title,
  userName,
  sidebarCollapsed,
  onMenuClick,
  onSidebarToggle,
}: {
  title?: string;
  userName?: string;
  sidebarCollapsed?: boolean;
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <header className="app-shell-header sticky top-0 z-20 flex h-[4.25rem] items-center gap-4 border-b px-4 md:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="app-shell-header-button shrink-0 lg:hidden"
        onClick={onMenuClick}
        aria-label={t("openMenu")}
      >
        <Menu className="size-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="app-shell-header-button hidden shrink-0 lg:inline-flex"
        onClick={onSidebarToggle}
        aria-label={sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")}
      >
        {sidebarCollapsed ? (
          <PanelLeft className="size-5" />
        ) : (
          <PanelLeftClose className="size-5" />
        )}
      </Button>

      <div className="min-w-0 flex-1">
        {title ? (
          <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
        ) : userName ? (
          <>
            <p className="text-xs font-medium text-shell-header-muted">{t("welcome")}</p>
            <p className="truncate text-base font-semibold tracking-tight">{userName}</p>
          </>
        ) : null}
      </div>
    </header>
  );
}
