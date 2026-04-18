"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useState, useTransition } from "react";

const CONDITION_COLORS: Record<string, string> = {
  "Nuevo": "bg-emerald-100 text-emerald-700",
  "Como nuevo": "bg-blue-100 text-blue-700",
  "Bueno": "bg-yellow-100 text-yellow-700",
  "Aceptable": "bg-orange-100 text-orange-700",
};

interface PhoneCardProps {
  phone: Phone;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function PhoneCard({ phone, isFavorite = false, onToggleFavorite }: PhoneCardProps) {
  const { addItem, removeItem, isInCart } = useCartStore();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [favLoading, startFavTransition] = useTransition();
  const [localFav, setLocalFav] = useState(isFavorite);
  const inCart = isInCart(phone.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    startFavTransition(() => {
      setLocalFav((v) => !v);
      onToggleFavorite?.(phone.id);
    });
  };

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCart) removeItem(phone.id);
    else addItem(phone);
  };

  const hasDiscount = phone.original_price && phone.original_price > phone.price;
  const imageUrl = phone.images?.[0] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/telefono/${phone.id}`} className="block">
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden transition-shadow group-hover:shadow-md">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-[#F8F8F8]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={phone.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#E5E5E5]">
                <ShoppingBag className="w-10 h-10" />
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              aria-label={localFav ? "Quitar de favoritos" : "Guardar en favoritos"}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${localFav ? "fill-[#D0021B] text-[#D0021B]" : "text-[#666666]"}`}
              />
            </button>

            {/* Condition badge */}
            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${CONDITION_COLORS[phone.condition] ?? "bg-gray-100 text-gray-600"}`}>
              {phone.condition}
            </span>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-xs text-[#666666] font-medium">{phone.brand}</p>
            <p className="text-sm font-semibold text-[#111111] mt-0.5 truncate">{phone.title}</p>

            <div className="flex items-center justify-between mt-2">
              <div>
                {hasDiscount ? (
                  <div>
                    <span className="text-xs text-[#666666] line-through">{formatPrice(phone.original_price!)}</span>
                    <p className="text-base font-bold text-[#D0021B]">{formatPrice(phone.price)}</p>
                  </div>
                ) : (
                  <p className="text-base font-bold text-[#C9A84C]">{formatPrice(phone.price)}</p>
                )}
              </div>
              <button
                onClick={handleCart}
                aria-label={inCart ? "Quitar del carrito" : "Agregar al carrito"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  inCart
                    ? "bg-[#C9A84C] text-white"
                    : "bg-[#F8F8F8] text-[#666666] hover:bg-[#C9A84C] hover:text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
