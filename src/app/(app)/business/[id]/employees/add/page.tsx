"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeForm } from "@/components/business/EmployeeForm";
import { getEmployeeAccessCode } from "@/config/permissions";
import EmployeeRepositoryImpl from "@/data/repositories/EmployeeRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";

export default function AddEmployeePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken } = useAppSelector((s) => s.user);
  const [saving, setSaving] = useState(false);

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
      const r = await repo.createEmployee({
        name: values.name,
        phoneNumber: values.phoneNumber,
        role: values.role,
        permissions: values.permissions,
        business_id: businessId,
      });
      if (r.success) {
        const code = r.employee ? getEmployeeAccessCode(r.employee) : "";
        toast.success(
          code
            ? `${translations.employeeAdded} — ${translations.accessCode}: ${code}`
            : translations.employeeAdded
        );
        router.push(`/business/${businessId}/employees`);
      } else {
        toast.error(r.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{translations.addEmployee}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm
            businessId={businessId}
            translations={translations}
            submitLabel={translations.addEmployee}
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
