"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { landingCapabilities } from "@/config/landingContent";

export function LandingCapabilities() {
  const [activeId, setActiveId] = useState(landingCapabilities[0].id);
  const active =
    landingCapabilities.find((item) => item.id === activeId) ?? landingCapabilities[0];

  return (
    <section className="landing-section border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <p className="landing-eyebrow">Güvenebileceğiniz modüller</p>
        <div className="mt-4 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            İşletmeniz için ihtiyacınız olan her şey, tek platformda
          </h2>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent"
          >
            Tüm modülleri incele
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div
          className={cn(
            "mt-14 grid gap-8",
            active.slide && "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12",
          )}
        >
          <div className="space-y-2">
            {landingCapabilities.map((capability) => {
              const isActive = capability.id === activeId;
              const Icon = capability.icon;

              return (
                <button
                  key={capability.id}
                  type="button"
                  onClick={() => setActiveId(capability.id)}
                  className={cn(
                    "group w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                    isActive
                      ? "border-primary/30 bg-primary/5 shadow-[0_0_0_1px_rgba(34,197,94,0.08)]"
                      : "border-transparent bg-transparent hover:border-border hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{capability.title}</h3>
                      <p
                        className={cn(
                          "mt-1 text-sm leading-relaxed transition-colors",
                          isActive ? "text-muted-foreground" : "text-muted-foreground/80",
                        )}
                      >
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {active.slide && (
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-card shadow-card">
                <div className="border-b border-border/60 px-5 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {active.title}
                  </p>
                </div>
                <div className="relative aspect-[4/5] w-full bg-muted/20 sm:aspect-[5/4]">
                  <Image
                    key={active.slide}
                    src={active.slide}
                    alt={active.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-contain p-4 landing-capability-image"
                    priority
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
