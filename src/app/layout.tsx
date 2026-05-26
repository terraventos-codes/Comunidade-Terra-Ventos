import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Terra Ventos - Investimento Imobiliário no Litoral do Ceará",
  description:
    "Comunidade exclusiva de investidores, kitesurfistas e amantes do litoral nordestino.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} w-full max-w-full overflow-x-hidden`}
      >
        <LanguageProvider>{children}</LanguageProvider>


      </body>
    </html>
  );
}
