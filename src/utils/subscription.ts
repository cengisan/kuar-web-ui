import type { Translations } from "@/types";

export interface AvailableModule {
  module_id: number;
  code: string;
  name: string;
  description?: string;
  yearly_price: number;
  current_price: number;
  is_owned: boolean;
  display_order?: number;
  quantity?: number;
  supports_quantity?: boolean;
}

export interface RecommendedBundle {
  name: string;
  description?: string;
  module_ids: number[];
  total_price: number;
  bundle_price: number;
  discount_percentage: number;
}

export interface TrialStatus {
  is_trial_active: boolean;
  trial_start_date?: string;
  trial_end_date?: string;
  days_remaining: number;
  has_module_subscription: boolean;
}

export interface ExpiryInfo {
  end_date?: string;
  days_remaining: number;
  show_banner?: boolean;
  is_trial?: boolean;
}

export function formatPrice(value: unknown) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
}

export function formatYearlyPrice(value: unknown, perYearSuffix = "") {
  return `${formatPrice(value)}${perYearSuffix}`;
}

export function formatMoney(value: unknown, currency = "TRY") {
  return `${formatPrice(value)} ${currency}`;
}

export function isProRatedModulePrice(
  module: AvailableModule,
  hasExistingSubscription: boolean,
  isTrialActive: boolean
) {
  if (!hasExistingSubscription || isTrialActive || module.is_owned) return false;
  const yearly = Number(module.yearly_price || 0);
  const current = Number(module.current_price || 0);
  return yearly > 0 && current > 0 && current < yearly;
}

export function getModuleTranslation(
  code: string,
  field: "name" | "description",
  fallback: string,
  translations: Translations
) {
  const key = `module${code
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join("")}${field === "description" ? "Desc" : ""}` as keyof Translations;
  return (translations[key] as string) || fallback;
}

export function getBundleTranslation(
  name: string,
  field: "name" | "description",
  fallback: string,
  translations: Translations
) {
  if (name === "Basic Bundle") {
    return field === "name"
      ? translations.bundleBasicName || fallback
      : translations.bundleBasicDesc || fallback;
  }
  return fallback;
}

export function normalizeModule(raw: Record<string, unknown>): AvailableModule {
  return {
    module_id: Number(raw.module_id),
    code: String(raw.code || ""),
    name: String(raw.name || raw.code || ""),
    description: raw.description ? String(raw.description) : undefined,
    yearly_price: Number(raw.yearly_price ?? 0),
    current_price: Number(raw.current_price ?? 0),
    is_owned: Boolean(raw.is_owned),
    display_order: typeof raw.display_order === "number" ? raw.display_order : 0,
    quantity: typeof raw.quantity === "number" ? raw.quantity : 1,
    supports_quantity: Boolean(raw.supports_quantity),
  };
}

export function normalizeBundle(raw: Record<string, unknown>): RecommendedBundle {
  return {
    name: String(raw.name || ""),
    description: raw.description ? String(raw.description) : undefined,
    module_ids: Array.isArray(raw.module_ids)
      ? raw.module_ids.map((id) => Number(id))
      : [],
    total_price: Number(raw.total_price ?? 0),
    bundle_price: Number(raw.bundle_price ?? 0),
    discount_percentage: Number(raw.discount_percentage ?? 0),
  };
}

export function calculateSubtotal(
  selectedModules: AvailableModule[],
  moduleQuantities: Record<number, number>,
  allModules: AvailableModule[]
) {
  const hasBusinessModuleOwned = allModules.some(
    (m) => m.code === "CREATE_BUSINESS" && m.is_owned
  );

  return selectedModules.reduce((sum, module) => {
    if (module.code === "CREATE_BUSINESS") {
      const qty = moduleQuantities[module.module_id] || 1;
      const billable = hasBusinessModuleOwned ? qty : Math.max(0, qty - 1);
      return sum + billable * Number(module.current_price || 0);
    }
    return sum + Number(module.current_price || 0);
  }, 0);
}

export function calculateBundleSavings(
  bundle: RecommendedBundle | null,
  isBundleDiscountActive: boolean
) {
  if (!isBundleDiscountActive || !bundle) return 0;
  const total = Number(bundle.total_price || 0);
  const bundlePrice = Number(bundle.bundle_price || 0);
  return Math.max(0, total - bundlePrice);
}
