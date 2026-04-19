"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useAuth, useClerk } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

const CONDITION_COLORS: Record<string, string> = {
  "Nuevo": "bg-emerald-100 text-emerald-700",
  "Como nuevo": "bg-blue-100 text-blue-700",
  "Bueno": "bg-yellow-100 text-yellow-700",
  "Aceptable": "bg-orange-100 text-orange-700",
};

export function ProductDetail({ phone }: { phone: Phone }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const { addItem, removeItem, isInCart } = useCartStore();
  const { isSignedIn, userId } = useAuth();
  const { openSignIn } = useClerk();
  const inCart = isInCart(phone.id);
  const hasDiscount = phone.original_price && phone.original_price > phone.price;

  const handleFavorite = async () => {
    if (!isSignedIn) { openSignIn(); return; }

    if (isFav) {
      setIsFav(false);
      await supabase.from("favorites").delete().eq("clerk_id", userId!).eq("phone_id", phone.id);
    } else {
      setIsFav(true);
      await supabase.from("favorites").insert({ clerk_id: userId!, phone_id: phone.id });
    }
  };

  const images = phone.images?.length ? phone.images : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 md:px-6 py-8"
    >
      <div className="md:grid md:grid-cols-2 md:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square bg-[#F8F8F8] rounded-2xl overflow-hidden">
            {images.length > 0 ? (
              <Image
                src={images[currentImage]}
                alt={phone.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#E5E5E5]">
                <ShoppingBag className="w-16 h-16" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentImage((i) => Math.min(images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === currentImage ? "border-[#C9A84C]" : "border-transparent"}`}
                >
                  <Image src={img} alt={`Imagen ${i + 1}`} width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 md:mt-0">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${CONDITION_COLORS[phone.condition] ?? "bg-gray-100 text-gray-600"}`}>
            {phone.condition}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-[#111111] mt-3">{phone.title}</h1>
          <p className="text-[#666666] text-sm mt-1">{phone.brand} · {phone.model}</p>

          <div className="mt-4">
            {hasDiscount ? (
              <div>
                <span className="text-sm text-[#666666] line-through">{formatPrice(phone.original_price!)}</span>
                <p className="text-3xl font-bold text-[#D0021B]">{formatPrice(phone.price)}</p>
              </div>
            ) : (
              <p className="text-3xl font-bold text-[#C9A84C]">{formatPrice(phone.price)}</p>
            )}
          </div>

          {/* Specs */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: "Marca", value: phone.brand },
              { label: "Modelo", value: phone.model },
              phone.storage && { label: "Almacenamiento", value: phone.storage },
              phone.color && { label: "Color", value: phone.color },
            ]
              .filter(Boolean)
              .map((spec: any) => (
                <div key={spec.label} className="bg-[#F8F8F8] rounded-xl p-3">
                  <p className="text-xs text-[#666666]">{spec.label}</p>
                  <p className="text-sm font-semibold text-[#111111] mt-0.5">{spec.value}</p>
                </div>
              ))}
          </div>

          {phone.description && (
            <div className="mt-6">
              <p className="text-sm text-[#666666] leading-relaxed">{phone.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => inCart ? removeItem(phone.id) : addItem(phone)}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                inCart
                  ? "bg-[#111111] text-white hover:bg-[#333]"
                  : "bg-[#C9A84C] text-white hover:bg-[#A6862A]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {inCart ? "Quitar del carrito" : "Agregar al carrito"}
            </button>

            <button
              onClick={handleFavorite}
              aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
              className="w-14 h-14 rounded-xl border border-[#E5E5E5] flex items-center justify-center hover:border-[#C9A84C] transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-[#D0021B] text-[#D0021B]" : "text-[#666666]"}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
