"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Plus, UtensilsCrossed, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { DigitalMenu } from "@/types";

export default function MenusPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken } = useAppSelector((s) => s.user);

  const [menus, setMenus] = useState<DigitalMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DigitalMenu | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    ><div className="flex items-center justify-between">
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
          {menus.map((menu) => (
            <Card key={menu.id} className="overflow-hidden">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
                      <UtensilsCrossed className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{menu.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(menu.images?.length || 0)} {translations.images}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link href={`/business/${businessId}/menus/${menu.id}/edit`}>
                      <Pencil />
                      {translations.edit}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteTarget(menu)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
