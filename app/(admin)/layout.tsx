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
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-lg font-bold">
              V&V <span className="text-[#C9A84C]">Phone</span>
            </Link>
            <span className="ml-3 text-xs bg-[#C9A84C]/10 text-[#A6862A] font-semibold px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-[#666666] hover:text-[#111111] transition-colors">
              Teléfonos
            </Link>
            <Link href="/admin/nuevo" className="bg-[#C9A84C] text-white px-4 py-1.5 rounded-lg hover:bg-[#A6862A] transition-colors font-medium">
              + Nuevo
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
