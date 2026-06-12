import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { HomeHashCleanup } from "@/components/marketing/HomeHashCleanup";
import { HeroSlideCarousel } from "@/components/marketing/HeroSlideCarousel";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  LayoutGrid,
  ChefHat,
  CreditCard,
  Package,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    id: "digital-menu",
    icon: UtensilsCrossed,
    title: "Dijital Menü",
    description: "QR kod ile müşterilerinize dijital menü sunun, anında güncelleyin.",
    accent: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-400",
  },
  {
    id: "table-management",
    icon: LayoutGrid,
    title: "Masa Yönetimi",
    description: "Masalarınızı takip edin, siparişleri anında alın.",
    accent: "from-cyan-500/20 to-blue-500/5",
    iconColor: "text-cyan-400",
  },
  {
    id: "kitchen-display",
    icon: ChefHat,
    title: "Mutfak Ekranı",
    description: "Siparişleri canlı olarak mutfağa iletin, hazırlık sürecini yönetin.",
    accent: "from-red-500/20 to-rose-500/5",
    iconColor: "text-red-400",
  },
  {
    id: "cash-register",
    icon: CreditCard,
    title: "Kasa",
    description: "Ödeme alın, adisyon kapatın, günlük ciroyu takip edin.",
    accent: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-400",
  },
  {
    id: "stock-management",
    icon: Package,
    title: "Stok Takibi",
    description: "Malzeme stoklarınızı yönetin, düşük stok uyarıları alın.",
    accent: "from-orange-500/20 to-amber-500/5",
    iconColor: "text-orange-400",
  },
  {
    id: "dashboard",
    icon: BarChart3,
    title: "Dashboard",
    description: "Satış raporları ve işletme performansını analiz edin.",
    accent: "from-emerald-500/20 to-green-500/5",
    iconColor: "text-emerald-400",
  },
];

const stats = [
  { value: "7/24", label: "Canlı operasyon" },
  { value: "1", label: "Platform, tüm modüller" },
  { value: "∞", label: "Ürün & menü kapasitesi" },
];

const steps = [
  { step: "01", title: "Kayıt ol", desc: "Dakikalar içinde hesabınızı oluşturun." },
  { step: "02", title: "İşletmenizi ekleyin", desc: "Menü, ürün ve masalarınızı tanımlayın." },
  { step: "03", title: "Yönetmeye başlayın", desc: "Sipariş, mutfak ve kasa akışını tek yerden yönetin." },
];

export default function LandingPage() {
  return (
    <>
      <HomeHashCleanup />
      <PublicHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-mesh" />
          <div className="absolute inset-0 grid-pattern" />
          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pb-32 md:pt-24">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="animate-fade-up text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Restoranınızı{" "}
                <span className="gradient-text">Kuar</span> ile yönetin
              </h1>
              <p className="animate-fade-up-delay-1 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Dijital menüden mutfak ekranına, kasadan stok takibine kadar tüm operasyonlarınızı
                tek platformda yönetin. Mobil uygulama ile aynı güçlü özellikler, artık web&apos;de.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="shadow-glow">
                  <Link href="/register">
                    Ücretsiz Başla
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="glass-panel">
                  <Link href="/login">Giriş Yap</Link>
                </Button>
              </div>
            </div>

            <HeroSlideCarousel />
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold gradient-text md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                İşletmeniz için ihtiyacınız olan her şey
              </h2>
              <p className="mt-4 text-muted-foreground">
                Modüler yapı sayesinde ihtiyacınız olan özellikleri seçin, büyüdükçe genişletin.
              </p>
            </div>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  href={`/features#${feature.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div
                      className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-muted ${feature.iconColor}`}
                    >
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/features">
                  Tüm modülleri incele
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-muted/20 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Nasıl çalışır?</h2>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="relative text-center md:text-left">
                  <span className="text-5xl font-bold text-primary/20">{item.step}</span>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust + CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-10 md:p-16">
              <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative mx-auto max-w-2xl text-center">
                <div className="mb-6 flex justify-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="size-4 text-primary" />
                    Hızlı kurulum
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="size-4 text-primary" />
                    Güvenli altyapı
                  </div>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  Restoranınızı bugün dijitalleştirin
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Ücretsiz kayıt olun, işletmenizi oluşturun ve dakikalar içinde yönetmeye başlayın.
                </p>
                <Button asChild size="lg" className="mt-8 shadow-glow">
                  <Link href="/register">
                    Hemen Başla
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
