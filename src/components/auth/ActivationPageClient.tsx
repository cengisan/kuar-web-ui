"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ActivationForm } from "@/components/auth/ActivationForm";
import AuthRepositoryImpl from "@/data/repositories/AuthRepositoryImpl";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import {
  checkSubscriptionStatus,
  startSession,
} from "@/presentation/state/userSlice";
import { getWebDeviceInfo } from "@/utils/deviceInfo";

interface ActivationPageClientProps {
  email: string;
}

export function ActivationPageClient({ email }: ActivationPageClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translations } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (code: string) => {
      setLoading(true);
      try {
        const repo = new AuthRepositoryImpl(translations);
        const result = await repo.verifyEmail(email, code, getWebDeviceInfo());

        if (result.success && result.token) {
          await dispatch(startSession(result.token, result.userData));
          const userData = result.userData ?? {};
          if (userData.subscriber_id || userData.subscriberId) {
            await dispatch(checkSubscriptionStatus());
          }
          toast.success(result.message || translations.activationSuccess);
          router.push("/dashboard");
          return;
        }

        toast.error(result.message || translations.invalidVerificationCode);
      } catch (error) {
        toast.error((error as Error).message || translations.unexpectedErrorOccurred);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, email, router, translations]
  );

  const handleResend = useCallback(async () => {
    try {
      const repo = new AuthRepositoryImpl(translations);
      const result = await repo.resendActivationCode(email);
      if (result.success) {
        toast.success(result.message || translations.codeSentAgain);
      } else {
        toast.error(result.message || translations.unexpectedErrorOccurred);
      }
    } catch (error) {
      toast.error((error as Error).message || translations.unexpectedErrorOccurred);
    }
  }, [email, translations]);

  return (
    <ActivationForm
      email={email}
      onSubmit={handleSubmit}
      onResend={handleResend}
      loading={loading}
    />
  );
}
