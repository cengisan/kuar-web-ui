"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Lightbulb } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SuggestionRepositoryImpl from "@/data/repositories/SuggestionRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";

export default function SuggestionsPage() {
  const router = useRouter();
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !subscriberId || !suggestion.trim()) return;
    setLoading(true);
    try {
      const repo = new SuggestionRepositoryImpl(translations, accessToken);
      const r = await repo.submitSuggestion(subscriberId, suggestion.trim());
      if (r.success) {
        toast.success(r.message);
        setSuggestion("");
      } else {
        toast.error(r.message);
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
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {translations.suggestions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                id="suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={translations.suggestionsPlaceholder}
                rows={8}
                maxLength={1000}
                required
              />
              <p className="text-right text-xs text-muted-foreground">
                {suggestion.length}/1000
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!suggestion.trim()}
            >
              {translations.submitSuggestion}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
