import Link from "next/link";
import Logo from "./Logo";
import { GROUPS } from "@/data/products";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="mt-16 bg-marino text-menta">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Logo light />
          <p className="text-sm leading-relaxed">
            Productos de limpieza para tu hogar y negocio. Venta online con atención por WhatsApp
            y delivery — sin tienda física.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-display font-bold text-white">Tienda</p>
          {GROUPS.map((g) => (
            <Link key={g.id} href={`/catalogo?grupo=${g.id}`} className="hover:text-white">
              {g.label}
            </Link>
          ))}
          <Link href="/packs" className="hover:text-white">Packs</Link>
          <Link href="/mayoristas" className="hover:text-white">Mayoristas</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-display font-bold text-white">Ayuda</p>
          <Link href="/contacto#preguntas" className="hover:text-white">Preguntas frecuentes</Link>
          <Link href="/contacto" className="hover:text-white">Contacto</Link>
          <Link href="/nosotros" className="hover:text-white">Nosotros</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-display font-bold text-white">Atención</p>
          <p>Lunes a sábado, 9am – 7pm</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            WhatsApp 976 509 570
          </a>
          <p>Yape · Transferencia · Efectivo</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-menta/80">
          © {new Date().getFullYear()} Clean Home. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
