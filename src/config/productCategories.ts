export type ProductLanguage = "en" | "tr";

export interface CategoryItem {
  id: string;
  en: string;
  tr: string;
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
      { id: "teas", en: "Teas", tr: "Çaylar" },
      { id: "herbal_teas", en: "Herbal Teas", tr: "Bitki Çayları" },
      { id: "cold_coffees", en: "Cold Coffees", tr: "Soğuk Kahveler" },
      { id: "smoothie_detox", en: "Smoothie & Detox Drinks", tr: "Smoothie & Detox İçecekler" },
      { id: "milkshake_frappe", en: "Milkshake & Frappe", tr: "Milkshake & Frappe" },
      { id: "carbonated_drinks", en: "Carbonated Drinks", tr: "Gazlı İçecekler" },
      { id: "fresh_juices", en: "Fresh Fruit Juices", tr: "Taze Sıkma Meyve Suları" },
      { id: "lemonades", en: "Lemonades", tr: "Limonatalar" },
    ],
  },
  {
    title: { en: "Food Categories", tr: "Yiyecek Kategorileri" },
    items: [
      { id: "breakfast", en: "Breakfast Items", tr: "Kahvaltılıklar" },
      { id: "toasts_sandwiches", en: "Toasts & Sandwiches", tr: "Tostlar & Sandviçler" },
      { id: "snacks", en: "Snacks", tr: "Atıştırmalıklar" },
      { id: "desserts", en: "Desserts", tr: "Tatlılar" },
      { id: "cakes", en: "Cakes", tr: "Pastalar" },
      { id: "cookies_muffins", en: "Cookies & Muffins", tr: "Kurabiyeler & Muffinler" },
      { id: "salads", en: "Salads", tr: "Salatalar" },
      { id: "main_courses", en: "Main Courses", tr: "Ana Yemekler" },
      { id: "pasta", en: "Pasta", tr: "Makarnalar" },
      { id: "pizza", en: "Pizza", tr: "Pizzalar" },
      { id: "burgers", en: "Burgers", tr: "Burgerler" },
      { id: "pide", en: "Pide", tr: "Pideler" },
      { id: "kebabs", en: "Kebabs", tr: "Kebaplar" },
      { id: "meat_menu", en: "Meat Menu", tr: "Et Menü" },
      { id: "chicken_menu", en: "Chicken Menu", tr: "Tavuk Menü" },
      { id: "fish_menu", en: "Fish Menu", tr: "Balık Menü" },
      { id: "vegan_vegetarian", en: "Vegan / Vegetarian Options", tr: "Vegan / Vejetaryen Seçenekler" },
      { id: "gluten_free", en: "Gluten-Free Products", tr: "Glutensiz Ürünler" },
    ],
  },
  {
    title: { en: "Special Sections / Other Categories", tr: "Özel Bölümler / Diğer Kategoriler" },
    items: [
      { id: "weekly_special", en: "Weekly Special Menu", tr: "Haftalık Özel Menü" },
      { id: "kids_menu", en: "Kids Menu", tr: "Çocuk Menüsü" },
      { id: "breakfast_menus", en: "Breakfast Menus", tr: "Kahvaltı Menüleri" },
      { id: "local_tastes", en: "Local Tastes", tr: "Yöresel Lezzetler" },
      { id: "seasonal_products", en: "Seasonal Products", tr: "Sezonluk Ürünler" },
      { id: "coffee_dessert_menus", en: "Coffee & Dessert Menus", tr: "Kahve & Tatlı Menüler" },
    ],
  },
];

export function getCategoryLabel(categoryId: string, language: ProductLanguage) {
  for (const group of productCategoryGroups) {
    const found = group.items.find((item) => item.id === categoryId);
    if (found) return found[language];
  }
  return categoryId;
}

export function findCategoryIdByLabel(label: string) {
  if (!label) return null;
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
  language: ProductLanguage
) {
  if (values.isCustomCategory) {
    return values.customCategory.trim();
  }
  return values.categoryId ? getCategoryLabel(values.categoryId, language) : "";
}
