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
          <div className="mt-1 flex gap-3">
            <a href="#" aria-label="Facebook" className="text-menta/80 transition hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-menta/80 transition hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            </a>
          </div>
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
