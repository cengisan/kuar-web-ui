"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteAccountRepositoryImpl from "@/data/repositories/DeleteAccountRepositoryImpl";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { endSession } from "@/presentation/state/userSlice";

export default function DeleteAccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translations, accessToken, email: storedEmail } = useAppSelector(
    (s) => s.user
  );

  const [email, setEmail] = useState(storedEmail || "");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const repo = new DeleteAccountRepositoryImpl(translations, accessToken);
      await repo.sendDeleteAccountEmail(email.trim().toLowerCase());
      toast.success(translations.codeSentAgain);
      setStage("code");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!email || code.length !== 6) return;
    setLoading(true);
    try {
      const repo = new DeleteAccountRepositoryImpl(translations, accessToken);
      await repo.deleteAccount(email.trim().toLowerCase(), code);
      toast.success(translations.accountDeleted);
      await dispatch(endSession());
      router.replace("/");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {translations.deleteAccount}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {translations.deleteAccountDescription}
          </p>
          <p className="text-sm italic text-muted-foreground">
            {translations.deleteAccountWarning}
          </p>

          {stage === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="del-email">{translations.email}</Label>
                <Input
                  id="del-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="destructive"
                loading={loading}
                className="w-full"
              >
                {translations.confirmDelete}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="del-code">
                  {translations.enterVerificationCode}
                </Label>
                <Input
                  id="del-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em]"
                  inputMode="numeric"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStage("email")}
                  disabled={loading}
                >
                  {translations.back}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmDelete}
                  loading={loading}
                  disabled={code.length !== 6}
                >
                  {translations.confirmDelete}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
