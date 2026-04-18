import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold">
              V&V <span className="text-[#C9A84C]">Phone</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Teléfonos de segunda mano con calidad garantizada
            </p>
          </div>
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
            <Link href="/favoritos" className="hover:text-white transition-colors">Favoritos</Link>
          </nav>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} V&V Phone. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
