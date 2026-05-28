"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Copy, Pencil, Plus, RefreshCw, Share2, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEmployeeAccessCode } from "@/config/permissions";
import EmployeeRepositoryImpl from "@/data/repositories/EmployeeRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Employee } from "@/types";

export default function EmployeesPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken } = useAppSelector((s) => s.user);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [regenTarget, setRegenTarget] = useState<Employee | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new EmployeeRepositoryImpl(translations, accessToken);
      const r = await repo.getEmployeesByBusiness(businessId);
      setEmployees(r.success ? r.employees || [] : []);
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!accessToken || !deleteTarget) return;
    const repo = new EmployeeRepositoryImpl(translations, accessToken);
    const r = await repo.deleteEmployee(deleteTarget.id);
    if (r.success) {
      toast.success(translations.employeeDeleted);
      setDeleteTarget(null);
      load();
    } else {
      toast.error(r.message);
    }
  };

  const handleRegen = async () => {
    if (!accessToken || !regenTarget) return;
    setRegenLoading(true);
    try {
      const repo = new EmployeeRepositoryImpl(translations, accessToken);
      const r = await repo.regenerateAccessCode(regenTarget.id);
      if (r.success) {
        const code = r.employee ? getEmployeeAccessCode(r.employee) : "";
        toast.success(
          code
            ? `${translations.codeCopied || translations.accessCodeRegenerated}: ${code}`
            : translations.accessCodeRegenerated
        );
        setRegenTarget(null);
        load();
      } else {
        toast.error(r.message);
      }
    } finally {
      setRegenLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(translations.copied);
    });
  };

  const shareCode = async (code: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text: code });
        return;
      } catch {
        // User cancelled or share failed — fall back to copy
      }
    }
    copyCode(code);
  };

  const roleLabel = (role?: string) => {
    if (!role) return "";
    const map: Record<string, string> = {
      WAITER: translations.roleWaiter,
      CHEF: translations.roleChef,
      CASHIER: translations.roleCashier,
      MANAGER: translations.roleManager,
      OWNER: translations.roleOwner,
    };
    return map[role] || role;
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {translations.myEmployees}
        </h1>
        <Button asChild>
          <Link href={`/business/${businessId}/employees/add`}>
            <Plus />
            {translations.addEmployee}
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noEmployeesFound || translations.noEmployees}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {employees.map((employee) => {
            const accessCode = getEmployeeAccessCode(employee);
            return (
              <Card key={employee.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{employee.name}</p>
                      {employee.role && (
                        <Badge variant="secondary" className="mt-1">
                          {roleLabel(employee.role)}
                        </Badge>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" asChild>
                      <Link
                        href={`/business/${businessId}/employees/${employee.id}/edit`}
                        aria-label={translations.editEmployee}
                      >
                        <Pencil />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteTarget(employee)}
                      aria-label={translations.delete}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  {accessCode && (
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          {translations.accessCode}
                        </p>
                        <code className="block truncate font-mono text-lg font-bold tracking-widest">
                          {accessCode}
                        </code>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => shareCode(accessCode)}
                        aria-label={translations.share}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyCode(accessCode)}
                        aria-label={translations.copy}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => setRegenTarget(employee)}
                  >
                    <RefreshCw />
                    {translations.regenerateCode || translations.regenerateAccessCode}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.confirmDeleteEmployee}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {translations.no || translations.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {translations.yes || translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!regenTarget} onOpenChange={(o) => !o && setRegenTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.confirmRegenerateCode ||
                translations.regenerateAccessCode}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenTarget(null)} disabled={regenLoading}>
              {translations.no || translations.cancel}
            </Button>
            <Button onClick={handleRegen} loading={regenLoading}>
              {translations.yes || translations.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
