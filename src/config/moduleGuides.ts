import type { LucideIcon } from "lucide-react";
import {
  Building2,
  UtensilsCrossed,
  Package,
  Users,
  LayoutGrid,
  CreditCard,
  ChefHat,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Boxes,
} from "lucide-react";

export type LocalizedText = { tr: string; en: string };

export interface GuideStep {
  title: LocalizedText;
  description: LocalizedText;
}

export interface ModuleGuide {
  id: string;
  moduleCode: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  accent: string;
  iconColor: string;
  prerequisites?: LocalizedText;
  steps: GuideStep[];
  tips?: LocalizedText[];
}

export const gettingStartedSteps: GuideStep[] = [
  {
    title: { tr: "Hesap oluşturun", en: "Create your account" },
    description: {
      tr: "Kayıt sayfasından e-posta veya sosyal giriş ile ücretsiz hesabınızı oluşturun.",
      en: "Sign up with email or social login on the registration page for free.",
    },
  },
  {
    title: { tr: "İşletmenizi ekleyin", en: "Add your business" },
    description: {
      tr: "Dashboard'dan yeni işletme oluşturun. İlk işletmeniz ücretsizdir.",
      en: "Create a new business from the dashboard. Your first business is free.",
    },
  },
  {
    title: { tr: "Modülleri seçin", en: "Choose your modules" },
    description: {
      tr: "Abonelik sayfasından ihtiyacınız olan modülleri satın alın veya deneme süresini kullanın.",
      en: "Purchase the modules you need from the subscription page, or use the free trial.",
    },
  },
  {
    title: { tr: "Yönetmeye başlayın", en: "Start managing" },
    description: {
      tr: "İşletme detay sayfasından modül kartlarına tıklayarak operasyonlarınızı yönetin.",
      en: "Open your business detail page and use module cards to run daily operations.",
    },
  },
];

