export type SearchParamsLike = Pick<URLSearchParams, "get">;

/** Owner home: business list (işletmeler) page. */
export const BUSINESSES_PAGE_PATH = "/dashboard";

export function businessesPagePath(): string {
  return BUSINESSES_PAGE_PATH;
}

export function businessHomePath(businessId: number | string): string {
  return `/business/${businessId}`;
}

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isBusinessModulePage(pathname: string): boolean {
  return /^\/business\/\d+$/.test(pathname);
}

function areasPath(businessId: string, mode: string | null): string {
  const base = `/business/${businessId}/areas`;
  return mode ? `${base}?mode=${mode}` : base;
}

function tablesPath(
  businessId: string,
  areaId: string,
  mode: string | null
): string {
  const base = `/business/${businessId}/areas/${areaId}/tables`;
  return mode ? `${base}?mode=${mode}` : base;
}

/**
 * Resolves the hierarchical parent route for business module pages.
 * Back navigation follows module structure, not browser history.
 */
export function getBusinessBackHref(
  pathname: string,
  searchParams: SearchParamsLike
): string | null {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/business/create") {
    return businessesPagePath();
  }

  if (isBusinessModulePage(normalizedPath)) {
    return businessesPagePath();
  }

  const match = normalizedPath.match(/^\/business\/(\d+)(\/.*)?$/);
  if (!match) return null;

  const businessId = match[1];
  const subPath = match[2] ?? "";
  const base = `/business/${businessId}`;
  const segments = subPath.split("/").filter(Boolean);

  const mode = searchParams.get("mode");
  const areaId = searchParams.get("areaId");
  const category = searchParams.get("category")?.trim();

  if (segments.length === 0) {
    return businessesPagePath();
  }

  const moduleRoot = segments[0];

  if (segments.length === 1) {
    if (moduleRoot === "products" && category) {
      return `${base}/products`;
    }
    return base;
  }

  switch (moduleRoot) {
    case "menus":
      if (segments[1] === "create") return `${base}/menus`;
      if (segments.length === 3 && segments[2] === "edit") return `${base}/menus`;
      return base;

    case "products":
      if (segments[1] === "create") {
        return category
          ? `${base}/products?category=${encodeURIComponent(category)}`
          : `${base}/products`;
      }
      if (segments.length === 3 && segments[2] === "edit") {
        return category
          ? `${base}/products?category=${encodeURIComponent(category)}`
          : `${base}/products`;
      }
      return base;

    case "employees":
      if (segments[1] === "add") return `${base}/employees`;
      if (segments.length === 3 && segments[2] === "edit") return `${base}/employees`;
      return base;

    case "areas":
      if (segments.length === 3 && segments[2] === "tables") {
        return areasPath(businessId, mode);
      }
      return base;

    case "tables": {
      const tableId = segments[1];
      const action = segments[2];

      if (action === "order") {
        if (segments[3] === "products") {
          const query = areaId ? `?areaId=${areaId}` : "";
          return `${base}/tables/${tableId}/order${query}`;
        }
        if (areaId) {
          return tablesPath(businessId, areaId, mode);
        }
        return `${base}/areas`;
      }

      if (action === "cashier") {
        if (areaId) {
          return `${base}/areas/${areaId}/tables?mode=cashier`;
        }
        return `${base}/areas?mode=cashier`;
      }

      return base;
    }

    case "stock":
      if (segments[1] === "create" || segments[1] === "alerts") {
        return `${base}/stock`;
      }
      if (segments.length === 3 && segments[2] === "edit") {
        return `${base}/stock`;
      }
      return base;

    case "kitchen":
    case "cashier":
    case "dashboard":
    case "feedback":
      return base;

    default:
      return base;
  }
}
