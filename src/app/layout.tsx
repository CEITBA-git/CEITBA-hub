import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CEITBA Hub",
  description: "Portal central del Centro de Estudiantes ITBA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
