"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Home, BookOpen, LayoutDashboard } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useState } from "react";

export function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const [cartOpen, setCartOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/catalogo", label: "Catálogo", icon: BookOpen },
    { href: "/favoritos", label: "Favoritos", icon: Heart },
  ];

  return (
    <>
      {/* Desktop top navbar */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#111111] tracking-tight">
            V&V <span className="text-[#C9A84C]">Phone</span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-[#C9A84C]" : "text-[#666666] hover:text-[#111111]"}`}>
              Inicio
            </Link>
            <Link href="/catalogo" className={`text-sm font-medium transition-colors ${pathname.startsWith("/catalogo") ? "text-[#C9A84C]" : "text-[#666666] hover:text-[#111111]"}`}>
              Catálogo
            </Link>
            {isAdmin && (
              <Link href="/admin" className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${pathname.startsWith("/admin") ? "text-[#C9A84C]" : "text-[#666666] hover:text-[#111111]"}`}>
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/favoritos" aria-label="Favoritos">
              <Heart className={`w-5 h-5 transition-colors ${pathname === "/favoritos" ? "text-[#C9A84C]" : "text-[#666666] hover:text-[#111111]"}`} />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="w-5 h-5 text-[#666666] hover:text-[#111111] transition-colors" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {items.length}
                </span>
              )}
            </button>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-[#C9A84C] hover:text-[#A6862A] transition-colors">
                  Iniciar sesión
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E5E5]">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[#111111]">
            V&V <span className="text-[#C9A84C]">Phone</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative" aria-label="Carrito">
              <ShoppingBag className="w-5 h-5 text-[#666666]" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-[#C9A84C]">Entrar</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#C9A84C]/20">
        <div className={`grid h-16 ${isAdmin ? "grid-cols-5" : "grid-cols-4"}`}>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${active ? "text-[#C9A84C]" : "text-[#666666]"}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${pathname.startsWith("/admin") ? "text-[#C9A84C]" : "text-[#666666]"}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-medium">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 text-[#666666]"
            aria-label="Carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute top-2 right-6 bg-[#C9A84C] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
            <span className="text-[10px] font-medium">Carrito</span>
          </button>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
