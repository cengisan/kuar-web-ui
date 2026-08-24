import type { MenuApiData, MenuApiResponse } from "@/types/menu";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://kuar-test.up.railway.app/api/v1";

/**
 * Server-side fetch for public menu data.
 * Used in the Next.js Server Component at /menu/[id].
 */
export async function fetchPublicMenu(menuId: string): Promise<MenuApiData | null> {
  const url = `${API_BASE}/menu/${menuId}/data`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 5 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const json: MenuApiResponse = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}
