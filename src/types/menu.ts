// Types for the public menu page — mirrors backend MenuResponse + nested DTOs

export interface DigitalMenuImageData {
  id: number;
  image_url: string;
}

export interface DigitalMenuData {
  id: string;
  name: string;
  business_name: string | null;
  theme: string;
  is_available: boolean;
  ordering_enabled: boolean;
  digital_menu_image: DigitalMenuImageData[] | null;
  social_media: string | null;
  currency: string | null;
  business_id: number | null;
  created_date?: string;
  last_modified_date?: string;
}

export interface ProductImageData {
  id: number;
  image_url: string;
}

export interface ProductExtraParams {
  is_new_item: boolean;
  is_campaign: boolean;
  is_favorite: boolean;
  discount: string | null;
}

export interface ProductData {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  /** API field (snake_case) */
  allergen_names?: string[] | null;
  /** Legacy / in-memory camelCase alias */
  allergenNames?: string[] | null;
  price: number | null;
  calories: number | null;
  is_available: boolean;
  product_image: ProductImageData[] | null;
  extra_parameters: ProductExtraParams | null;
  stock_quantity: number | null;
  track_stock: boolean | null;
}

export interface TableOption {
  id: number;
  tableNumber: string;
}

export interface OrderProductOption {
  id: number;
  name: string;
  price: number;
  category: string | null;
}

export interface MenuApiData {
  name: string;
  subscriberId: number;
  digitalMenu: DigitalMenuData;
  products: ProductData[];
  colorPalette: string[] | null;
  theme: string;
  mainColor: string | null;
  socialMedia: string | null;
  hasFeedbackFeature: boolean;
  /** DIGITAL_MENU_ORDER module purchased (or trial). */
  hasOrderingFeature: boolean;
  orderingEnabled: boolean;
  orderToken: string | null;
  tables: TableOption[];
  orderProducts: OrderProductOption[];
}

export interface MenuApiResponse {
  meta?: { business_code: number; message?: string };
  data?: MenuApiData;
}

// Currency symbol lookup
export const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  RUB: "₽",
  CNY: "¥",
  INR: "₹",
  CAD: "C$",
  AUD: "A$",
};

export function getCurrencySymbol(code: string | null | undefined): string {
  if (!code) return "₺";
  return CURRENCY_SYMBOLS[code] ?? code;
}

/** Resolve allergen names from API variants (snake_case, camelCase, or object list). */
export function getProductAllergenNames(product: unknown): string[] {
  if (!product || typeof product !== "object") return [];

  const raw = product as Record<string, unknown>;

  const fromList = (value: unknown): string[] => {
    if (!Array.isArray(value) || value.length === 0) return [];
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object" && "name" in item) {
          const name = (item as { name?: unknown }).name;
          return typeof name === "string" ? name.trim() : "";
        }
        return "";
      })
      .filter((name): name is string => Boolean(name));
  };

  for (const key of ["allergen_names", "allergenNames", "allergens"]) {
    const names = fromList(raw[key]);
    if (names.length) return names;
  }

  return [];
}

export function normalizeMenuProduct(product: ProductData | Record<string, unknown>): ProductData {
  const base = product as ProductData;
  const allergenNames = getProductAllergenNames(product);
  return {
    ...base,
    allergen_names: allergenNames,
    allergenNames,
  };
}

function readRootBoolean(
  raw: Record<string, unknown>,
  camelKey: string,
  snakeKey: string,
): boolean | undefined {
  const camel = raw[camelKey];
  if (typeof camel === "boolean") return camel;
  const snake = raw[snakeKey];
  if (typeof snake === "boolean") return snake;
  return undefined;
}

/** Public menu: show order widget only when module is active and backend issued order data. */
export function isPublicMenuOrderingAvailable(data: MenuApiData): boolean {
  const hasModule =
    readRootBoolean(data as unknown as Record<string, unknown>, "hasOrderingFeature", "has_ordering_feature") ??
    data.orderingEnabled;

  return Boolean(
    hasModule &&
      data.orderingEnabled &&
      data.orderToken &&
      data.orderProducts.length > 0,
  );
}

