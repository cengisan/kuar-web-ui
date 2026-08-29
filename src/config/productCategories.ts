import type { ProductCategoryGroup as ApiProductCategoryGroup } from "@/types";

export type ProductLanguage = "en" | "tr";
export interface CategoryItem {
  id: string;
  en: string;
  tr: string;
}

export interface UiCategoryGroup {
  title: string;
  items: Array<{ id: string; label: string }>;
}

export interface CategoryGroup {
  title: Record<ProductLanguage, string>;
  items: CategoryItem[];
}

export const productCategoryGroups: CategoryGroup[] = [
  {
    title: { en: "Beverage Categories", tr: "İçecek Kategorileri" },
    items: [
      { id: "hot_beverages", en: "Hot Beverages", tr: "Sıcak İçecekler" },
      { id: "cold_beverages", en: "Cold Beverages", tr: "Soğuk İçecekler" },
      { id: "coffees", en: "Coffees", tr: "Kahveler" },
      { id: "espresso_drinks", en: "Espresso-Based Drinks", tr: "Espresso Bazlı İçecekler" },
      { id: "turkish_coffee", en: "Turkish Coffee", tr: "Türk Kahvesi" },
      { id: "filter_coffee", en: "Filter & Pour-Over Coffee", tr: "Filtre & Demleme Kahve" },
      { id: "specialty_lattes", en: "Specialty Lattes", tr: "Özel Latte Çeşitleri" },
      { id: "cold_coffees", en: "Cold Coffees", tr: "Soğuk Kahveler" },
      { id: "cold_brew", en: "Cold Brew", tr: "Cold Brew" },
      { id: "affogato", en: "Affogato", tr: "Affogato" },
      { id: "teas", en: "Teas", tr: "Çaylar" },
      { id: "herbal_teas", en: "Herbal Teas", tr: "Bitki Çayları" },
      { id: "iced_tea", en: "Iced Teas", tr: "Soğuk Çaylar" },
      { id: "matcha_drinks", en: "Matcha Drinks", tr: "Matcha İçecekleri" },
      { id: "hot_chocolate", en: "Hot Chocolate", tr: "Sıcak Çikolata" },
      { id: "smoothie_detox", en: "Smoothie & Detox Drinks", tr: "Smoothie & Detox İçecekler" },
      { id: "milkshake_frappe", en: "Milkshake & Frappe", tr: "Milkshake & Frappe" },
      { id: "bubble_tea", en: "Bubble Tea / Boba", tr: "Bubble Tea / Boba" },
      { id: "fresh_juices", en: "Fresh Fruit Juices", tr: "Taze Sıkma Meyve Suları" },
      { id: "lemonades", en: "Lemonades", tr: "Limonatalar" },
      { id: "iced_drinks", en: "Iced Drinks", tr: "Buzlu İçecekler" },
      { id: "carbonated_drinks", en: "Carbonated Drinks", tr: "Gazlı İçecekler" },
      { id: "energy_drinks", en: "Energy Drinks", tr: "Enerji İçecekleri" },
      { id: "water", en: "Water & Sparkling Water", tr: "Su & Maden Suyu" },
      { id: "ayran_yogurt", en: "Ayran & Yogurt Drinks", tr: "Ayran & Kefir" },
      { id: "traditional_drinks", en: "Traditional Drinks", tr: "Geleneksel İçecekler" },
      { id: "mocktails", en: "Mocktails", tr: "Alkolsüz Kokteyller" },
      { id: "beer", en: "Beers", tr: "Biralar" },
      { id: "wine", en: "Wines", tr: "Şaraplar" },
      { id: "cocktails", en: "Cocktails", tr: "Kokteyller" },
      { id: "spirits", en: "Spirits & Rakı", tr: "Distile İçkiler & Rakı" },
      { id: "hot_cocktails", en: "Hot Cocktails", tr: "Sıcak Kokteyller" },
      { id: "seasonal_drinks", en: "Seasonal Drinks", tr: "Mevsimlik İçecekler" },
    ],
  },
  {
    title: { en: "Food Categories", tr: "Yiyecek Kategorileri" },
    items: [
      { id: "breakfast", en: "Breakfast Items", tr: "Kahvaltılıklar" },
      { id: "brunch", en: "Brunch", tr: "Brunch" },
      { id: "breakfast_plates", en: "Breakfast Platters", tr: "Serpme Kahvaltı & Tabaklar" },
      { id: "eggs_omelettes", en: "Eggs & Omelettes", tr: "Yumurta & Omletler" },
      { id: "toasts_sandwiches", en: "Toasts & Sandwiches", tr: "Tostlar & Sandviçler" },
      { id: "wraps_durum", en: "Wraps & Dürüm", tr: "Dürüm & Wrap" },
      { id: "snacks", en: "Snacks", tr: "Atıştırmalıklar" },
      { id: "appetizers", en: "Appetizers & Meze", tr: "Mezeler & Başlangıçlar" },
      { id: "soups", en: "Soups", tr: "Çorbalar" },
      { id: "salads", en: "Salads", tr: "Salatalar" },
      { id: "bowls", en: "Bowls & Poke", tr: "Bowl & Poke" },
      { id: "main_courses", en: "Main Courses", tr: "Ana Yemekler" },
      { id: "steak_grill", en: "Steak & Grill", tr: "Steak & Izgara" },
      { id: "bbq", en: "BBQ", tr: "Barbekü" },
      { id: "pasta", en: "Pasta", tr: "Makarnalar" },
      { id: "pizza", en: "Pizza", tr: "Pizzalar" },
      { id: "burgers", en: "Burgers", tr: "Burgerler" },
      { id: "pide", en: "Pide", tr: "Pideler" },
      { id: "lahmacun", en: "Lahmacun", tr: "Lahmacun" },
      { id: "kebabs", en: "Kebabs", tr: "Kebaplar" },
      { id: "doner", en: "Doner", tr: "Döner" },
      { id: "meat_menu", en: "Meat Menu", tr: "Et Menü" },
      { id: "chicken_menu", en: "Chicken Menu", tr: "Tavuk Menü" },
      { id: "fish_menu", en: "Fish Menu", tr: "Balık Menü" },
      { id: "seafood", en: "Seafood", tr: "Deniz Mahsulleri" },
      { id: "sushi_asian", en: "Sushi & Asian Cuisine", tr: "Sushi & Asya Mutfağı" },
      { id: "mexican", en: "Mexican Cuisine", tr: "Meksika Mutfağı" },
      { id: "world_cuisine", en: "World Cuisine", tr: "Dünya Mutfağı" },
      { id: "rice_pilaf", en: "Rice & Pilaf", tr: "Pilav & Rice Bowls" },
      { id: "casseroles", en: "Casseroles & Stews", tr: "Güveç & Sote" },
      { id: "street_food", en: "Street Food", tr: "Sokak Lezzetleri" },
      { id: "manti_gozleme", en: "Manti, Gözleme & Börek", tr: "Mantı, Gözleme & Börek" },
      { id: "pastries", en: "Pastries & Börek", tr: "Hamur İşleri & Börekler" },
      { id: "bakery", en: "Bakery & Breads", tr: "Fırın & Unlu Mamuller" },
      { id: "desserts", en: "Desserts", tr: "Tatlılar" },
      { id: "turkish_sweets", en: "Turkish Sweets & Baklava", tr: "Baklava & Türk Tatlıları" },
      { id: "cakes", en: "Cakes", tr: "Pastalar" },
      { id: "cookies_muffins", en: "Cookies & Muffins", tr: "Kurabiyeler & Muffinler" },
      { id: "waffles_crepes", en: "Waffles & Crepes", tr: "Waffle & Krep" },
      { id: "pancakes", en: "Pancakes", tr: "Pankek" },
      { id: "ice_cream", en: "Ice Cream & Frozen Desserts", tr: "Dondurma & Frozen" },
      { id: "vegan_vegetarian", en: "Vegan / Vegetarian Options", tr: "Vegan / Vejetaryen Seçenekler" },
      { id: "gluten_free", en: "Gluten-Free Products", tr: "Glutensiz Ürünler" },
      { id: "sides", en: "Side Dishes", tr: "Garnitürler & Yan Ürünler" },
      { id: "dips_sauces", en: "Dips & Sauces", tr: "Soslar & Dip" },
      { id: "cheese_plates", en: "Cheese & Charcuterie", tr: "Peynir & Charcuterie Tabakları" },
      { id: "nuts_dried", en: "Nuts & Dried Fruits", tr: "Kuruyemiş & Kuru Meyve" },
      { id: "finger_food", en: "Finger Food", tr: "Finger Food" },
      { id: "sharing_platters", en: "Sharing Platters", tr: "Paylaşımlık Tabaklar" },
    ],
  },
  {
    title: { en: "Special Sections / Other Categories", tr: "Özel Bölümler / Diğer Kategoriler" },
    items: [
      { id: "weekly_special", en: "Weekly Special Menu", tr: "Haftalık Özel Menü" },
      { id: "chef_specials", en: "Chef's Specials", tr: "Şefin Önerileri" },
      { id: "kids_menu", en: "Kids Menu", tr: "Çocuk Menüsü" },
      { id: "breakfast_menus", en: "Breakfast Menus", tr: "Kahvaltı Menüleri" },
      { id: "lunch_menus", en: "Lunch Menus", tr: "Öğle Menüleri" },
      { id: "dinner_menus", en: "Dinner Menus", tr: "Akşam Menüleri" },
      { id: "combo_menus", en: "Combo Menus", tr: "Menü & Kombinasyonlar" },
      { id: "coffee_dessert_menus", en: "Coffee & Dessert Menus", tr: "Kahve & Tatlı Menüler" },
      { id: "all_day_breakfast", en: "All Day Breakfast", tr: "All Day Breakfast" },
      { id: "local_tastes", en: "Local Tastes", tr: "Yöresel Lezzetler" },
      { id: "seasonal_products", en: "Seasonal Products", tr: "Sezonluk Ürünler" },
      { id: "happy_hour", en: "Happy Hour", tr: "Happy Hour" },
      { id: "takeaway", en: "Takeaway Specials", tr: "Paket Servis Özel" },
      { id: "catering", en: "Catering", tr: "Catering" },
      { id: "merchandise", en: "Coffee & Retail", tr: "Kahve & Ürün Satışı" },
      { id: "new_arrivals", en: "New Arrivals", tr: "Yeni Ürünler" },
      { id: "best_sellers", en: "Best Sellers", tr: "Çok Satanlar" },
    ],
  },
];

