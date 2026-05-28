import type { Employee } from "@/types";

export const PERMISSIONS = [
  { key: "DIGITAL_MENU", labelKey: "permDigitalMenu" },
  { key: "PRODUCTS", labelKey: "permProducts" },
  { key: "EMPLOYEES", labelKey: "permEmployees" },
  { key: "TABLE_MANAGEMENT", labelKey: "permTableManagement" },
  { key: "KITCHEN_DISPLAY", labelKey: "permKitchenDisplay" },
  { key: "CASHIER", labelKey: "permCashier" },
  { key: "RESERVATION", labelKey: "permReservation" },
  { key: "FEEDBACK", labelKey: "permFeedback" },
  { key: "DASHBOARD", labelKey: "permDashboard" },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];

export const DEFAULT_PERMISSIONS_BY_ROLE: Record<string, PermissionKey[]> = {
  WAITER: ["TABLE_MANAGEMENT"],
  CHEF: ["KITCHEN_DISPLAY"],
  CASHIER: ["TABLE_MANAGEMENT", "CASHIER", "RESERVATION"],
  MANAGER: [
    "DIGITAL_MENU",
    "PRODUCTS",
    "EMPLOYEES",
    "TABLE_MANAGEMENT",
    "KITCHEN_DISPLAY",
    "CASHIER",
    "RESERVATION",
    "FEEDBACK",
    "DASHBOARD",
  ],
};

export const EMPLOYEE_ROLES = [
  { value: "WAITER", labelKey: "roleWaiter" },
  { value: "CHEF", labelKey: "roleChef" },
  { value: "CASHIER", labelKey: "roleCashier" },
  { value: "MANAGER", labelKey: "roleManager" },
] as const;

export function normalizePermissions(raw?: unknown): PermissionKey[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return [...raw] as PermissionKey[];
  if (raw instanceof Set) return [...raw] as PermissionKey[];
  return [];
}

export function getEmployeeAccessCode(employee: {
  accessCode?: string;
  access_code?: string;
}) {
  return employee.accessCode || employee.access_code || "";
}

export function getEmployeePhone(employee: {
  phoneNumber?: string;
  phone_number?: string;
}) {
  return employee.phoneNumber || employee.phone_number || "";
}

export function normalizeEmployee(raw: Record<string, unknown>): Employee {
  return {
    id: Number(raw.id),
    name: String(raw.name || ""),
    role: raw.role ? String(raw.role) : undefined,
    permissions: Array.isArray(raw.permissions)
      ? (raw.permissions as string[])
      : raw.permissions
        ? [...(raw.permissions as Iterable<string>)]
        : [],
    accessCode: getEmployeeAccessCode(raw as { accessCode?: string; access_code?: string }),
    access_code: getEmployeeAccessCode(raw as { accessCode?: string; access_code?: string }),
    phoneNumber: getEmployeePhone(raw as { phoneNumber?: string; phone_number?: string }),
    business_id: raw.business_id != null ? Number(raw.business_id) : undefined,
  };
}
