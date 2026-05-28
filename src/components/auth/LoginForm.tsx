"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import { assets } from "@/config/assets";
import { useTranslation } from "@/hooks/useTranslation";

export type BusinessLoginValues = {
  email: string;
  password: string;
};

export type EmployeeLoginValues = {
  accessCode: string;
};

export interface LoginFormProps {
  onBusinessSubmit?: (values: BusinessLoginValues) => Promise<void> | void;
  onEmployeeSubmit?: (values: EmployeeLoginValues) => Promise<void> | void;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  loading?: boolean;
  className?: string;
}

const employeeAccessCodeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

function formatAccessCode(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  return cleaned.match(/.{1,4}/g)?.join("-") ?? cleaned;
}

export function LoginForm({
  onBusinessSubmit,
  onEmployeeSubmit,
  onGoogleLogin,
  onForgotPassword,
  loading,
  className,
}: LoginFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("business");

  const businessSchema = React.useMemo(
    () =>
      z.object({
        email: z.email({ message: t("invalidEmailFormat") }),
        password: z.string().min(6, t("passwordTooShort")),
      }),
    [t],
  );

  const employeeSchema = React.useMemo(
    () =>
      z.object({
        accessCode: z.string().regex(employeeAccessCodeRegex, t("invalidAccessCode")),
      }),
    [t],
  );

  const businessForm = useForm<BusinessLoginValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: { email: "", password: "" },
  });

  const employeeForm = useForm<EmployeeLoginValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { accessCode: "" },
  });

  React.useEffect(() => {
    businessForm.clearErrors();
    employeeForm.clearErrors();
  }, [t, businessForm, employeeForm]);

  return (
    <div className={cn("w-full max-w-md space-y-6", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("welcomeToKuar")}</h1>
        <p className="text-sm text-muted-foreground">{t("loginSubtitle")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">{t("businessLogin")}</TabsTrigger>
          <TabsTrigger value="employee">{t("employeeLogin")}</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6 space-y-4">
          <form
            onSubmit={businessForm.handleSubmit(async (values) => {
              await onBusinessSubmit?.(values);
            })}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="business-email">{t("email")}</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="business-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  className="pl-9"
                  aria-invalid={!!businessForm.formState.errors.email}
                  {...businessForm.register("email")}
                />
              </div>
              {businessForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {businessForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <PasswordField
              id="business-password"
              label={t("password")}
              forgotLabel={t("forgotPassword")}
              register={businessForm.register("password")}
              error={businessForm.formState.errors.password?.message}
              showPassword={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              onForgotPassword={onForgotPassword}
              placeholder={t("passwordPlaceholder")}
              showPasswordLabel={t("showPassword")}
              hidePasswordLabel={t("hidePassword")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading || businessForm.formState.isSubmitting}
            >
              {t("signIn")}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="employee" className="mt-6 space-y-4">
          <form
            onSubmit={employeeForm.handleSubmit(async (values) => {
              await onEmployeeSubmit?.(values);
            })}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="employee-code">{t("accessCode")}</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="employee-code"
                  type="text"
                  autoComplete="off"
                  inputMode="text"
                  placeholder={t("accessCodePlaceholder")}
                  className="pl-9 font-mono uppercase tracking-widest"
                  aria-invalid={!!employeeForm.formState.errors.accessCode}
                  {...employeeForm.register("accessCode", {
                    onChange: (e) => {
                      e.target.value = formatAccessCode(e.target.value);
                    },
                  })}
                />
              </div>
              {employeeForm.formState.errors.accessCode && (
                <p className="text-xs text-destructive">
                  {employeeForm.formState.errors.accessCode.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading || employeeForm.formState.isSubmitting}
            >
              {t("signIn")}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {activeTab === "business" && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onGoogleLogin}
            disabled={!onGoogleLogin}
          >
            <Image
              src={assets.google}
              alt=""
              width={assets.google.width}
              height={assets.google.height}
              className="size-4"
              aria-hidden
            />
            {t("loginWithGoogle")}
          </Button>
        </>
      )}
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  forgotLabel: string;
  register: UseFormRegisterReturn;
  error?: string;
  showPassword: boolean;
  onToggle: () => void;
  onForgotPassword?: () => void;
  placeholder: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
}

function PasswordField({
  id,
  label,
  forgotLabel,
  register,
  error,
  showPassword,
  onToggle,
  onForgotPassword,
  placeholder,
  showPasswordLabel,
  hidePasswordLabel,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-medium text-primary hover:underline"
          >
            {forgotLabel}
          </button>
        )}
      </div>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder={placeholder}
          className="px-9"
          aria-invalid={!!error}
          {...register}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
