"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { endSession } from "@/presentation/state/userSlice";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

const SIDEBAR_COLLAPSED_KEY = "kuar-sidebar-collapsed";

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { name, isEmployee, employeeData, translations } = useAppSelector((s) => s.user);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleCollapsedChange = (value: boolean) => {
    setCollapsed(value);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(value));
    } catch {
      // ignore storage errors
    }
  };

  const handleLogout = async () => {
    await dispatch(endSession());
    router.push("/login");
  };

  const displayName = isEmployee ? employeeData?.name : name;

  const user = isEmployee
    ? {
        name: employeeData?.name,
        role: "employee" as const,
        businessName: employeeData?.businessName,
        businessId: employeeData?.businessId,
        employeeRoleLabel:
          {
            WAITER: translations.roleWaiter,
            CHEF: translations.roleChef,
            CASHIER: translations.roleCashier,
            MANAGER: translations.roleManager,
            OWNER: translations.roleOwner,
          }[employeeData?.role || ""] || employeeData?.role,
      }
    : { name, role: "owner" as const };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        user={user}
        translations={translations}
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        collapsed={collapsed}
        onLogout={handleLogout}
      />

      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 hero-mesh opacity-40" aria-hidden />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" aria-hidden />

        <AppHeader
          title={title}
          userName={displayName || undefined}
          sidebarCollapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
          onSidebarToggle={() => handleCollapsedChange(!collapsed)}
        />
        <main className="relative flex-1 px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
          <div className="animate-fade-up mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
