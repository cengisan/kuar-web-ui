"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import {
  LoginForm,
  type BusinessLoginValues,
  type EmployeeLoginValues,
} from "@/components/auth/LoginForm";
import AuthRepositoryImpl from "@/data/repositories/AuthRepositoryImpl";
import EmployeeRepositoryImpl from "@/data/repositories/EmployeeRepositoryImpl";
import { googleClientId, isGoogleAuthConfigured } from "@/config/googleAuth";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import {
  checkSubscriptionStatus,
  startEmployeeSession,
  startSession,
} from "@/presentation/state/userSlice";
import type { RepositoryResult } from "@/types";

export function LoginPageClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translations } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = useCallback(
    async (response: RepositoryResult) => {
      if (!response.token) {
        throw new Error("Missing auth token");
      }

      await dispatch(startSession(response.token, response.userData));
      const userData = response.userData ?? {};
      if (userData.subscriber_id || userData.subscriberId) {
        await dispatch(checkSubscriptionStatus());
      }

      toast.success(response.message || translations.loginSuccessful);
      router.push("/dashboard");
    },
    [dispatch, router, translations.loginSuccessful, translations.userAccountIsNotActivated]
  );

  const handleBusinessSubmit = async (values: BusinessLoginValues) => {
    setLoading(true);
    try {
      const repo = new AuthRepositoryImpl(translations);
      const result = await repo.loginWithEmail(values.email, values.password);

      if (result.success) {
        await handleAuthSuccess(result);
        return;
      }

      if (result.needsVerification) {
        toast.info(result.message || translations.userAccountIsNotActivated);
        router.push(`/activation?email=${encodeURIComponent(values.email)}`);
        return;
      }

      toast.error(result.message || translations.loginFailed);
    } catch (error) {
      toast.error((error as Error).message || translations.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSubmit = async (values: EmployeeLoginValues) => {
    setLoading(true);
    try {
      const repo = new EmployeeRepositoryImpl(translations);
      const result = await repo.login(values.accessCode);

      if (!result.success || !result.data) {
        toast.error(result.message || translations.loginFailed);
        return;
      }

      const data = result.data as Record<string, unknown>;
      await dispatch(
        startEmployeeSession(String(data.token), {
          employeeId: Number(data.employeeId),
          name: String(data.name ?? ""),
          role: data.role as string | undefined,
          permissions: (data.permissions as string[] | undefined) ?? [],
          businessId: data.businessId as number | undefined,
          businessName: data.businessName as string | undefined,
          employerId: data.employerId as number | undefined,
          employerName: data.employerName as string | undefined,
        })
      );

      toast.success(translations.loginSuccessful);
      router.push("/dashboard");
    } catch (error) {
      toast.error((error as Error).message || translations.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error(translations.loginFailed);
      return;
    }

    setLoading(true);
    try {
      const repo = new AuthRepositoryImpl(translations);
      const result = await repo.loginWithGoogle(credentialResponse.credential);

      if (result.success) {
        await handleAuthSuccess(result);
      } else {
        toast.error(result.message || translations.loginFailed);
      }
    } catch (error) {
      toast.error((error as Error).message || translations.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      loading={loading}
      onBusinessSubmit={handleBusinessSubmit}
      onEmployeeSubmit={handleEmployeeSubmit}
      googleSignIn={
        isGoogleAuthConfigured ? (
          <GoogleSignInButton
            label={translations.loginWithGoogle}
            disabled={loading}
            onSuccess={handleGoogleCredential}
            onError={() => toast.error(translations.loginFailed)}
          />
        ) : (
          <button
            type="button"
            className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-muted-foreground"
            onClick={() =>
              toast.error(
                "Google girişi yapılandırılmamış. Vercel'de NEXT_PUBLIC_GOOGLE_CLIENT_ID değerini ayarlayın."
              )
            }
          >
            {translations.loginWithGoogle}
          </button>
        )
      }
    />
  );
}
