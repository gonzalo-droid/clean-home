export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-sky-600">Clean Home</p>
            <p className="mt-2">Productos de limpieza para tu hogar y negocio.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Contacto</p>
            <p className="mt-2">WhatsApp: 976 509 570</p>
            <p>Pedidos coordinados por WhatsApp</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Métodos de pago</p>
            <p className="mt-2">Yape · Transferencia · Efectivo</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-slate-400">
          © {new Date().getFullYear()} Clean Home. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
