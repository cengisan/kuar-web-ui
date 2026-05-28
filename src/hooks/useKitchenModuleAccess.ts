"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/presentation/state/hooks";
import { checkKitchenAccess } from "@/utils/featureAccess";

export function useKitchenModuleAccess() {
  const { subscriberId, accessToken, employeeData, translations, is_trial_enable } =
    useAppSelector((s) => s.user);

  const ownerSubscriberId = subscriberId ?? employeeData?.employerId ?? null;
  const [hasKitchenModule, setHasKitchenModule] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const resolveAccess = async () => {
      if (!ownerSubscriberId || !accessToken) {
        if (isMounted) setHasKitchenModule(false);
        return;
      }

      const hasAccess = await checkKitchenAccess({
        subscriberId: ownerSubscriberId,
        accessToken,
        translations,
        isTrialEnabled: is_trial_enable,
      });

      if (isMounted) {
        setHasKitchenModule(hasAccess);
      }
    };

    resolveAccess();

    return () => {
      isMounted = false;
    };
  }, [ownerSubscriberId, accessToken, translations, is_trial_enable]);

  return {
    hasKitchenModule: hasKitchenModule === true,
    isLoading: hasKitchenModule === null,
  };
}
