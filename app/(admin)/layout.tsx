import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/clerk";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <header className="bg-white border-b border-[#E5E5E5]">
        {/* Fila 1: logo + botón nuevo */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-lg font-bold">
              V&V <span className="text-[#C9A84C]">Phone</span>
            </Link>
            <span className="text-xs bg-[#C9A84C]/10 text-[#A6862A] font-semibold px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <Link
            href="/admin/nuevo"
            className="bg-[#C9A84C] text-white px-4 py-1.5 rounded-lg hover:bg-[#A6862A] transition-colors text-sm font-medium"
          >
            + Nuevo
          </Link>
        </div>

        {/* Fila 2: navegación */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 border-t border-[#E5E5E5]">
          <nav className="flex gap-1">
            {[
              { href: "/admin", label: "Teléfonos" },
              { href: "/admin/configuracion", label: "Configuración" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2.5 text-sm font-medium text-[#666666] hover:text-[#111111] border-b-2 border-transparent hover:border-[#C9A84C] transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">{children}</main>
    </div>
  );
}
