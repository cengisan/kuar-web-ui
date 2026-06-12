"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RegisterForm, type RegisterFormValues } from "@/components/auth/RegisterForm";
import AuthRepositoryImpl from "@/data/repositories/AuthRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getWebDeviceInfo } from "@/utils/deviceInfo";

export function RegisterPageClient() {
  const router = useRouter();
  const { translations } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const repo = new AuthRepositoryImpl(translations);
      const result = await repo.register(
        values.name,
        values.email,
        values.password,
        getWebDeviceInfo()
      );

      if (result.success) {
        toast.success(result.message || translations.registerSuccess);
        router.push(`/activation?email=${encodeURIComponent(values.email)}`);
        return;
      }

      toast.error(result.message || translations.unexpectedErrorOccurred);
    } catch (error) {
      toast.error((error as Error).message || translations.unexpectedErrorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return <RegisterForm onSubmit={handleSubmit} loading={loading} />;
}
