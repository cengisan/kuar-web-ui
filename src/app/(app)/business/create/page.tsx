"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BusinessRepositoryImpl from "@/data/repositories/BusinessRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";

export default function CreateBusinessPage() {
  const router = useRouter();
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(translations.businessNameRequired);
      return;
    }
    setLoading(true);
    try {
      const repo = new BusinessRepositoryImpl(translations, accessToken);
      const result = await repo.createBusiness({
        name: name.trim(),
        description: description.trim() || null,
        subscriber_id: subscriberId,
      });
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard");
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><Card>
        <CardHeader>
          <CardTitle>{translations.createBusiness}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {translations.businessName} *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={translations.enterBusinessName}
                required
                maxLength={100}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {translations.businessDescription}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  translations.enterBusinessDescription
                }
                maxLength={500}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                {translations.cancel}
              </Button>
              <Button type="submit" loading={loading}>
                {translations.create}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
