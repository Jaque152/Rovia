import "../globals.css";
import { ClientBody } from "@/app/ClientBody";
import { ReactNode } from "react";
import type { Metadata } from "next";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Tripnova | Tu Próxima Gran Aventura",
  description: "Curamos itinerarios a la medida y experiencias inolvidables. Descubre el mundo con el respaldo y la innovación de Tripnova.",
};

export default async function RootLayout({
  children,
  params
}: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <html lang={locale}>
      <ClientBody locale={locale}>
        {children}
      </ClientBody>
    </html>
  );
}