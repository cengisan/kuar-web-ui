"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EmployeeForm } from "@/components/business/EmployeeForm";
import EmployeeRepositoryImpl from "@/data/repositories/EmployeeRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Employee } from "@/types";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams<{ id: string; employeeId: string }>();
  const businessId = Number(params.id);
  const employeeId = Number(params.employeeId);
  const { translations, accessToken } = useAppSelector((s) => s.user);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new EmployeeRepositoryImpl(translations, accessToken);
      const r = await repo.getEmployeesByBusiness(businessId);
      if (r.success && r.employees) {
        const found = r.employees.find((e) => e.id === employeeId) || null;
        setEmployee(found);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, employeeId, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (values: {
    name: string;
    phoneNumber: string | null;
    role: string;
    permissions: string[];
  }) => {
    if (!accessToken) return;
    setSaving(true);
    try {
      const repo = new EmployeeRepositoryImpl(translations, accessToken);
      const r = await repo.updateEmployee(employeeId, {
        name: values.name,
        phoneNumber: values.phoneNumber,
        role: values.role,
        permissions: values.permissions,
      });
      if (r.success) {
        toast.success(translations.employeeUpdated);
        router.push(`/business/${businessId}/employees`);
      } else {
        toast.error(r.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: () => router.back() }}
        contentClassName="space-y-6"
      >
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (!employee) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: () => router.back() }}
        contentClassName="space-y-6"
      >
        <p className="text-center text-muted-foreground">
          {translations.employeeNotFound}
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{translations.editEmployee}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm
            businessId={businessId}
            initial={employee}
            translations={translations}
            submitLabel={translations.saveChanges}
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
