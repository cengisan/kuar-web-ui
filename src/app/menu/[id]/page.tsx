import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { fetchPublicMenu } from "@/data/repositories/PublicMenuRepositoryImpl";
import { selectThemeComponent } from "@/components/menu";

interface MenuPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchPublicMenu(id);
  if (!data) return { title: "Menü" };
  return {
    title: data.name,
    description: `${data.name} dijital menüsü`,
  };
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { id } = await params;
  const data = await fetchPublicMenu(id);

  if (!data) {
    notFound();
  }

  if (!data.digitalMenu.is_available) {
    redirect(`/menu/${id}/unavailable`);
  }

  const ThemeComponent = selectThemeComponent(data.theme ?? "menu1");

  return <ThemeComponent menuId={id} data={data} />;
}
