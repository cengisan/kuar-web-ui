"use client";

import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Globe, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { setLanguage, setTheme } from "@/presentation/state/userSlice";
import type { LanguageCode } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { language, theme } = useAppSelector((s) => s.user);
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const next: LanguageCode = language === "en" ? "tr" : "en";
    dispatch(setLanguage(next));
  };

  return (
    <PageLayout
      back={{ label: t("back"), onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <h1 className="text-2xl font-bold">{t("settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("languageSettingsText")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t("selectLanguage")}</p>
            <Button onClick={toggleLanguage} className="min-w-16">
              {language === "en" ? "EN" : "TR"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            {t("themeSettingsText")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => dispatch(setTheme("light"))}
              className="h-20 flex-col"
            >
              <Sun className="h-6 w-6" />
              <span>{t("lightMode")}</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => dispatch(setTheme("dark"))}
              className="h-20 flex-col"
            >
              <Moon className="h-6 w-6" />
              <span>{t("darkMode")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
