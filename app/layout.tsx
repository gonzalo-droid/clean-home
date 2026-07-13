import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://clean-home.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Clean Home | Productos de limpieza",
    template: "%s | Clean Home",
  },
  description:
    "Catálogo de productos de limpieza: detergentes, papel higiénico, papel toalla, bolsas y accesorios. Pedidos por WhatsApp.",
  openGraph: {
    title: "Clean Home | Productos de limpieza",
    description: "Catálogo de productos de limpieza con pedidos por WhatsApp.",
    url: SITE_URL,
    siteName: "Clean Home",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-white text-slate-800 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Clean Home",
              description: "Venta de productos de limpieza con pedidos por WhatsApp.",
              telephone: "+51976509570",
              priceRange: "S/",
              areaServed: "PE",
            }),
          }}
        />
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
