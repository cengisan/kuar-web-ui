import { operationsStack } from "@/config/landingContent";

export function LandingOperationsStack() {
  return (
    <section className="landing-section bg-muted/20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="landing-eyebrow">Operasyon katmanı</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          Veriden değil, operasyondan içgörüye giden tek akış
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Kuar, restoranınızın tüm katmanlarını birbirine bağlar. Menüden rapora kadar her adım aynı
          platformda ilerler.
        </p>

        <div className="mt-14 overflow-x-auto pb-2">
          <div className="flex min-w-max items-stretch gap-3 md:min-w-0 md:grid md:grid-cols-5 md:gap-4">
            {operationsStack.map((step, index) => (
              <div key={step.label} className="relative flex w-44 flex-col md:w-auto">
                <div className="landing-stack-card flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{step.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
                {index < operationsStack.length - 1 && (
                  <div
                    className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rounded-full border border-primary/30 bg-background md:block"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
