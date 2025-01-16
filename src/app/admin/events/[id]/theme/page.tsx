import ThemeEditor from "./theme-editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Tema",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ThemePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <ThemeEditor eventId={id} />
    </div>
  );
}
