import { Logo } from "@/components/marketing/Logo";
import { ChefHat, LayoutGrid, Sparkles } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <div className="relative hidden overflow-hidden lg:flex lg:w-[45%] xl:w-[42%]">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="relative flex flex-col justify-between p-10 xl:p-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-muted px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Restoran yönetim platformu
            </div>
            <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
              Operasyonlarınızı{" "}
              <span className="gradient-text">tek ekrandan</span> yönetin
            </h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Dijital menü, masa takibi, mutfak ekranı ve kasa — mobil uygulama ile aynı
              güçlü özellikler.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: LayoutGrid, text: "Gerçek zamanlı masa ve sipariş yönetimi" },
                { icon: ChefHat, text: "Mutfak ekranı ile anlık sipariş akışı" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-muted text-primary">
                    <Icon className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Kuar</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        <div className="mb-8 w-full max-w-md text-center lg:text-left">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo href="/" size="md" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
