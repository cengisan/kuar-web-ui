import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { HomeHashCleanup } from "@/components/marketing/HomeHashCleanup";
import { HeroDeviceShowcase } from "@/components/marketing/mockups/HeroDeviceShowcase";
import { LandingCapabilities } from "@/components/marketing/landing/LandingCapabilities";
import { LandingOperationsStack } from "@/components/marketing/landing/LandingOperationsStack";
import { LandingPlatformPreview } from "@/components/marketing/landing/LandingPlatformPreview";
import { RotatingHighlight } from "@/components/marketing/landing/RotatingHighlight";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Store,
} from "lucide-react";
import {
  heroRotatingWords,
  landingStats,
  landingSteps,
} from "@/config/landingContent";

export default function LandingPage() {
  return (
    <>
      <HomeHashCleanup />
      <PublicHeader />
      <main className="flex-1">
        {/* Hero — Mode-style split headline + product preview */}
        <section className="relative overflow-x-hidden">
          <div className="absolute inset-0 landing-hero-bg" />
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-24 pt-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 lg:pb-32 lg:pt-24 xl:gap-12">
            <div className="text-center lg:text-left">
              <p className="landing-eyebrow animate-fade-up">Modern restoran yönetimi</p>
              <h1 className="animate-fade-up mt-5 text-[2.75rem] font-semibold leading-[1.02] tracking-tight md:text-6xl xl:text-[4.25rem]">
                Restoran yönetimi
                <br />
                tek platformda
                <br />
                <RotatingHighlight words={heroRotatingWords} className="mt-1" />
              </h1>
              <p className="animate-fade-up-delay-1 mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0 md:text-xl">
                Kuar; dijital menüden mutfak ekranına, kasadan stok takibine kadar tüm operasyonları
                tek merkezde birleştirir. Mobil uygulama ile aynı güç, artık web&apos;de.
              </p>
              <div className="animate-fade-up-delay-2 mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-glow">
                  <Link href="/register">
                    Ücretsiz Başla
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full px-8 glass-panel"
                >
                  <Link href="/features">Platformu keşfet</Link>
                </Button>
              </div>
            </div>

            <HeroDeviceShowcase className="animate-fade-up-delay-2 w-full min-w-0 lg:max-w-[640px] lg:justify-self-end xl:max-w-[700px]" />
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-border/60 bg-muted/15">
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 px-6 py-14 md:gap-10">
            {landingStats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="text-3xl font-semibold tracking-tight gradient-text md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <LandingCapabilities />

        <LandingPlatformPreview />

        {/* Split narrative — Mode "Made for..." pattern */}
        <section className="landing-section">
          <div className="mx-auto max-w-7xl px-6">
            <p className="landing-eyebrow">Operasyondan içgörüye</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Veriyi toplamaktan öte, ekibinizin hızına göre tasarlandı
            </h2>

            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <article className="landing-narrative-card rounded-[1.75rem] border border-border/70 bg-card/60 p-8 md:p-10">
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Store className="size-6" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">İşletme sahipleri için</h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Günlük operasyonu tek ekrandan yönetin. Menü güncellemeleri, masa durumu, kasa kapanışı
                  ve satış raporları arasında geçiş yapmadan karar alın.
                </p>
              </article>

              <article className="landing-narrative-card rounded-[1.75rem] border border-border/70 bg-card/60 p-8 md:p-10">
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Users className="size-6" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">Ekibiniz için</h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Servis, mutfak ve kasa ekipleri kendi akışlarında çalışsın. Her rol doğru ekranı
                  görsün; veri tek kaynaktan güncellensin, iletişim maliyeti düşsün.
                </p>
              </article>
            </div>
          </div>
        </section>

        <LandingOperationsStack />

        {/* How it works */}
        <section className="landing-section border-t border-border/60">
          <div className="mx-auto max-w-7xl px-6">
            <p className="landing-eyebrow">Başlangıç</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Dakikalar içinde kurulum
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {landingSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border/60 bg-card/50 p-6 md:p-8"
                >
                  <span className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
                    Adım {item.step}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA — Mode closing band */}
        <section className="landing-section pb-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card px-8 py-14 md:px-16 md:py-20">
              <div className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative mx-auto max-w-3xl text-center">
                <p className="landing-eyebrow justify-center">Kuar ile tanışın</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
                  Bildiğiniz restoran yazılımının ötesinde
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Ücretsiz kayıt olun, işletmenizi oluşturun ve dakikalar içinde yönetmeye başlayın.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Zap className="size-4 text-primary" />
                    Hızlı kurulum
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    Güvenli altyapı
                  </span>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-glow">
                    <Link href="/register">
                      Ücretsiz Başla
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-8">
                    <Link href="/login">Giriş Yap</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
