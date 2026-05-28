"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FeedbackRepositoryImpl, {
  type FeedbackSummary,
  type NormalizedFeedback,
} from "@/data/repositories/FeedbackRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";

function RatingRow({ label, value }: { label: string; value?: number }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1 font-medium text-amber-500">
        <Star className="h-4 w-4 fill-current" />
        {value}
      </span>
    </div>
  );
}

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken } = useAppSelector((s) => s.user);

  const [feedbacks, setFeedbacks] = useState<NormalizedFeedback[]>([]);
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<NormalizedFeedback | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new FeedbackRepositoryImpl(translations, accessToken);
      const result = await repo.getAllFeedbacksByBusiness(businessId);
      const items = result.success ? result.feedbacks : [];
      setFeedbacks(items);

      const summaryResult = await repo.getFeedbackSummaryWithFallback(
        businessId,
        items
      );
      setSummary(summaryResult.summary ?? null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleMarkRead = async (feedback: NormalizedFeedback) => {
    if (!accessToken || feedback.read) return;
    const repo = new FeedbackRepositoryImpl(translations, accessToken);
    await repo.updateFeedbackReadStatus(feedback.id, true);
    fetchFeedbacks();
  };

  const handleDelete = async () => {
    if (!deleteTarget || !accessToken) return;
    setDeleting(true);
    try {
      const repo = new FeedbackRepositoryImpl(translations, accessToken);
      const result = await repo.deleteFeedback(deleteTarget.id);
      if (result.success) {
        toast.success(translations.feedbackDeleted);
        setDeleteTarget(null);
        fetchFeedbacks();
      } else {
        toast.error(result.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {translations.customerFeedback}
        </h1>
      </div>

      {summary && summary.totalRatings > 0 && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">
                  {summary.overallAverage.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {summary.totalRatings} {translations.ratings}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <RatingRow
                label={translations.tasteRating}
                value={summary.averageTaste}
              />
              <RatingRow
                label={translations.serviceRating}
                value={summary.averageService}
              />
              <RatingRow
                label={translations.speedRating}
                value={summary.averageSpeed}
              />
              <RatingRow
                label={translations.priceRating}
                value={summary.averagePrice}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noFeedbacks || translations.noFeedback}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <Card
              key={fb.id}
              className={!fb.read ? "border-primary/40" : undefined}
              onClick={() => handleMarkRead(fb)}
            >
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {!fb.read && <Badge>{translations.new}</Badge>}
                    {fb.averageRating != null && (
                      <span className="flex items-center gap-1 text-sm text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        {fb.averageRating.toFixed(1)}
                      </span>
                    )}
                    {fb.createdDate && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(fb.createdDate).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-sm whitespace-pre-wrap">
                    {fb.message || "—"}
                  </p>

                  {(fb.tasteRating ||
                    fb.serviceRating ||
                    fb.speedRating ||
                    fb.priceRating) && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-lg bg-muted/40 p-3">
                      <RatingRow
                        label={translations.tasteRating}
                        value={fb.tasteRating}
                      />
                      <RatingRow
                        label={translations.serviceRating}
                        value={fb.serviceRating}
                      />
                      <RatingRow
                        label={translations.speedRating}
                        value={fb.speedRating}
                      />
                      <RatingRow
                        label={translations.priceRating}
                        value={fb.priceRating}
                      />
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(fb);
                  }}
                >
                  <Trash2 />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.deleteFeedback}</DialogTitle>
            <DialogDescription>{deleteTarget?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {translations.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={deleting}>
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
