"use client";

import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Globe, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { setLanguage, setTheme } from "@/presentation/state/userSlice";
import type { LanguageCode } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { language, theme } = useAppSelector((s) => s.user);
  const { t } = useTranslation();

  const setAppLanguage = (next: LanguageCode) => {
    dispatch(setLanguage(next));
  };

  return (
    <PageLayout
      back={{ label: t("back"), onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <h1 className="text-2xl font-bold">{t("settings")}</h1>

      <Card className="border-border/80 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 size-5 shrink-0 text-foreground" />
              <div>
                <Label
                  htmlFor="language-switch"
                  className="cursor-pointer font-medium"
                >
                  {t("languageSettingsText")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("selectLanguage")}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  language === "en"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                EN
              </span>
              <Switch
                id="language-switch"
                checked={language === "tr"}
                onCheckedChange={(checked) =>
                  setAppLanguage(checked ? "tr" : "en")
                }
                aria-label={t("selectLanguage")}
              />
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  language === "tr"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                TR
              </span>
            </div>
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
