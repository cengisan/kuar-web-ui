"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Briefcase, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_PERMISSIONS_BY_ROLE,
  EMPLOYEE_ROLES,
  getEmployeePhone,
  normalizePermissions,
  PERMISSIONS,
  type PermissionKey,
} from "@/config/permissions";
import { cn } from "@/lib/cn";
import type { Employee, Translations } from "@/types";

interface EmployeeFormProps {
  businessId: number;
  initial?: Employee;
  translations: Translations;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: {
    name: string;
    phoneNumber: string | null;
    role: string;
    permissions: PermissionKey[];
  }) => void | Promise<void>;
  onCancel?: () => void;
}

export function EmployeeForm({
  businessId: _businessId,
  initial,
  translations,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const isEdit = Boolean(initial?.id);
  const initialRole = initial?.role || "WAITER";
  const loadedPerms = normalizePermissions(initial?.permissions);
  const initialPerms =
    isEdit && loadedPerms.length > 0
      ? loadedPerms
      : [...(DEFAULT_PERMISSIONS_BY_ROLE[initialRole] || [])];

  const [name, setName] = useState(initial?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(getEmployeePhone(initial || {}));
  const [role, setRole] = useState(initialRole);
  const [permissions, setPermissions] = useState<PermissionKey[]>(initialPerms);
  const skipNextRolePermissionReset = useRef(isEdit);

  const roles = useMemo(() => {
    if (isEdit && initial?.role === "OWNER") {
      return [
        { value: "OWNER", label: translations.roleOwner },
        ...EMPLOYEE_ROLES.map((r) => ({
          value: r.value,
          label: (translations[r.labelKey as keyof Translations] as string) || r.value,
        })),
      ];
    }
    return EMPLOYEE_ROLES.map((r) => ({
      value: r.value,
      label: (translations[r.labelKey as keyof Translations] as string) || r.value,
    }));
  }, [initial?.role, isEdit, translations]);

  useEffect(() => {
    if (skipNextRolePermissionReset.current) {
      skipNextRolePermissionReset.current = false;
      return;
    }
    setPermissions([...(DEFAULT_PERMISSIONS_BY_ROLE[role] || [])]);
  }, [role]);

  const togglePermission = (perm: PermissionKey) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const permissionLabel = (labelKey: string) =>
    (translations[labelKey as keyof Translations] as string) || labelKey;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({
      name: name.trim(),
      phoneNumber: phoneNumber.trim() || null,
      role,
      permissions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="emp-name">{translations.employeeName} *</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="emp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={translations.employeeName}
            className="pl-9"
            required
            maxLength={100}
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-phone">{translations.employeePhone}</Label>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="emp-phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={translations.employeePhone}
            className="pl-9"
            maxLength={20}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-role">{translations.employeeRole} *</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="emp-role" className="relative pl-9">
            <Briefcase className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <SelectValue placeholder={translations.selectRole} />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div>
          <Label>{translations.permissions}</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            {translations.permissionsDescription}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {PERMISSIONS.map((perm) => {
            const isSelected = permissions.includes(perm.key);
            return (
              <label
                key={perm.key}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition-colors",
                  isSelected
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-card/50 hover:bg-muted/40"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => togglePermission(perm.key)}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {permissionLabel(perm.labelKey)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            {translations.cancel}
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
