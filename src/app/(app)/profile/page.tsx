"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import ProfileRepositoryImpl from "@/data/repositories/ProfileRepositoryImpl";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { setName as setUserName, setMsisdn } from "@/presentation/state/userSlice";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translations, accessToken, subscriberId, isEmployee } = useAppSelector(
    (s) => s.user
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken || !subscriberId || isEmployee) {
      setLoading(false);
      return;
    }
    try {
      const repo = new ProfileRepositoryImpl(translations, accessToken);
      const response = await repo.getProfile(subscriberId);
      const profile = response.data as Record<string, unknown> | undefined;
      if (profile) {
        setName((profile.name as string) || "");
        setEmail((profile.email as string) || "");
        setPhone((profile.msisdn as string) || (profile.phone as string) || "");
      }
    } catch (e) {
      toast.error((e as Error).message || translations.fetchFailed);
    } finally {
      setLoading(false);
    }
  }, [accessToken, isEmployee, subscriberId, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !subscriberId) return;
    setSaving(true);
    try {
      const repo = new ProfileRepositoryImpl(translations, accessToken);
      await repo.updateProfile(
        { name: name.trim(), msisdn: phone.trim() || null },
        subscriberId
      );
      dispatch(setUserName(name.trim()));
      dispatch(setMsisdn(phone.trim()));
      toast.success(translations.profileUpdated);
    } catch (e) {
      toast.error((e as Error).message || translations.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: () => router.back() }}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {translations.profile}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{translations.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{translations.email}</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{translations.phone}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button type="submit" loading={saving} className="w-full">
              {translations.save}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">
            {translations.businessDeletionDangerZone}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild variant="destructive" className="w-full">
            <Link href="/profile/delete">
              <Trash2 />
              {translations.deleteAccount}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
