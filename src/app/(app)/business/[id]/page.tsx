"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  UtensilsCrossed,
  Package,
  Users,
  LayoutGrid,
  ChefHat,
  CreditCard,
  BarChart3,
  Boxes,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FeatureCard } from "@/components/business/FeatureCard";
import BusinessRepositoryImpl from "@/data/repositories/BusinessRepositoryImpl";
import {
  fetchAvailableFeatures,
  hasPermissionAccess,
} from "@/utils/featureAccess";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Business } from "@/types";

interface FeatureItem {
  key: string;
  permission: string;
  title: string;
  icon: typeof Building2;
  color: string;
  href: string;
}

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const {
    translations,
    accessToken,
    subscriberId,
    is_trial_enable,
    isEmployee,
    employeeData,
  } = useAppSelector((s) => s.user);

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<string[] | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletionStage, setDeletionStage] = useState<"prompt" | "code">("prompt");
  const [deletionCode, setDeletionCode] = useState("");
  const [deletionLoading, setDeletionLoading] = useState(false);

  const featureItems: FeatureItem[] = useMemo(
    () => [
      {
        key: "digital_menu",
        permission: "DIGITAL_MENU",
        title: translations.digitalMenu,
        icon: UtensilsCrossed,
        color: "#f59e0b",
        href: `/business/${businessId}/menus`,
      },
      {
        key: "products",
        permission: "PRODUCTS",
        title: translations.products,
        icon: Package,
        color: "#10b981",
        href: `/business/${businessId}/products`,
      },
      {
        key: "employees",
        permission: "EMPLOYEES",
        title: translations.myEmployees,
        icon: Users,
        color: "#6366f1",
        href: `/business/${businessId}/employees`,
      },
      {
        key: "tables",
        permission: "TABLE_MANAGEMENT",
        title: translations.tableManagement,
        icon: LayoutGrid,
        color: "#06b6d4",
        href: `/business/${businessId}/areas`,
      },
      {
        key: "kitchen",
        permission: "KITCHEN_DISPLAY",
        title: translations.kitchenDisplay,
        icon: ChefHat,
        color: "#ef4444",
        href: `/business/${businessId}/kitchen`,
      },
      {
        key: "cashier",
        permission: "CASHIER",
        title: translations.cashier,
        icon: CreditCard,
        color: "#8b5cf6",
        href: `/business/${businessId}/cashier`,
      },
      {
        key: "stock",
        permission: "STOCK",
        title: translations.stockManagement,
        icon: Boxes,
        color: "#f97316",
        href: `/business/${businessId}/stock`,
      },
      {
        key: "dashboard",
        permission: "DASHBOARD",
        title: translations.dashboard,
        icon: BarChart3,
        color: "#3b82f6",
        href: `/business/${businessId}/dashboard`,
      },
      {
        key: "feedback",
        permission: "FEEDBACK",
        title: translations.customerFeedback,
        icon: MessageSquare,
        color: "#ec4899",
        href: `/business/${businessId}/feedback`,
      },
    ],
    [businessId, translations]
  );

  const loadBusiness = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new BusinessRepositoryImpl(translations, accessToken);
      const response = await repo.getBusinessById(businessId);
      if (
        response &&
        "meta" in response &&
        response.meta?.business_code === 0 &&
        response.data
      ) {
        setBusiness(response.data as Business);
        setEditName((response.data as Business).name || "");
        setEditDescription((response.data as Business).description || "");
      } else {
        toast.error(translations.businessNotFound);
        router.replace("/dashboard");
      }
    } catch {
      toast.error(translations.unexpectedErrorOccurred);
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, router, translations]);

  const loadFeatures = useCallback(async () => {
    if (isEmployee) {
      setFeatures(employeeData?.permissions || []);
      return;
    }
    if (!subscriberId || !accessToken) return;
    const result = await fetchAvailableFeatures({
      subscriberId,
      accessToken,
      translations,
      isTrialEnabled: is_trial_enable,
    });
    setFeatures(result);
  }, [accessToken, employeeData, isEmployee, is_trial_enable, subscriberId, translations]);

  useEffect(() => {
    loadBusiness();
    loadFeatures();
  }, [loadBusiness, loadFeatures]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !accessToken) return;
    setSavingEdit(true);
    try {
      const repo = new BusinessRepositoryImpl(translations, accessToken);
      const result = await repo.updateBusiness(businessId, {
        name: editName.trim(),
        description: editDescription.trim() || null,
      });
      if (result.success) {
        toast.success(result.message);
        setEditOpen(false);
        loadBusiness();
      } else {
        toast.error(result.message);
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const handleSendDeletionCode = async () => {
    if (!accessToken) return;
    setDeletionLoading(true);
    try {
      const repo = new BusinessRepositoryImpl(translations, accessToken);
      const result = await repo.sendBusinessDeletionCode(businessId);
      if (result.success) {
        toast.success(result.message);
        setDeletionStage("code");
      } else {
        toast.error(result.message);
      }
    } finally {
      setDeletionLoading(false);
    }
  };

  const handleConfirmDeletion = async () => {
    if (!accessToken || deletionCode.length !== 6) return;
    setDeletionLoading(true);
    try {
      const repo = new BusinessRepositoryImpl(translations, accessToken);
      const result = await repo.confirmBusinessDeletion(businessId, deletionCode);
      if (result.success) {
        toast.success(result.message);
        setDeleteOpen(false);
        router.replace("/dashboard");
      } else {
        toast.error(result.message);
      }
    } finally {
      setDeletionLoading(false);
    }
  };

  const handleFeatureClick = (item: FeatureItem, locked: boolean) => {
    if (locked) {
      toast.warning(translations.moduleRequired, {
        description:
          translations.purchaseModuleMessage,
      });
      return;
    }
    router.push(item.href);
  };

  if (loading) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: () => router.back() }}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (!business) return null;

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-8"
    ><Card className="overflow-hidden border-border/80 bg-card/90 shadow-card backdrop-blur-sm">
        <div className="h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-6">
          <div className="flex flex-row items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 ring-1 ring-primary/25 shadow-sm">
              <Building2 className="size-8 text-primary" />
            </div>
            <div className="min-w-0 pt-1">
              <CardTitle className="text-2xl font-bold tracking-tight">{business.name}</CardTitle>
              {business.description && (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {business.description}
                </p>
              )}
            </div>
          </div>
          {!isEmployee && (
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil />
                <span className="sr-only">{translations.edit}</span>
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  setDeletionStage("prompt");
                  setDeletionCode("");
                  setDeleteOpen(true);
                }}
              >
                <Trash2 />
                <span className="sr-only">{translations.delete}</span>
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Modüller
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featureItems.map((item) => {
          const hasAccess = hasPermissionAccess(features, item.permission, isEmployee);
          return (
            <FeatureCard
              key={item.key}
              icon={item.icon}
              title={item.title}
              color={item.color}
              locked={!hasAccess}
              onClick={() => handleFeatureClick(item, !hasAccess)}
            />
          );
        })}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.editBusinessTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{translations.businessName}</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">{translations.businessDescription}</Label>
              <Textarea
                id="edit-desc"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                {translations.cancel}
              </Button>
              <Button type="submit" loading={savingEdit}>
                {translations.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {translations.businessDeletionTitle}
            </DialogTitle>
            <DialogDescription>
              {translations.businessDeletionWarning}
            </DialogDescription>
          </DialogHeader>

          {deletionStage === "code" && (
            <div className="space-y-2">
              <Label htmlFor="del-code">
                {translations.businessDeletionCodeLabel}
              </Label>
              <Input
                id="del-code"
                value={deletionCode}
                onChange={(e) =>
                  setDeletionCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em]"
                inputMode="numeric"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {translations.cancel}
            </Button>
            {deletionStage === "prompt" ? (
              <Button
                variant="destructive"
                onClick={handleSendDeletionCode}
                loading={deletionLoading}
              >
                {translations.businessDeletionSendCode}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleConfirmDeletion}
                loading={deletionLoading}
                disabled={deletionCode.length !== 6}
              >
                {translations.businessDeletionConfirmDelete}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
