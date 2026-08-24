"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Plus, UtensilsCrossed, Pencil, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DigitalMenuRepositoryImpl from "@/data/repositories/DigitalMenuRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData, isActionSuccess, getActionMessage } from "@/utils/apiResponse";
import { getDefaultKuarLogo, getMenuLogoUrl } from "@/lib/menuImage";
import { cn } from "@/lib/cn";
import type { DigitalMenu } from "@/types";

export default function MenusPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, theme } = useAppSelector((s) => s.user);

  const [menus, setMenus] = useState<DigitalMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DigitalMenu | null>(null);
  const [deleting, setDeleting] = useState(false);

  const defaultLogo = getDefaultKuarLogo(theme);

  const fetchMenus = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new DigitalMenuRepositoryImpl(translations, accessToken);
      const response = await repo.getAllDigitalMenusByBusiness(businessId);
      const data = getResponseData<DigitalMenu[]>(response);
      setMenus(Array.isArray(data) ? data : []);
    } catch {
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleDelete = async () => {
    if (!deleteTarget || !accessToken) return;
    setDeleting(true);
    try {
      const repo = new DigitalMenuRepositoryImpl(translations, accessToken);
      const result = await repo.deleteDigitalMenu(deleteTarget.id);
      if (isActionSuccess(result)) {
        toast.success(getActionMessage(result, translations.menuDeleted));
        setDeleteTarget(null);
        fetchMenus();
      } else {
        toast.error(getActionMessage(result, translations.error));
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{translations.digitalMenu}</h1>
        <Button asChild>
          <Link href={`/business/${businessId}/menus/create`}>
            <Plus />
            {translations.createMenu}
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : menus.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noDigitalMenus}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => {
            const menuLogoUrl = getMenuLogoUrl(menu);
            const imageSrc = menuLogoUrl || defaultLogo;

            return (
              <Card
                key={menu.id}
                className="overflow-hidden border-border/80 shadow-card transition-colors hover:border-primary/30"
              >
                <Link
                  href={`/business/${businessId}/menus/${menu.id}/edit`}
                  className="block transition-colors hover:bg-muted/20"
                >
                  <div className="relative h-44 w-full bg-muted">
                    <Image
                      src={imageSrc}
                      alt={menu.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={
                        menuLogoUrl
                          ? "object-cover"
                          : "object-contain p-8"
                      }
                      unoptimized={!!menuLogoUrl}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <p className="truncate font-semibold">{menu.name}</p>
                    <ChevronRight className="size-5 shrink-0 text-muted-foreground opacity-80" />
                  </div>
                </Link>
                <div className="flex border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto flex-1 rounded-none py-3 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                    )}
                    asChild
                  >
                    <Link href={`/business/${businessId}/menus/${menu.id}/edit`}>
                      <Pencil className="size-4" />
                      {translations.tableCardEdit}
                    </Link>
                  </Button>
                  <div className="w-px bg-border" aria-hidden />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto flex-1 rounded-none py-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    )}
                    onClick={() => setDeleteTarget(menu)}
                  >
                    <Trash2 className="size-4" />
                    {translations.tableCardDelete}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.confirmationDeleteMenuMessage}
            </DialogTitle>
            <DialogDescription>{deleteTarget?.name}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {translations.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={deleting}>
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
