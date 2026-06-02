"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { ChevronRight, Plus, LayoutGrid, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import TableRepositoryImpl from "@/data/repositories/TableRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import type { TableArea } from "@/types";
import { cn } from "@/lib/cn";

const AREA_EMOJI = "🚪";

function getAreaTableCount(area: TableArea) {
  return area.tableCount ?? area.table_count ?? 0;
}

export default function TableAreasPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken } = useAppSelector((s) => s.user);

  const [areas, setAreas] = useState<TableArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TableArea | null>(null);
  const [editingArea, setEditingArea] = useState<TableArea | null>(null);
  const [areaName, setAreaName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAreas = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new TableRepositoryImpl(translations, accessToken);
      const result = await repo.getAreasByBusiness(businessId);
      if (result.success) {
        setAreas(result.areas || []);
      } else {
        toast.error(result.message);
        setAreas([]);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const openCreate = () => {
    setEditingArea(null);
    setAreaName("");
    setDialogOpen(true);
  };

  const openEdit = (area: TableArea) => {
    setEditingArea(area);
    setAreaName(area.name);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!areaName.trim() || !accessToken) {
      toast.error(translations.pleaseFillAllFields);
      return;
    }
    setSaving(true);
    try {
      const repo = new TableRepositoryImpl(translations, accessToken);
      const result = editingArea
        ? await repo.updateArea(editingArea.id, { name: areaName.trim() })
        : await repo.createArea({ name: areaName.trim(), business_id: businessId });
      if (result.success) {
        toast.success(
          editingArea
            ? translations.areaUpdated
            : translations.areaCreated
        );
        setDialogOpen(false);
        fetchAreas();
      } else {
        toast.error(result.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !accessToken) return;
    setSaving(true);
    try {
      const repo = new TableRepositoryImpl(translations, accessToken);
      const result = await repo.deleteArea(deleteTarget.id);
      if (result.success) {
        toast.success(translations.areaDeleted);
        setDeleteTarget(null);
        fetchAreas();
      } else {
        toast.error(result.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {translations.tableManagement}
        </h1>
        <Button onClick={openCreate}>
          <Plus />
          {translations.addArea}
        </Button>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : areas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noAreasFound}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Card
              key={area.id}
              className="overflow-hidden border-border/80 shadow-card transition-colors hover:border-primary/30"
            >
              <Link
                href={`/business/${businessId}/areas/${area.id}/tables`}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/30"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xl"
                  aria-hidden
                >
                  {AREA_EMOJI}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{area.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {getAreaTableCount(area)} {translations.tables}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground opacity-80" />
              </Link>
              <div className="flex border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-auto flex-1 rounded-none py-3 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                  )}
                  onClick={() => openEdit(area)}
                >
                  <Pencil className="size-4" />
                  {translations.tableCardEdit}
                </Button>
                <div className="w-px bg-border" aria-hidden />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-auto flex-1 rounded-none py-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  )}
                  onClick={() => setDeleteTarget(area)}
                >
                  <Trash2 className="size-4" />
                  {translations.tableCardDelete}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingArea
                ? translations.editArea
                : translations.addArea}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="area-name">{translations.areaName}</Label>
            <Input
              id="area-name"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              maxLength={100}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {translations.cancel}
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {translations.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.confirmDeleteArea}
            </DialogTitle>
            <DialogDescription>{deleteTarget?.name}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {translations.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={saving}>
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
