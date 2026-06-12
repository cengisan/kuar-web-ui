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
      tr: "Ana sayfadan yeni işletme oluşturun. İlk işletmeniz ücretsizdir.",
      en: "Create a new business from the home page. Your first business is free.",
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
          tr: "İşletme sahibi hesabınızla giriş yapın.",
          en: "Sign in with your owner account.",
        },
      },
      {
        title: { tr: "Ana sayfaya gidin", en: "Go to the home page" },
        description: {
          tr: "Giriş sonrası ana sayfaya yönlendirilirsiniz; işletmeleriniz burada listelenir.",
          en: "After sign-in you land on the home page where your businesses are listed.",
        },
      },
      {
        title: { tr: "Modülü satın alın", en: "Purchase the module" },
        description: {
          tr: "Ek işletme açmak için Abonelik sayfasından İşletme Oluştur modülünü satın alın. İlk işletme ücretsizdir.",
          en: "To add more businesses, purchase the Create Business module from Subscription. Your first business is free.",
        },
      },
      {
        title: { tr: "İşletme oluşturun", en: "Create a business" },
        description: {
          tr: "Ana sayfadaki yeni işletme butonuna tıklayın, işletme adı ve açıklamasını girin, kaydedin.",
          en: "On the home page, tap create business, enter name and description, then save.",
        },
      },
      {
        title: { tr: "İşletme sayfasını açın", en: "Open your business page" },
        description: {
          tr: "Oluşturduğunuz işletmeye tıklayarak modül kartlarının bulunduğu işletme sayfasına ulaşın.",
          en: "Click your business to open its page with all module cards.",
        },
      },
      {
        title: { tr: "Profili düzenleyin", en: "Edit your profile" },
        description: {
          tr: "İşletme sayfasındaki düzenle ikonu ile ad ve açıklamayı güncelleyebilirsiniz.",
          en: "Use the edit icon on the business page to update name and description.",
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
        title: { tr: "Menüler bölümüne gidin", en: "Open menus" },
        description: {
          tr: "İşletme sayfasından Dijital Menü kartına tıklayın.",
          en: "Click Digital Menu on your business page.",
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
        title: { tr: "Ürünler bölümüne gidin", en: "Open products" },
        description: {
          tr: "İşletme sayfasından Ürünler kartına tıklayın.",
          en: "Click Products on your business page.",
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
          tr: "Listeden bir ürüne tıklayarak düzenleme ekranında bilgileri güncelleyin.",
          en: "Click a product in the list to update it on the edit screen.",
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
        title: { tr: "Çalışanlar bölümüne gidin", en: "Open employees" },
        description: {
          tr: "İşletme sayfasından Çalışanlarım kartına tıklayın.",
          en: "Click My Employees on your business page.",
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
          tr: "Oluşturulan erişim kodunu çalışanıza verin; çalışan giriş ekranından hesabına erişir.",
          en: "Give the generated access code to your employee; they sign in via the employee login screen.",
        },
      },
      {
        title: { tr: "Çalışanı düzenleyin", en: "Edit employees" },
        description: {
          tr: "Yetki değişiklikleri için çalışan düzenleme ekranını kullanın.",
          en: "Use the employee edit screen to change roles and permissions.",
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
        title: { tr: "Masa yönetimine gidin", en: "Open table management" },
        description: {
          tr: "İşletme sayfasından Masa Yönetimi kartına tıklayın.",
          en: "Click Table Management on your business page.",
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
          tr: "Boş bir masaya tıklayın, sipariş ekranından ürün ekleyin.",
          en: "Tap an empty table and add items from the order screen.",
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
          tr: "İşletme sayfasından Kasa kartına tıklayın veya dolu masadan kasa moduna geçin.",
          en: "Click Cashier on your business page or switch to cashier mode from an occupied table.",
        },
      },
      {
        title: { tr: "Masayı seçin", en: "Select a table" },
        description: {
          tr: "Ödeme alınacak dolu masayı listeden seçin.",
          en: "Select the occupied table you want to bill from the list.",
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
          tr: "İşletme sayfasından Mutfak Ekranı kartına tıklayın.",
          en: "Click Kitchen Display on your business page.",
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
        tr: "Mutfak ekranı canlı güncellenir; kesintisiz internet bağlantısı önerilir.",
        en: "The kitchen display updates live; a stable internet connection is recommended.",
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
        title: { tr: "Masalar ekranına gidin", en: "Open tables" },
        description: {
          tr: "Masa Yönetimi bölümünden bir alan seçerek masalar listesine gidin.",
          en: "From Table Management, select an area to open the tables list.",
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
        title: { tr: "Geri bildirim bölümüne gidin", en: "Open feedback" },
        description: {
          tr: "İşletme sayfasından Müşteri Geri Bildirimleri kartına tıklayın.",
          en: "Click Customer Feedback on your business page.",
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
        title: { tr: "Dashboard modülünü açın", en: "Open the Dashboard module" },
        description: {
          tr: "İşletme sayfasından Dashboard kartına tıklayın.",
          en: "Click Dashboard on your business page.",
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
        title: { tr: "Stok bölümüne gidin", en: "Open stock management" },
        description: {
          tr: "İşletme sayfasından Stok Yönetimi kartına tıklayın.",
          en: "Click Stock Management on your business page.",
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
          tr: "Stok uyarıları ekranından eşik değerlerini yapılandırın.",
          en: "Configure threshold values from the stock alerts screen.",
        },
      },
      {
        title: { tr: "Malzemeyi düzenleyin", en: "Edit materials" },
        description: {
          tr: "Malzeme detayından düzenleme ekranı ile bilgileri güncelleyin.",
          en: "Update material details from the edit screen on the material detail page.",
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
