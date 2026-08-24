const PIXABAY_API_URL = "https://pixabay.com/api/";
const DEFAULT_PIXABAY_API_KEY = "53276534-20d404b2d9fade8a252bf9de2";

export interface PixabayImage {
  id: string;
  url: string;
  webformatURL: string;
  thumbnail: string;
  photographer: string;
  photographerUrl: string;
  tags: string;
  pageURL: string;
}

function getApiKey() {
  return process.env.NEXT_PUBLIC_PIXABAY_API_KEY || DEFAULT_PIXABAY_API_KEY;
}

async function translateToEnglish(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  try {
    const params = new URLSearchParams({
      q: trimmed,
      langpair: "tr|en",
    });
    const response = await fetch(
      `https://api.mymemory.translated.net/get?${params.toString()}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) return trimmed;
    const json = (await response.json()) as {
      responseData?: { translatedText?: string };
    };
    const translated = json.responseData?.translatedText?.trim();
    return translated && translated.toLowerCase() !== trimmed.toLowerCase()
      ? translated
      : trimmed;
  } catch {
    return trimmed;
  }
}

async function fetchPixabayHits(query: string, perPage: number) {
  const params = new URLSearchParams({
    key: getApiKey(),
    q: query,
    per_page: String(perPage),
    image_type: "photo",
    category: "food",
    safesearch: "true",
    orientation: "horizontal",
    min_width: "640",
    min_height: "480",
  });

  const response = await fetch(`${PIXABAY_API_URL}?${params.toString()}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    throw new Error(`Pixabay API error: ${response.status}`);
  }

  const json = (await response.json()) as {
    hits?: Array<{
      id: number;
      largeImageURL: string;
      webformatURL: string;
      previewURL: string;
      user: string;
      user_id: number;
      tags: string;
      pageURL: string;
    }>;
  };

  return json.hits ?? [];
}

function mapHits(
  hits: Awaited<ReturnType<typeof fetchPixabayHits>>
): PixabayImage[] {
  return hits.map((photo) => ({
    id: String(photo.id),
    url: photo.largeImageURL,
    webformatURL: photo.webformatURL,
    thumbnail: photo.previewURL,
    photographer: photo.user,
    photographerUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
    tags: photo.tags,
    pageURL: photo.pageURL,
  }));
}

export async function searchPixabayPhotos(
  query: string,
  perPage = 20
): Promise<{ success: true; images: PixabayImage[] } | { success: false; message: string }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { success: false, message: "empty_query" };
  }

  try {
    const translatedQuery = await translateToEnglish(trimmed);
    let hits = await fetchPixabayHits(translatedQuery, perPage);

    if (hits.length === 0 && translatedQuery.toLowerCase() !== trimmed.toLowerCase()) {
      hits = await fetchPixabayHits(trimmed, perPage);
    }

    return { success: true, images: mapHits(hits) };
  } catch {
    return { success: false, message: "search_failed" };
  }
}

export async function downloadPixabayImage(
  imageUrl: string,
  fileName?: string
): Promise<File> {
  const response = await fetch(
    `/api/pixabay/download?url=${encodeURIComponent(imageUrl)}`,
    { signal: AbortSignal.timeout(15000) }
  );
  if (!response.ok) {
    throw new Error("download_failed");
  }

  const blob = await response.blob();
  const name = fileName || `pixabay_${Date.now()}.jpg`;
  return new File([blob], name, {
    type: blob.type || "image/jpeg",
  });
}