export const moduleGuides: ModuleGuide[] = [
  {
    id: "create-business",
    moduleCode: "CREATE_BUSINESS",
    icon: Building2,
    titleKey: "moduleCreateBusiness",
    descKey: "moduleCreateBusinessDesc",
    accent: "from-slate-500/20 to-gray-500/5",
    iconColor: "text-slate-400",
    steps: [
      {
        title: { tr: "Giriş yapın", en: "Sign in" },
        description: {
          tr: "İşletme sahibi hesabınızla /login sayfasından giriş yapın.",
          en: "Sign in with your owner account from the /login page.",
        },
      },
      {
        title: { tr: "Dashboard'a gidin", en: "Go to dashboard" },
        description: {
          tr: "Giriş sonrası otomatik olarak /dashboard sayfasına yönlendirilirsiniz.",
          en: "After login you are redirected to /dashboard automatically.",
        },
      },
      {
        title: { tr: "İşletme oluşturun", en: "Create a business" },
        description: {
          tr: "Yeni işletme butonuna tıklayın, işletme adı ve açıklamasını girin, kaydedin.",
          en: "Click create business, enter name and description, then save.",
        },
      },
      {
        title: { tr: "İşletme hub'ını açın", en: "Open the business hub" },
        description: {
          tr: "Oluşturduğunuz işletmeye tıklayarak /business/{id} sayfasındaki modül merkezine ulaşın.",
          en: "Click your business to reach the module hub at /business/{id}.",
        },
      },
      {
        title: { tr: "Profili düzenleyin", en: "Edit your profile" },
        description: {
          tr: "İşletme detayında düzenle ikonu ile ad ve açıklamayı güncelleyebilirsiniz.",
          en: "Use the edit icon on the business detail page to update name and description.",
        },
      },
    ],
    tips: [
      {
        tr: "İlk işletmeniz ücretsizdir; ek işletmeler için İşletme Oluştur modülü satın alınır.",
        en: "Your first business is free; additional businesses require the Create Business module.",
      },
    ],
  },
  {
    id: "digital-menu",
    moduleCode: "DIGITAL_MENU",
    icon: UtensilsCrossed,
    titleKey: "moduleDigitalMenu",
    descKey: "moduleDigitalMenuDesc",
    accent: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-400",
    prerequisites: {
      tr: "Dijital menü oluşturmadan önce ürünlerinizi tanımlamanız önerilir.",
      en: "We recommend defining your products before creating a digital menu.",
    },
    steps: [
      {
        title: { tr: "Menüler sayfasına gidin", en: "Go to menus" },
        description: {
          tr: "İşletme hub'ından Dijital Menü kartına tıklayın → /business/{id}/menus",
          en: "Click Digital Menu on the business hub → /business/{id}/menus",
        },
      },
      {
        title: { tr: "Yeni menü oluşturun", en: "Create a new menu" },
        description: {
          tr: "Oluştur butonuna basın, menü adını ve açıklamasını girin.",
          en: "Press create, enter menu name and description.",
        },
      },
      {
        title: { tr: "Ürünleri menüye ekleyin", en: "Add products to the menu" },
        description: {
          tr: "Menü düzenleme ekranından ürün seçin, sıralama ve görünürlük ayarlarını yapın.",
          en: "On the menu edit screen, select products and configure order and visibility.",
        },
      },
      {
        title: { tr: "Menüyü kaydedin", en: "Save the menu" },
        description: {
          tr: "Değişiklikleri kaydedin. Her işletme için bir dijital menü oluşturabilirsiniz.",
          en: "Save changes. You can create one digital menu per business.",
        },
      },
      {
        title: { tr: "QR kodu paylaşın", en: "Share the QR code" },
        description: {
          tr: "Menü listesinden QR kodu görüntüleyin veya indirin; müşterileriniz tarayarak menüye ulaşır.",
          en: "View or download the QR code from the menu list; customers scan it to view the menu.",
        },
      },
    ],
    tips: [
      {
        tr: "Menü güncellemeleri anında yansır; basılı menü basımına gerek kalmaz.",
        en: "Menu updates appear instantly — no need to reprint physical menus.",
      },
    ],
  },
  {
    id: "product-management",
    moduleCode: "PRODUCT_MANAGEMENT",
    icon: Package,
    titleKey: "moduleProductManagement",
    descKey: "moduleProductManagementDesc",
    accent: "from-emerald-500/20 to-green-500/5",
    iconColor: "text-emerald-400",
    steps: [
      {
        title: { tr: "Ürünler sayfasına gidin", en: "Go to products" },
        description: {
          tr: "İşletme hub'ından Ürünler kartına tıklayın → /business/{id}/products",
          en: "Click Products on the business hub → /business/{id}/products",
        },
      },
      {
        title: { tr: "Kategori oluşturun", en: "Create categories" },
        description: {
          tr: "Ürünleri gruplamak için kategori ekleyin (ör. İçecekler, Ana Yemekler).",
          en: "Add categories to group products (e.g. Drinks, Main Courses).",
        },
      },
      {
        title: { tr: "Ürün ekleyin", en: "Add products" },
        description: {
          tr: "Yeni ürün butonu ile ad, fiyat, açıklama, alerjen ve görsel bilgilerini girin.",
          en: "Use the new product button to enter name, price, description, allergens, and image.",
        },
      },
      {
        title: { tr: "Ürünü düzenleyin", en: "Edit products" },
        description: {
          tr: "Listeden bir ürüne tıklayarak /business/{id}/products/{productId}/edit sayfasında güncelleyin.",
          en: "Click a product to update it at /business/{id}/products/{productId}/edit.",
        },
      },
      {
        title: { tr: "Menüye bağlayın", en: "Link to menu" },
        description: {
          tr: "Oluşturduğunuz ürünleri Dijital Menü modülünden menünüze ekleyin.",
          en: "Add your products to your menu via the Digital Menu module.",
        },
      },
    ],
  },
  {
    id: "employee-management",
    moduleCode: "EMPLOYEE_MANAGEMENT",
    icon: Users,
    titleKey: "moduleEmployeeManagement",
    descKey: "moduleEmployeeManagementDesc",
    accent: "from-indigo-500/20 to-violet-500/5",
    iconColor: "text-indigo-400",
    steps: [
      {
        title: { tr: "Çalışanlar sayfasına gidin", en: "Go to employees" },
        description: {
          tr: "İşletme hub'ından Çalışanlarım kartına tıklayın → /business/{id}/employees",
          en: "Click My Employees on the business hub → /business/{id}/employees",
        },
      },
      {
        title: { tr: "Yeni çalışan ekleyin", en: "Add a new employee" },
        description: {
          tr: "Ekle butonu ile ad, e-posta ve rol bilgilerini girin.",
          en: "Use the add button to enter name, email, and role.",
        },
      },
      {
        title: { tr: "Rol ve yetki atayın", en: "Assign role and permissions" },
        description: {
          tr: "Garson, Şef, Kasiyer, Müdür veya Sahip rollerinden birini seçin; modül yetkilerini işaretleyin.",
          en: "Choose Waiter, Chef, Cashier, Manager, or Owner; check module permissions.",
        },
      },
      {
        title: { tr: "Erişim kodunu paylaşın", en: "Share access code" },
        description: {
          tr: "Oluşturulan erişim kodunu çalışanıza verin; çalışan /login üzerinden çalışan girişi yapar.",
          en: "Give the generated access code to your employee; they sign in via employee login at /login.",
        },
      },
      {
        title: { tr: "Çalışanı düzenleyin", en: "Edit employees" },
        description: {
          tr: "Yetki değişiklikleri için /business/{id}/employees/{employeeId}/edit sayfasını kullanın.",
          en: "Use /business/{id}/employees/{employeeId}/edit to change permissions.",
        },
      },
    ],
    tips: [
      {
        tr: "Her rolün varsayılan yetkileri vardır; ihtiyaca göre özelleştirebilirsiniz.",
        en: "Each role has default permissions; customize them as needed.",
      },
    ],
  },
  {
    id: "table-management",
    moduleCode: "TABLE_MANAGEMENT",
    icon: LayoutGrid,
    titleKey: "moduleTableManagement",
    descKey: "moduleTableManagementDesc",
    accent: "from-cyan-500/20 to-blue-500/5",
    iconColor: "text-cyan-400",
    prerequisites: {
      tr: "Sipariş alabilmek için önce ürünlerin tanımlı olması gerekir.",
      en: "Products must be defined before you can take orders.",
    },
    steps: [
      {
        title: { tr: "Alanlar sayfasına gidin", en: "Go to areas" },
        description: {
          tr: "Masa Yönetimi kartına tıklayın → /business/{id}/areas",
          en: "Click Table Management → /business/{id}/areas",
        },
      },
      {
        title: { tr: "Alan oluşturun", en: "Create an area" },
        description: {
          tr: "Salon, teras gibi alan adları tanımlayın (ör. İç Mekan, Bahçe).",
          en: "Define area names such as dining room or terrace (e.g. Indoor, Garden).",
        },
      },
      {
        title: { tr: "Masaları ekleyin", en: "Add tables" },
        description: {
          tr: "Alana girerek masa öneki, kapasite ve adet bilgisi ile masaları oluşturun.",
          en: "Enter an area and create tables with prefix, capacity, and count.",
        },
      },
      {
        title: { tr: "Sipariş alın", en: "Take orders" },
        description: {
          tr: "Boş masaya tıklayın → /business/{id}/tables/{tableId}/order — ürün ekleyin.",
          en: "Click an empty table → /business/{id}/tables/{tableId}/order — add items.",
        },
      },
      {
        title: { tr: "Siparişi mutfağa gönderin", en: "Send order to kitchen" },
        description: {
          tr: "Siparişi onaylayıp gönderin; masa durumu dolu olarak güncellenir.",
          en: "Confirm and send the order; the table status updates to occupied.",
        },
      },
    ],
  },
  {
    id: "cash-register",
    moduleCode: "CASH_REGISTER",
    icon: CreditCard,
    titleKey: "moduleCashRegister",
    descKey: "moduleCashRegisterDesc",
    accent: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-400",
    prerequisites: {
      tr: "Ödeme almak için masada aktif sipariş olmalıdır.",
      en: "An active order on the table is required to process payment.",
    },
    steps: [
      {
        title: { tr: "Kasa ekranını açın", en: "Open cashier" },
        description: {
          tr: "İşletme hub'ından Kasa kartına tıklayın veya dolu masadan kasa moduna geçin.",
          en: "Click Cashier on the business hub or switch to cashier mode from an occupied table.",
        },
      },
      {
        title: { tr: "Masayı seçin", en: "Select a table" },
        description: {
          tr: "Ödeme alınacak dolu masayı listeden seçin → /business/{id}/tables/{tableId}/cashier",
          en: "Select the occupied table to bill → /business/{id}/tables/{tableId}/cashier",
        },
      },
      {
        title: { tr: "Adisyonu kontrol edin", en: "Review the bill" },
        description: {
          tr: "Sipariş kalemlerini, toplam tutarı ve indirimleri kontrol edin.",
          en: "Review order items, total amount, and any discounts.",
        },
      },
      {
        title: { tr: "Ödeme alın", en: "Process payment" },
        description: {
          tr: "Ödeme yöntemini seçin (nakit, kart vb.) ve işlemi tamamlayın.",
          en: "Choose payment method (cash, card, etc.) and complete the transaction.",
        },
      },
      {
        title: { tr: "Masayı kapatın", en: "Close the table" },
        description: {
          tr: "Ödeme sonrası masa boşalır ve yeni sipariş alınabilir.",
          en: "After payment the table becomes empty and ready for new orders.",
        },
      },
    ],
  },
  {
    id: "kitchen-display",
    moduleCode: "KITCHEN_DISPLAY",
    icon: ChefHat,
    titleKey: "moduleKitchenDisplay",
    descKey: "moduleKitchenDisplayDesc",
    accent: "from-red-500/20 to-rose-500/5",
    iconColor: "text-red-400",
    steps: [
      {
        title: { tr: "Mutfak ekranını açın", en: "Open kitchen display" },
        description: {
          tr: "İşletme hub'ından Mutfak Ekranı kartına tıklayın → /business/{id}/kitchen",
          en: "Click Kitchen Display on the business hub → /business/{id}/kitchen",
        },
      },
      {
        title: { tr: "Canlı siparişleri izleyin", en: "Watch live orders" },
        description: {
          tr: "Gönderilen siparişler anlık olarak listelenir; bağlantı durumu ekranda gösterilir.",
          en: "Sent orders appear in real time; connection status is shown on screen.",
        },
      },
      {
        title: { tr: "Ürünü hazır işaretleyin", en: "Mark item ready" },
        description: {
          tr: "Hazırlanan her kalem için hazır butonuna basın.",
          en: "Press ready for each prepared item.",
        },
      },
      {
        title: { tr: "Siparişi tamamlayın", en: "Complete the order" },
        description: {
          tr: "Tüm kalemler hazır olduğunda sipariş tamamlanır ve listeden kalkar.",
          en: "When all items are ready, the order completes and leaves the list.",
        },
      },
      {
        title: { tr: "İptal işlemi", en: "Cancel items" },
        description: {
          tr: "Gerekirse tek bir kalemi veya tüm siparişi iptal edebilirsiniz.",
          en: "Cancel a single item or the entire order if needed.",
        },
      },
    ],
    tips: [
      {
        tr: "Mutfak ekranı WebSocket ile canlı güncellenir; internet bağlantısını kontrol edin.",
        en: "Kitchen display updates live via WebSocket; ensure a stable internet connection.",
      },
    ],
  },
  {
    id: "reservations",
    moduleCode: "RESERVATIONS",
    icon: CalendarDays,
    titleKey: "moduleReservations",
    descKey: "moduleReservationsDesc",
    accent: "from-teal-500/20 to-cyan-500/5",
    iconColor: "text-teal-400",
    prerequisites: {
      tr: "Rezervasyon modülü Masa Yönetimi ile birlikte çalışır; önce masalar tanımlanmalıdır.",
      en: "Reservations work with Table Management; tables must be set up first.",
    },
    steps: [
      {
        title: { tr: "Masalar sayfasına gidin", en: "Go to tables" },
        description: {
          tr: "Alan seçerek /business/{id}/areas/{areaId}/tables sayfasına gidin.",
          en: "Select an area to open /business/{id}/areas/{areaId}/tables.",
        },
      },
      {
        title: { tr: "Masayı seçin", en: "Select a table" },
        description: {
          tr: "Rezerve edilecek masayı listeden seçin (boş veya mevcut rezerveli masalar).",
          en: "Select the table to reserve from the list (empty or already reserved tables).",
        },
      },
      {
        title: { tr: "Rezervasyon notu girin", en: "Enter reservation note" },
        description: {
          tr: "Saat, kişi sayısı ve müşteri adı gibi bilgileri not alanına yazın.",
          en: "Enter time, party size, and customer name in the note field.",
        },
      },
      {
        title: { tr: "Rezervasyonu kaydedin", en: "Save reservation" },
        description: {
          tr: "Kaydet butonu ile masa durumu rezerve olarak güncellenir.",
          en: "Save to update the table status to reserved.",
        },
      },
      {
        title: { tr: "Rezervasyonu kaldırın", en: "Clear reservation" },
        description: {
          tr: "Müşteri geldiğinde veya iptal edildiğinde rezervasyonu temizleyin.",
          en: "Clear the reservation when the customer arrives or cancels.",
        },
      },
    ],
  },
  {
    id: "feedback",
    moduleCode: "FEEDBACK",
    icon: MessageSquare,
    titleKey: "moduleFeedback",
    descKey: "moduleFeedbackDesc",
    accent: "from-pink-500/20 to-rose-500/5",
    iconColor: "text-pink-400",
    steps: [
      {
        title: { tr: "Geri bildirim sayfasına gidin", en: "Go to feedback" },
        description: {
          tr: "İşletme hub'ından Müşteri Geri Bildirimleri kartına tıklayın → /business/{id}/feedback",
          en: "Click Customer Feedback on the business hub → /business/{id}/feedback",
        },
      },
      {
        title: { tr: "Geri bildirimleri görüntüleyin", en: "View feedback" },
        description: {
          tr: "Müşterilerden gelen yorum ve puanları kronolojik listede inceleyin.",
          en: "Review comments and ratings from customers in chronological order.",
        },
      },
      {
        title: { tr: "Detayları okuyun", en: "Read details" },
        description: {
          tr: "Her geri bildirimde tarih, puan ve mesaj içeriğini görüntüleyin.",
          en: "View date, rating, and message content for each feedback entry.",
        },
      },
      {
        title: { tr: "Müşteri deneyimini iyileştirin", en: "Improve customer experience" },
        description: {
          tr: "Tekrarlayan konuları tespit ederek menü veya hizmet kalitesini geliştirin.",
          en: "Identify recurring themes to improve menu or service quality.",
        },
      },
    ],
  },
  {
    id: "dashboard",
    moduleCode: "DASHBOARD",
    icon: BarChart3,
    titleKey: "moduleDashboard",
    descKey: "moduleDashboardDesc",
    accent: "from-emerald-500/20 to-green-500/5",
    iconColor: "text-emerald-400",
    steps: [
      {
        title: { tr: "Dashboard'u açın", en: "Open dashboard" },
        description: {
          tr: "İşletme hub'ından Dashboard kartına tıklayın → /business/{id}/dashboard",
          en: "Click Dashboard on the business hub → /business/{id}/dashboard",
        },
      },
      {
        title: { tr: "Dönem seçin", en: "Select period" },
        description: {
          tr: "Günlük, haftalık veya aylık rapor dönemini filtre olarak seçin.",
          en: "Choose daily, weekly, or monthly as the report period filter.",
        },
      },
      {
        title: { tr: "Grafikleri inceleyin", en: "Review charts" },
        description: {
          tr: "Satış trendi, ürün dağılımı ve ödeme yöntemi grafiklerini analiz edin.",
          en: "Analyze sales trends, product breakdown, and payment method charts.",
        },
      },
      {
        title: { tr: "Rapor indirin", en: "Download report" },
        description: {
          tr: "HTML formatında raporu indirin veya paylaşın.",
          en: "Download or share the report in HTML format.",
        },
      },
      {
        title: { tr: "Karar verin", en: "Make decisions" },
        description: {
          tr: "Verilere dayanarak menü fiyatlandırması ve stok planlaması yapın.",
          en: "Use data for menu pricing and inventory planning decisions.",
        },
      },
    ],
  },
  {
    id: "stock-management",
    moduleCode: "STOCK_MANAGEMENT",
    icon: Boxes,
    titleKey: "moduleStockManagement",
    descKey: "moduleStockManagementDesc",
    accent: "from-orange-500/20 to-amber-500/5",
    iconColor: "text-orange-400",
    steps: [
      {
        title: { tr: "Stok sayfasına gidin", en: "Go to stock" },
        description: {
          tr: "İşletme hub'ından Stok Yönetimi kartına tıklayın → /business/{id}/stock",
          en: "Click Stock Management on the business hub → /business/{id}/stock",
        },
      },
      {
        title: { tr: "Malzeme ekleyin", en: "Add materials" },
        description: {
          tr: "Yeni malzeme butonu ile ad, birim, başlangıç stoku ve minimum eşik girin.",
          en: "Use new material to enter name, unit, initial stock, and minimum threshold.",
        },
      },
      {
        title: { tr: "Stok hareketi kaydedin", en: "Record stock movement" },
        description: {
          tr: "Giriş veya çıkış hareketlerini kaydederek güncel stok miktarını takip edin.",
          en: "Record inbound or outbound movements to track current stock levels.",
        },
      },
      {
        title: { tr: "Düşük stok uyarılarını ayarlayın", en: "Configure low stock alerts" },
        description: {
          tr: "/business/{id}/stock/alerts sayfasından uyarı eşiklerini yapılandırın.",
          en: "Configure alert thresholds at /business/{id}/stock/alerts.",
        },
      },
      {
        title: { tr: "Malzemeyi düzenleyin", en: "Edit materials" },
        description: {
          tr: "Malzeme detayında /business/{id}/stock/{materialId}/edit ile bilgileri güncelleyin.",
          en: "Update details at /business/{id}/stock/{materialId}/edit from material detail.",
        },
      },
    ],
    tips: [
      {
        tr: "Stok seviyesi düşünce uyarı alırsınız; tedarik planlaması için minimum eşiği doğru ayarlayın.",
        en: "You receive alerts when stock is low; set minimum thresholds for supply planning.",
      },
    ],
  },
];

export function getLocalizedText(text: LocalizedText, language: "tr" | "en"): string {
  return text[language] ?? text.tr;
}