export function normalizeMenuData(data: MenuApiData | Record<string, unknown>): MenuApiData {
  const raw = data as Record<string, unknown>;
  const products = Array.isArray(raw.products) ? raw.products : [];
  const orderingEnabled =
    readRootBoolean(raw, "orderingEnabled", "ordering_enabled") ?? false;
  const digitalMenuRaw = raw.digitalMenu as DigitalMenuData | undefined;

  return {
    ...(data as MenuApiData),
    subscriberId: Number(raw.subscriberId ?? raw.subscriber_id ?? 0),
    hasFeedbackFeature: Boolean(raw.hasFeedbackFeature ?? raw.has_feedback_feature),
    hasOrderingFeature: Boolean(raw.hasOrderingFeature ?? raw.has_ordering_feature),
    orderingEnabled,
    orderToken: (raw.orderToken ?? raw.order_token ?? null) as string | null,
    digitalMenu: digitalMenuRaw
      ? { ...digitalMenuRaw, ordering_enabled: orderingEnabled }
      : (data as MenuApiData).digitalMenu,
    products: products.map((product) => normalizeMenuProduct(product as ProductData)),
  };
}

// Normalize category name to a CSS/map key (mirrors MenuController.normalizeCategory)
export function normalizeCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s/g, "");
}

// Category default image map (relative paths under /api/v1)
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  sicakicecekler: "/api/v1/categoryImages/hot-drink.png",
  sogukicecekler: "/api/v1/categoryImages/cold-drink.png",
  kahveler: "/api/v1/categoryImages/coffee.png",
  caylar: "/api/v1/categoryImages/tea.png",
  bitkicaylari: "/api/v1/categoryImages/herbal-teas.png",
  sogukkahveler: "/api/v1/categoryImages/cold-coffee.png",
  smoothiedetoxicecekler: "/api/v1/categoryImages/smoothie-detox-drinks.png",
  milkshakefrappe: "/api/v1/categoryImages/milkshake-frappe.png",
  gazliicecekler: "/api/v1/categoryImages/carbonated-drinks.png",
  tazesikmameyvesulari: "/api/v1/categoryImages/fresh-fruit-juices.png",
  limonatalar: "/api/v1/categoryImages/lemonades.png",
  kahvaltiliklar: "/api/v1/categoryImages/breakfast-items.png",
  tostlarsandvicler: "/api/v1/categoryImages/toasts-sandwiches.png",
  atistirmaliklar: "/api/v1/categoryImages/snacks.png",
  tatlilar: "/api/v1/categoryImages/dessert.png",
  pastalar: "/api/v1/categoryImages/cake.png",
  kurabiyelermuffinler: "/api/v1/categoryImages/cookies-muffins.png",
  salatalar: "/api/v1/categoryImages/salads.png",
  anayemekler: "/api/v1/categoryImages/main-courses.png",
  makarnalar: "/api/v1/categoryImages/pasta.png",
  pizzalar: "/api/v1/categoryImages/pizza.png",
  burgerler: "/api/v1/categoryImages/burgers.png",
  pideler: "/api/v1/categoryImages/pide.png",
  kebaplar: "/api/v1/categoryImages/kebabs.png",
  etmenu: "/api/v1/categoryImages/meat-menu.png",
  tavukmenu: "/api/v1/categoryImages/chicken-menu.png",
  balikmenu: "/api/v1/categoryImages/fish-menu.png",
  veganvejetaryenseecenekler: "/api/v1/categoryImages/vegan-vegetarian-options.png",
  glutensizurunler: "/api/v1/categoryImages/gluten-free-products.png",
  haftalikozelmenu: "/api/v1/categoryImages/weekly-special-menu.png",
  cocukmenusu: "/api/v1/categoryImages/kids-menu.png",
  kahvaltimunuleri: "/api/v1/categoryImages/breakfast-menu.png",
  yorelezzetler: "/api/v1/categoryImages/local-tastes.png",
  sezonlukurunler: "/api/v1/categoryImages/seasonal-products.png",
  kahvetatlimunuler: "/api/v1/categoryImages/coffee-dessert-menus.png",
};

// Build the full Instagram URL from a raw social_media value
export function buildInstagramUrl(raw: string | null | undefined): string | null {
  if (!raw || raw === "null") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const username = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return `https://instagram.com/${username}`;
}
