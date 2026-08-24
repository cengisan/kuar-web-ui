import type { LocalizedText } from "@/config/moduleGuides";

export type LegalSection = {
  id: string;
  title: LocalizedText;
  paragraphs: LocalizedText[];
  listItems?: LocalizedText[];
};

export const LEGAL_META = {
  companyName: "Kuar",
  contactEmail: "destek@kuar.app",
  lastUpdated: { tr: "13 Haziran 2026", en: "June 13, 2026" } satisfies LocalizedText,
  governingLaw: { tr: "Türkiye Cumhuriyeti", en: "Republic of Turkey" } satisfies LocalizedText,
};

export const termsSections: LegalSection[] = [
  {
    id: "introduction",
    title: { tr: "1. Giriş", en: "1. Introduction" },
    paragraphs: [
      {
        tr: 'Bu Kullanım Şartları ("Şartlar"), Kuar markası altında sunulan restoran yönetim platformunun ("Hizmet") web sitesi ve uygulamaları üzerinden erişilen tüm özelliklerin kullanımına ilişkin kuralları belirler. Hizmeti kullanarak bu Şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.',
        en: 'These Terms of Service ("Terms") govern your use of the restaurant management platform ("Service") offered under the Kuar brand, including all features accessed through our website and applications. By using the Service, you confirm that you have read, understood, and accepted these Terms.',
      },
      {
        tr: "Bu metin hukuki danışmanlık yerine geçmez. Ticari kullanıma geçmeden önce bir hukuk uzmanına inceletmeniz önerilir.",
        en: "This document does not constitute legal advice. We recommend having it reviewed by a legal professional before commercial launch.",
      },
    ],
  },
  {
    id: "definitions",
    title: { tr: "2. Tanımlar", en: "2. Definitions" },
    paragraphs: [
      {
        tr: "Bu Şartlarda geçen ifadeler aşağıdaki anlamlara sahiptir:",
        en: "In these Terms, the following definitions apply:",
      },
    ],
    listItems: [
      {
        tr: "Kullanıcı: Hizmete kayıt olan veya Hizmeti kullanan gerçek veya tüzel kişi",
        en: "User: Any individual or legal entity that registers for or uses the Service",
      },
      {
        tr: "İşletme: Kullanıcının Hizmet üzerinden yönettiği restoran, kafe veya benzeri işletme kaydı",
        en: "Business: A restaurant, café, or similar venue record managed by the User through the Service",
      },
      {
        tr: "Abonelik: Modüler özelliklere erişim sağlayan ücretli veya deneme kapsamındaki kullanım hakkı",
        en: "Subscription: The right to access modular features under a paid plan or trial period",
      },
      {
        tr: "Modül: Dijital menü, masa yönetimi, mutfak ekranı, kasa, stok takibi gibi ayrı satın alınabilir özellikler",
        en: "Module: Separately purchasable features such as digital menu, table management, kitchen display, cashier, and stock tracking",
      },
    ],
  },
  {
    id: "scope",
    title: { tr: "3. Hizmetin Kapsamı", en: "3. Scope of the Service" },
    paragraphs: [
      {
        tr: "Kuar; restoran ve kafe işletmelerinin dijital menü, sipariş, masa, mutfak, kasa, stok ve raporlama süreçlerini yönetmelerine olanak tanıyan bulut tabanlı bir yazılım hizmetidir. Hizmetin kapsamı, satın alınan modüllere ve aktif abonelik durumuna göre belirlenir.",
        en: "Kuar is a cloud-based software service that helps restaurants and cafés manage digital menus, orders, tables, kitchen workflows, cashier operations, stock, and reporting. The scope of the Service depends on the modules purchased and the active subscription status.",
      },
      {
        tr: "Kuar, Hizmeti mevcut haliyle sunar. Kesintisiz veya hatasız çalışma taahhüdü verilmez; bakım, güncelleme veya teknik nedenlerle geçici erişim kısıtlamaları yaşanabilir.",
        en: "Kuar provides the Service on an as-is basis. Uninterrupted or error-free operation is not guaranteed; temporary access limitations may occur due to maintenance, updates, or technical issues.",
      },
    ],
  },
  {
    id: "account",
    title: { tr: "4. Hesap ve Kayıt", en: "4. Account and Registration" },
    paragraphs: [
      {
        tr: "Hizmeti kullanmak için doğru ve güncel bilgilerle hesap oluşturmanız gerekir. Hesap güvenliğinden ve hesabınız üzerinden yapılan tüm işlemlerden siz sorumlusunuz.",
        en: "You must create an account with accurate and up-to-date information to use the Service. You are responsible for account security and for all actions taken through your account.",
      },
      {
        tr: "Hesabınızı üçüncü kişilerle paylaşmamanız, yetkisiz erişimi önlemek için güçlü bir parola kullanmanız ve şüpheli bir durum fark ettiğinizde derhal bizimle iletişime geçmeniz beklenir.",
        en: "You should not share your account with third parties, use a strong password to prevent unauthorized access, and contact us immediately if you notice suspicious activity.",
      },
    ],
  },
  {
    id: "trial",
    title: { tr: "5. Ücretsiz Deneme Süresi", en: "5. Free Trial Period" },
    paragraphs: [
      {
        tr: "Yeni kullanıcılara, kayıt sonrası bir kez kullanılabilen 7 (yedi) günlük ücretsiz deneme süresi sunulabilir. Deneme süresince seçilen modüllere veya tanımlanan deneme kapsamına göre Hizmete erişim sağlanır.",
        en: "New users may receive a one-time 7 (seven) day free trial after registration. During the trial, access to the Service is provided according to the selected modules or the defined trial scope.",
      },
      {
        tr: "Deneme süresi sona erdiğinde, ücretli abonelik satın alınmadığı takdirde ilgili modüllere erişim sona erer. Deneme süresinin başlangıcı ve bitişi hesabınızda görüntülenir.",
        en: "When the trial ends, access to the relevant modules ends unless a paid subscription is purchased. The trial start and end dates are displayed in your account.",
      },
      {
        tr: "Kuar, deneme süresini, kapsamını veya uygunluk koşullarını önceden bildirmeksizin değiştirme hakkını saklı tutar.",
        en: "Kuar reserves the right to change the trial period, scope, or eligibility conditions without prior notice.",
      },
    ],
  },
  {
    id: "subscription",
    title: { tr: "6. Abonelik, Ödeme ve İade", en: "6. Subscription, Payment, and Refunds" },
    paragraphs: [
      {
        tr: "Ücretli modüller yıllık abonelik modeliyle sunulur. Satın alma işlemi tamamlandığında, ödenen abonelik süresi boyunca — abonelik bitiş tarihine kadar — ilgili modüllere erişim hakkı tanınır.",
        en: "Paid modules are offered on an annual subscription model. Once the purchase is completed, you receive access to the relevant modules for the paid subscription period — until the subscription end date.",
      },
      {
        tr: "Satın alınan aboneliklerde iptal veya iade yapılmaz. Ödeme sonrası abonelik, bitiş tarihine kadar geçerlidir ve bu süre boyunca kullanılmaya devam eder.",
        en: "Purchased subscriptions cannot be cancelled or refunded. After payment, the subscription remains valid until its end date and may be used throughout that period.",
      },
      {
        tr: "Abonelik süresi sona erdiğinde erişim otomatik olarak sona erer. Kullanıcı, dilediği zaman yeni bir abonelik satın alarak Hizmeti tekrar kullanmaya başlayabilir.",
        en: "When the subscription period ends, access automatically expires. The User may purchase a new subscription at any time to resume using the Service.",
      },
      {
        tr: "Fiyatlar, vergiler ve ödeme yöntemleri abonelik sayfasında gösterilir. Kuar, fiyatlandırmayı güncelleme hakkını saklı tutar; mevcut abonelik dönemi için ödenmiş tutarlar geriye dönük etkilenmez.",
        en: "Prices, taxes, and payment methods are shown on the subscription page. Kuar reserves the right to update pricing; amounts already paid for the current subscription period are not affected retroactively.",
      },
    ],
  },
  {
    id: "acceptable-use",
    title: { tr: "7. Kabul Edilebilir Kullanım", en: "7. Acceptable Use" },
    paragraphs: [
      {
        tr: "Hizmeti yalnızca yasal amaçlarla ve bu Şartlara uygun şekilde kullanmayı kabul edersiniz. Aşağıdaki davranışlar yasaktır:",
        en: "You agree to use the Service only for lawful purposes and in accordance with these Terms. The following conduct is prohibited:",
      },
    ],
    listItems: [
      {
        tr: "Hizmete yetkisiz erişim sağlamaya çalışmak veya güvenlik önlemlerini aşmak",
        en: "Attempting unauthorized access to the Service or bypassing security measures",
      },
      {
        tr: "Yanıltıcı, yasa dışı veya üçüncü kişilerin haklarını ihlal eden içerik yüklemek",
        en: "Uploading misleading, unlawful, or rights-infringing content",
      },
      {
        tr: "Hizmeti kötüye kullanmak, aşırı yük bindirmek veya diğer kullanıcıların erişimini engellemek",
        en: "Misusing the Service, overloading it, or blocking other users' access",
      },
      {
        tr: "Hizmeti tersine mühendislik yapmak, kopyalamak veya izinsiz yeniden satmak",
        en: "Reverse engineering, copying, or reselling the Service without permission",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: { tr: "8. Fikri Mülkiyet", en: "8. Intellectual Property" },
    paragraphs: [
      {
        tr: "Kuar adı, logosu, arayüz tasarımları, yazılım kodu ve dokümantasyon dahil olmak üzere Hizmete ilişkin tüm fikri ve sınai mülkiyet hakları Kuar'a veya lisans verenlerine aittir.",
        en: "All intellectual and industrial property rights related to the Service — including the Kuar name, logo, interface designs, software code, and documentation — belong to Kuar or its licensors.",
      },
      {
        tr: "Kullanıcıların yüklediği menü içerikleri, görseller ve işletme verileri üzerindeki haklar Kullanıcıya aittir. Kullanıcı, bu içerikleri Hizmeti sunmak amacıyla Kuar'a sınırlı bir kullanım lisansı verdiğini kabul eder.",
        en: "Users retain rights to menu content, images, and business data they upload. The User grants Kuar a limited license to use such content solely to provide the Service.",
      },
    ],
  },
  {
    id: "privacy",
    title: { tr: "9. Kişisel Veriler ve Gizlilik", en: "9. Personal Data and Privacy" },
    paragraphs: [
      {
        tr: "Kişisel verilerinizin işlenmesine ilişkin ayrıntılar Gizlilik Politikamızda açıklanmıştır. Hizmeti kullanarak Gizlilik Politikasını da kabul etmiş sayılırsınız.",
        en: "Details on how we process personal data are explained in our Privacy Policy. By using the Service, you are also deemed to have accepted the Privacy Policy.",
      },
    ],
  },
  {
    id: "changes",
    title: { tr: "10. Hizmet ve Şartlardaki Değişiklikler", en: "10. Changes to the Service and Terms" },
    paragraphs: [
      {
        tr: "Kuar, Hizmetin özelliklerini geliştirmek, güncellemek veya sonlandırmak için değişiklik yapabilir. Bu Şartlar zaman zaman güncellenebilir. Güncel metin web sitesinde yayımlandığı tarihten itibaren geçerlidir.",
        en: "Kuar may modify, update, or discontinue Service features. These Terms may be updated from time to time. The current version published on the website takes effect from its publication date.",
      },
      {
        tr: "Önemli değişikliklerde, mümkün olduğunca e-posta veya uygulama içi bildirim yoluyla bilgilendirme yapılır.",
        en: "For material changes, we will notify you by email or in-app notification where reasonably possible.",
      },
    ],
  },
  {
    id: "liability",
    title: { tr: "11. Sorumluluk Sınırlaması", en: "11. Limitation of Liability" },
    paragraphs: [
      {
        tr: "Kuar, yürürlükteki zorunlu hükümler saklı kalmak kaydıyla, Hizmetin kullanımından doğan dolaylı zararlar, kar kaybı, veri kaybı veya iş kesintisi dahil olmak üzere sınırlı sorumlulukla hareket eder.",
        en: "Subject to mandatory legal provisions, Kuar's liability for indirect damages, loss of profit, data loss, or business interruption arising from use of the Service is limited.",
      },
      {
        tr: "Kullanıcı, menü fiyatları, stok bilgileri, sipariş ve ödeme kayıtlarının doğruluğunu kontrol etmekten sorumludur.",
        en: "The User is responsible for verifying the accuracy of menu prices, stock information, order records, and payment data.",
      },
    ],
  },
  {
    id: "termination",
    title: { tr: "12. Hesabın Askıya Alınması veya Sonlandırılması", en: "12. Suspension or Termination of Account" },
    paragraphs: [
      {
        tr: "Kuar, bu Şartların ihlali, yasa dışı kullanım veya güvenlik riski tespit edilmesi halinde hesabı askıya alabilir veya sonlandırabilir.",
        en: "Kuar may suspend or terminate an account in case of a breach of these Terms, unlawful use, or detected security risks.",
      },
      {
        tr: "Kullanıcı, hesap silme talebini uygulama içinden iletebilir. Hesap silme süreçleri ve veri saklama uygulamaları Gizlilik Politikasında açıklanır.",
        en: "The User may request account deletion from within the application. Account deletion processes and data retention practices are described in the Privacy Policy.",
      },
    ],
  },
  {
    id: "governing-law",
    title: { tr: "13. Uygulanacak Hukuk ve Uyuşmazlık", en: "13. Governing Law and Disputes" },
    paragraphs: [
      {
        tr: "Bu Şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda Kocaeli mahkeme ve icra daireleri yetkilidir.",
        en: "These Terms are governed by the laws of the Republic of Turkey. Kocaeli courts and enforcement offices have jurisdiction over disputes.",
      },
    ],
  },
  {
    id: "contact",
    title: { tr: "14. İletişim", en: "14. Contact" },
    paragraphs: [
      {
        tr: `Bu Şartlarla ilgili sorularınız için ${LEGAL_META.contactEmail} adresinden bizimle iletişime geçebilirsiniz.`,
        en: `For questions about these Terms, contact us at ${LEGAL_META.contactEmail}.`,
      },
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    id: "controller",
    title: { tr: "1. Veri Sorumlusu", en: "1. Data Controller" },
    paragraphs: [
      {
        tr: `Bu Gizlilik Politikası, ${LEGAL_META.companyName} ("biz", "Kuar") tarafından sunulan Hizmet kapsamında işlenen kişisel verilere ilişkindir.`,
        en: `This Privacy Policy describes how personal data is processed within the Service provided by ${LEGAL_META.companyName} ("we", "Kuar").`,
      },
      {
        tr: `Veri sorumlusu iletişim adresi: ${LEGAL_META.contactEmail}`,
        en: `Data controller contact: ${LEGAL_META.contactEmail}`,
      },
      {
        tr: "Bu metin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanmış bir bilgilendirme taslağıdır ve hukuki danışmanlık yerine geçmez.",
        en: "This document is a draft notice prepared under Turkish Law No. 6698 on the Protection of Personal Data (KVKK) and does not constitute legal advice.",
      },
    ],
  },
  {
    id: "data-categories",
    title: { tr: "2. İşlenen Kişisel Veriler", en: "2. Personal Data Processed" },
    paragraphs: [
      {
        tr: "Hizmet kapsamında aşağıdaki kişisel veri kategorileri işlenebilir:",
        en: "The following categories of personal data may be processed within the Service:",
      },
    ],
    listItems: [
      {
        tr: "Kimlik ve iletişim bilgileri (ad, e-posta)",
        en: "Identity and contact information (name, email)",
      },
      {
        tr: "Hesap ve kimlik doğrulama bilgileri (parola özeti, oturum bilgileri, sosyal giriş verileri)",
        en: "Account and authentication data (password hash, session data, social login data)",
      },
      {
        tr: "İşletme ve operasyon verileri (işletme adı, menü, ürün, sipariş, stok, çalışan kayıtları)",
        en: "Business and operational data (business name, menu, products, orders, stock, employee records)",
      },
      {
        tr: "Ödeme ve abonelik bilgileri (abonelik durumu, işlem kayıtları; kart bilgileri ödeme kuruluşunda saklanır)",
        en: "Payment and subscription data (subscription status, transaction records; card data is stored at the payment provider)",
      },
      {
        tr: "Teknik veriler (IP adresi, cihaz bilgisi, tarayıcı türü, kullanım logları)",
        en: "Technical data (IP address, device information, browser type, usage logs)",
      },
    ],
  },
  {
    id: "purposes",
    title: { tr: "3. İşleme Amaçları", en: "3. Purposes of Processing" },
    paragraphs: [
      {
        tr: "Kişisel verileriniz aşağıdaki amaçlarla işlenir:",
        en: "Your personal data is processed for the following purposes:",
      },
    ],
    listItems: [
      {
        tr: "Hesap oluşturma, kimlik doğrulama ve Hizmet sunumu",
        en: "Account creation, authentication, and provision of the Service",
      },
      {
        tr: "Abonelik, deneme süresi ve ödeme süreçlerinin yürütülmesi",
        en: "Managing subscriptions, trial periods, and payment processes",
      },
      {
        tr: "Müşteri desteği ve kullanıcı taleplerinin yanıtlanması",
        en: "Customer support and responding to user requests",
      },
      {
        tr: "Hizmet güvenliği, dolandırıcılık önleme ve sistem performansının izlenmesi",
        en: "Service security, fraud prevention, and monitoring system performance",
      },
      {
        tr: "Yasal yükümlülüklerin yerine getirilmesi",
        en: "Fulfilling legal obligations",
      },
    ],
  },
  {
    id: "legal-basis",
    title: { tr: "4. Hukuki Sebepler", en: "4. Legal Bases" },
    paragraphs: [
      {
        tr: "Kişisel verileriniz KVKK'nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayanılarak işlenir; bunlar arasında sözleşmenin kurulması veya ifası, hukuki yükümlülük, meşru menfaat ve açık rıza yer alabilir.",
        en: "Personal data is processed based on legal grounds under Articles 5 and 6 of the KVKK, including contract formation or performance, legal obligation, legitimate interest, and explicit consent where applicable.",
      },
    ],
  },
  {
    id: "transfer",
    title: { tr: "5. Veri Aktarımı", en: "5. Data Transfers" },
    paragraphs: [
      {
        tr: "Verileriniz; barındırma, ödeme, kimlik doğrulama ve teknik altyapı hizmeti sunan iş ortaklarımızla, yalnızca Hizmetin sunulması için gerekli ölçüde paylaşılabilir.",
        en: "Your data may be shared with hosting, payment, authentication, and infrastructure partners only to the extent necessary to provide the Service.",
      },
      {
        tr: "Yurt dışına veri aktarımı söz konusu olduğunda, KVKK'ya uygun güvenceler sağlanması hedeflenir.",
        en: "Where international data transfers occur, safeguards compliant with the KVKK are intended to be applied.",
      },
    ],
  },
  {
    id: "retention",
    title: { tr: "6. Saklama Süreleri", en: "6. Retention Periods" },
    paragraphs: [
      {
        tr: "Kişisel veriler, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri kadar saklanır. Hesap silme talebi sonrasında, yasal saklama yükümlülükleri hariç, veriler makul süre içinde silinir veya anonimleştirilir.",
        en: "Personal data is retained for as long as required by the processing purpose and applicable statutory limitation periods. After an account deletion request, data is deleted or anonymized within a reasonable period, except where legal retention obligations apply.",
      },
    ],
  },
  {
    id: "rights",
    title: { tr: "7. KVKK Kapsamındaki Haklarınız", en: "7. Your Rights under the KVKK" },
    paragraphs: [
      {
        tr: "KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:",
        en: "Under Article 11 of the KVKK, you have the following rights:",
      },
    ],
    listItems: [
      {
        tr: "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
        en: "To learn whether your personal data is being processed",
      },
      {
        tr: "İşlenmişse buna ilişkin bilgi talep etme",
        en: "To request information if it has been processed",
      },
      {
        tr: "Amacına uygun kullanılıp kullanılmadığını öğrenme",
        en: "To learn whether it is used in line with its purpose",
      },
      {
        tr: "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
        en: "To know third parties to whom it is transferred domestically or abroad",
      },
      {
        tr: "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
        en: "To request correction if incomplete or inaccurate",
      },
      {
        tr: "KVKK'ya uygun şartlarda silinmesini veya yok edilmesini isteme",
        en: "To request deletion or destruction under KVKK conditions",
      },
      {
        tr: "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
        en: "To object to results against you arising solely from automated analysis",
      },
      {
        tr: "Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
        en: "To claim compensation for damages due to unlawful processing",
      },
    ],
  },
  {
    id: "cookies",
    title: { tr: "8. Çerezler ve Benzer Teknolojiler", en: "8. Cookies and Similar Technologies" },
    paragraphs: [
      {
        tr: "Web sitesinde oturum yönetimi, dil tercihi ve güvenlik amaçlı çerezler veya yerel depolama kullanılabilir. Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz; bazı çerezlerin devre dışı bırakılması Hizmetin çalışmasını etkileyebilir.",
        en: "The website may use cookies or local storage for session management, language preference, and security. You can manage cookie preferences in your browser settings; disabling some cookies may affect Service functionality.",
      },
    ],
  },
  {
    id: "security",
    title: { tr: "9. Güvenlik", en: "9. Security" },
    paragraphs: [
      {
        tr: "Kişisel verilerinizi korumak için erişim kontrolü, şifreleme ve güvenli altyapı önlemleri uygulanır. Hiçbir sistem %100 güvenli değildir; bu nedenle hesap bilgilerinizi gizli tutmanız önemlidir.",
        en: "We apply access controls, encryption, and secure infrastructure measures to protect personal data. No system is 100% secure; keeping your account credentials confidential is important.",
      },
    ],
  },
  {
    id: "children",
    title: { tr: "10. Çocukların Verileri", en: "10. Children's Data" },
    paragraphs: [
      {
        tr: "Hizmet, 18 yaşın altındaki kişilere yönelik değildir. Bilerek reşit olmayanlardan kişisel veri toplanmaz.",
        en: "The Service is not directed at individuals under 18. We do not knowingly collect personal data from minors.",
      },
    ],
  },
  {
    id: "privacy-changes",
    title: { tr: "11. Politika Değişiklikleri", en: "11. Policy Changes" },
    paragraphs: [
      {
        tr: "Bu Gizlilik Politikası güncellenebilir. Güncel sürüm web sitesinde yayımlandığı tarihten itibaren geçerlidir.",
        en: "This Privacy Policy may be updated. The current version takes effect from its publication date on the website.",
      },
    ],
  },
  {
    id: "privacy-contact",
    title: { tr: "12. İletişim ve Başvuru", en: "12. Contact and Requests" },
    paragraphs: [
      {
        tr: `KVKK kapsamındaki taleplerinizi ${LEGAL_META.contactEmail} adresine iletebilirsiniz. Başvurularınız, mevzuatta öngörülen süreler içinde yanıtlanır.`,
        en: `You may send KVKK-related requests to ${LEGAL_META.contactEmail}. Requests will be answered within the periods required by law.`,
      },
    ],
  },
];