function sortUiItems(
  items: Array<{ id: string; label: string }>,
  language: ProductLanguage
) {
  const locale = language === "tr" ? "tr" : "en";
  return [...items].sort((a, b) =>
    a.label.localeCompare(b.label, locale, { sensitivity: "base" })
  );
}

function mapStaticFallbackGroups(language: ProductLanguage): UiCategoryGroup[] {
  return productCategoryGroups.map((group) => ({
    title: group.title[language],
    items: sortUiItems(
      group.items.map((item) => ({
        id: item.id,
        label: item[language],
      })),
      language
    ),
  }));
}

export function mapApiCategoryGroups(
  apiGroups: ApiProductCategoryGroup[],
  language: ProductLanguage
): UiCategoryGroup[] {
  if (!apiGroups.length) {
    return mapStaticFallbackGroups(language);
  }

  return apiGroups.map((group) => ({
    title: language === "tr" ? group.group_title_tr : group.group_title_en,
    items: sortUiItems(
      (group.categories ?? []).map((category) => ({
        id: category.code,
        label: language === "tr" ? category.name_tr : category.name_en,
      })),
      language
    ),
  }));
}

export function filterCategoryGroups(groups: UiCategoryGroup[], query: string) {  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return groups;

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLocaleLowerCase().includes(normalized)
      ),
    }))
    .filter((group) => group.items.length > 0);
}

