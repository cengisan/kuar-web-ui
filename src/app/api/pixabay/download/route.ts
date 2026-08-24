import { NextRequest, NextResponse } from "next/server";

function normalizePixabayUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase();

    const allowed =
      host === "pixabay.com" ||
      host === "cdn.pixabay.com" ||
      host.endsWith(".pixabay.com");

    if (!allowed) return null;

    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
    } else if (parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  const url = rawUrl ? normalizePixabayUrl(rawUrl) : null;

  if (!url) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        Accept: "image/*",
        "User-Agent": "KuarWeb/1.0",
      },
      redirect: "follow",
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Download failed" }, { status: 502 });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 502 });
  }
}
