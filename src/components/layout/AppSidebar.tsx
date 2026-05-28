"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  CreditCard,
  Settings,
  Lightbulb,
  LogOut,
  Building2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { Logo } from "@/components/marketing/Logo";
import { useTranslation } from "@/hooks/useTranslation";

export type SidebarUserRole = "owner" | "employee";

export interface SidebarUser {
  name?: string;
  role?: SidebarUserRole;
  businessName?: string;
  businessId?: number;
  employeeRoleLabel?: string;
}

export interface AppSidebarProps {
  user?: SidebarUser;
  translations?: Record<string, string>;
  onLogout?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
  className?: string;
}

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  label?: string;
}

const OWNER_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "home", icon: Home },
  { href: "/profile", labelKey: "profile", icon: User },
  { href: "/subscription", labelKey: "subscription", icon: CreditCard },
  { href: "/settings", labelKey: "settings", icon: Settings },
  { href: "/suggestions", labelKey: "suggestions", icon: Lightbulb },
];

const EMPLOYEE_ITEMS: NavItem[] = [
  { href: "/settings", labelKey: "settings", icon: Settings },
];

export function AppSidebar({
  user,
  translations = {},
  onLogout,
  open = false,
  onOpenChange,
  collapsed = false,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isEmployee = user?.role === "employee";

  const items = React.useMemo<NavItem[]>(() => {
    if (!isEmployee) return OWNER_ITEMS;

    return [
      {
        href: user?.businessId ? `/business/${user.businessId}` : "/dashboard",
        labelKey: "business",
        label: user?.businessName || t("business"),
        icon: Building2,
      },
      ...EMPLOYEE_ITEMS,
    ];
  }, [isEmployee, user?.businessName, user?.businessId, t]);

  const getItemLabel = (item: NavItem) => item.label || t(item.labelKey);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => onOpenChange?.(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-label="Main navigation"
        aria-expanded={!collapsed}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-border/80 bg-card/90 shadow-card backdrop-blur-xl transition-[width,transform] duration-300 ease-out",
          collapsed ? "w-[17.5rem] lg:w-[4.5rem]" : "w-[17.5rem]",
          "lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div
          className={cn(
            "app-shell-header relative z-10 flex h-[4.25rem] shrink-0 items-center border-b",
            collapsed ? "justify-center px-2" : "px-5"
          )}
        >
          <Logo href="/dashboard" size={collapsed ? "sm" : "lg"} />
        </div>

        {isEmployee && user?.name && !collapsed && (
          <div className="relative border-b border-border/60 px-5 py-4">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            {user.employeeRoleLabel && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user.employeeRoleLabel}
              </p>
            )}
            {user.businessName && (
              <p className="mt-1 truncate text-xs font-medium text-primary/90">
                {user.businessName}
              </p>
            )}
          </div>
        )}

        <nav className="relative isolate flex-1 space-y-1 overflow-y-auto px-2 py-4 lg:px-3">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-primary/[0.04] to-transparent"
          />
          <div className="relative z-10 space-y-1">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {t("menu")}
              </p>
            )}
            {items.map((item) => {
              const Icon = item.icon;
              const label = getItemLabel(item);
              const active =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? label : undefined}
                  onClick={() => onOpenChange?.(false)}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? label : undefined}
                  className={cn(
                    "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                    active
                      ? "bg-primary-muted text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  {active && !collapsed && (
                    <span
                      className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                    )}
                  >
                    <Icon className="size-[1.125rem]" aria-hidden="true" />
                  </span>
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={cn("relative shrink-0 border-t border-border/60 p-2 lg:p-3")}>
          <button
            type="button"
            title={collapsed ? t("logout") : undefined}
            onClick={() => {
              onOpenChange?.(false);
              onLogout?.();
            }}
            className={cn(
              "flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
              "text-destructive hover:bg-destructive/10 active:scale-[0.98]"
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <LogOut className="size-[1.125rem]" aria-hidden="true" />
            </span>
            {!collapsed && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
