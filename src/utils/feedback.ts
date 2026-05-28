export interface FeedbackSummary {
  averageTaste: number;
  averageService: number;
  averageSpeed: number;
  averagePrice: number;
  overallAverage: number;
  totalRatings: number;
}

export interface NormalizedFeedback {
  id: number;
  message: string;
  read: boolean;
  createdDate?: string;
  tasteRating?: number;
  serviceRating?: number;
  speedRating?: number;
  priceRating?: number;
  averageRating?: number;
  businessId?: number;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function optionalRating(value: unknown) {
  if (value == null) return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

export function normalizeFeedback(raw: unknown): NormalizedFeedback {
  const r = asRecord(raw);
  const id = Number(r.feedback_id ?? r.id ?? 0);
  const tasteRating = optionalRating(r.taste_rating ?? r.tasteRating);
  const serviceRating = optionalRating(r.service_rating ?? r.serviceRating);
  const speedRating = optionalRating(r.speed_rating ?? r.speedRating);
  const priceRating = optionalRating(r.price_rating ?? r.priceRating);
  const ratings = [tasteRating, serviceRating, speedRating, priceRating].filter(
    (value): value is number => value != null
  );

  return {
    id,
    message: String(r.feedback ?? r.message ?? ""),
    read: Boolean(r.read ?? r.isRead ?? false),
    createdDate:
      r.created_date != null
        ? String(r.created_date)
        : r.createdDate != null
          ? String(r.createdDate)
          : undefined,
    tasteRating,
    serviceRating,
    speedRating,
    priceRating,
    averageRating:
      ratings.length > 0
        ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
        : optionalRating(r.rating),
    businessId:
      r.business_id != null
        ? Number(r.business_id)
        : r.businessId != null
          ? Number(r.businessId)
          : undefined,
  };
}

export function normalizeFeedbacks(raw: unknown): NormalizedFeedback[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeFeedback).filter((item) => item.id > 0);
}

export function normalizeFeedbackSummary(raw: unknown): FeedbackSummary | null {
  const r = asRecord(raw);
  if (!Object.keys(r).length) return null;

  return {
    averageTaste: Number(r.averageTaste ?? r.average_taste ?? 0),
    averageService: Number(r.averageService ?? r.average_service ?? 0),
    averageSpeed: Number(r.averageSpeed ?? r.average_speed ?? 0),
    averagePrice: Number(r.averagePrice ?? r.average_price ?? 0),
    overallAverage: Number(r.overallAverage ?? r.overall_average ?? 0),
    totalRatings: Number(r.totalRatings ?? r.total_ratings ?? 0),
  };
}

export function buildSummaryFromFeedbacks(
  feedbacks: NormalizedFeedback[]
): FeedbackSummary | null {
  const rated = feedbacks.filter(
    (fb) =>
      fb.tasteRating ||
      fb.serviceRating ||
      fb.speedRating ||
      fb.priceRating
  );
  if (rated.length === 0) return null;

  const average = (values: Array<number | undefined>) => {
    const nums = values.filter((v): v is number => v != null && v > 0);
    return nums.length > 0
      ? nums.reduce((sum, value) => sum + value, 0) / nums.length
      : 0;
  };

  const averageTaste = average(rated.map((fb) => fb.tasteRating));
  const averageService = average(rated.map((fb) => fb.serviceRating));
  const averageSpeed = average(rated.map((fb) => fb.speedRating));
  const averagePrice = average(rated.map((fb) => fb.priceRating));
  const parts = [averageTaste, averageService, averageSpeed, averagePrice].filter(
    (value) => value > 0
  );
  const overallAverage =
    parts.length > 0
      ? parts.reduce((sum, value) => sum + value, 0) / parts.length
      : 0;

  return {
    averageTaste: Math.round(averageTaste * 10) / 10,
    averageService: Math.round(averageService * 10) / 10,
    averageSpeed: Math.round(averageSpeed * 10) / 10,
    averagePrice: Math.round(averagePrice * 10) / 10,
    overallAverage: Math.round(overallAverage * 10) / 10,
    totalRatings: rated.length,
  };
}
