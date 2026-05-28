import SubscriptionRepositoryImpl from "@/data/repositories/SubscriptionRepositoryImpl";
import type { Translations } from "@/types";

export const FREE_FEATURES = ["DIGITAL_MENU", "PRODUCTS"];

export const MODULE_CODE_TO_PERMISSION: Record<string, string> = {
  DIGITAL_MENU: "DIGITAL_MENU",
  PRODUCT_MANAGEMENT: "PRODUCTS",
  EMPLOYEE_MANAGEMENT: "EMPLOYEES",
  TABLE_MANAGEMENT: "TABLE_MANAGEMENT",
  KITCHEN_DISPLAY: "KITCHEN_DISPLAY",
  CASH_REGISTER: "CASHIER",
  RESERVATIONS: "RESERVATION",
  FEEDBACK: "FEEDBACK",
  DASHBOARD: "DASHBOARD",
  CREATE_BUSINESS: "CREATE_BUSINESS",
  STOCK_MANAGEMENT: "STOCK",
};

export async function fetchAvailableFeatures({
  subscriberId,
  accessToken,
  translations,
  isTrialEnabled = false,
}: {
  subscriberId: number;
  accessToken: string;
  translations: Translations;
  isTrialEnabled?: boolean;
}) {
  if (!subscriberId || !accessToken) return FREE_FEATURES;

  try {
    const repository = new SubscriptionRepositoryImpl(translations, accessToken);
    const trialRes = await repository.getTrialStatus(subscriberId);
    if ((trialRes?.data as { is_trial_active?: boolean })?.is_trial_active) {
      return null;
    }
    const modulesRes = await repository.getSubscribedModules(subscriberId);
    if (modulesRes?.data && Array.isArray(modulesRes.data)) {
      const ownedCodes = modulesRes.data.map(
        (m: { code: string }) => MODULE_CODE_TO_PERMISSION[m.code] || m.code
      );
      return ownedCodes.length > 0 ? ownedCodes : FREE_FEATURES;
    }
    return FREE_FEATURES;
  } catch {
    return isTrialEnabled ? null : FREE_FEATURES;
  }
}

/** Owner kitchen module subscription (table deliver flow). */
export async function checkKitchenAccess({
  subscriberId,
  accessToken,
  translations,
  isTrialEnabled = false,
}: {
  subscriberId: number;
  accessToken: string;
  translations: Translations;
  isTrialEnabled?: boolean;
}) {
  if (!subscriberId || !accessToken) {
    return false;
  }

  try {
    const repository = new SubscriptionRepositoryImpl(translations, accessToken);
    const trialRes = await repository.getTrialStatus(subscriberId);
    if ((trialRes?.data as { is_trial_active?: boolean })?.is_trial_active) {
      return true;
    }

    const modulesRes = await repository.getSubscribedModules(subscriberId);
    if (modulesRes?.data && Array.isArray(modulesRes.data)) {
      return modulesRes.data.some(
        (module: { code: string }) => module.code === "KITCHEN_DISPLAY"
      );
    }

    return false;
  } catch {
    return isTrialEnabled === true;
  }
}

export function hasPermissionAccess(
  availableFeatures: string[] | null,
  permission: string,
  isEmployee = false
) {
  if (isEmployee) return true;
  if (availableFeatures === null) return true;
  return availableFeatures.includes(permission);
}