function findInApiGroups(
  apiGroups: ApiProductCategoryGroup[],
  predicate: (category: ApiProductCategoryGroup["categories"][number]) => boolean
) {
  for (const group of apiGroups) {
    const found = group.categories?.find(predicate);
    if (found) return found;
  }
  return null;
}

export function getCategoryLabel(
  categoryId: string,
  language: ProductLanguage,
  apiGroups: ApiProductCategoryGroup[] = []
) {
  const fromApi = findInApiGroups(apiGroups, (category) => category.code === categoryId);
  if (fromApi) {
    return language === "tr" ? fromApi.name_tr : fromApi.name_en;
  }

  for (const group of productCategoryGroups) {
    const found = group.items.find((item) => item.id === categoryId);
    if (found) return found[language];
  }
  return categoryId;
}

export function getProductCategoryDisplay(
  category: string | undefined,
  language: ProductLanguage,
  apiGroups: ApiProductCategoryGroup[] = []
): string {
  if (!category) return "";
  const fromId = getCategoryLabel(category, language, apiGroups);
  if (fromId !== category) return fromId;
  const mappedId = findCategoryIdByLabel(category, apiGroups);
  if (mappedId) return getCategoryLabel(mappedId, language, apiGroups);
  return category;
}

export function findCategoryIdByLabel(
  label: string,
  apiGroups: ApiProductCategoryGroup[] = []
) {
  if (!label) return null;

  const fromApi = findInApiGroups(
    apiGroups,
    (category) =>
      category.code === label ||
      category.name_tr === label ||
      category.name_en === label
  );
  if (fromApi) return fromApi.code;

  for (const group of productCategoryGroups) {
    const found = group.items.find(
      (item) => item.id === label || item.en === label || item.tr === label
    );
    if (found) return found.id;
  }
  return null;
}

export function resolveCategoryForApi(
  values: {
    categoryId: string;
    customCategory: string;
    isCustomCategory: boolean;
  },
  language: ProductLanguage,
  apiGroups: ApiProductCategoryGroup[] = []
) {
  if (values.categoryId) {
    return getCategoryLabel(values.categoryId, language, apiGroups);
  }
  if (values.isCustomCategory) {
    return values.customCategory.trim();
  }
  return "";
}