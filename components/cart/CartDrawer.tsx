"use client";

import { X, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { generateWhatsAppURL } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem } = useCartStore();
  const total = items.reduce((sum, p) => sum + p.price, 0);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vvphone.com";

  const handleWhatsApp = () => {
    const url = generateWhatsAppURL(
      items.map((phone) => ({ phone })),
      appUrl
    );
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <h2 className="text-lg font-semibold text-[#111111]">
                Carrito ({items.length})
              </h2>
              <button onClick={onClose} aria-label="Cerrar carrito">
                <X className="w-5 h-5 text-[#666666] hover:text-[#111111] transition-colors" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-[#666666]">
                  <ShoppingBag className="w-12 h-12 text-[#E5E5E5]" />
                  <p className="text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map((phone) => (
                  <div key={phone.id} className="flex gap-3 items-start">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                      {phone.images?.[0] ? (
                        <Image
                          src={phone.images[0]}
                          alt={phone.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#E5E5E5]">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111111] truncate">{phone.title}</p>
                      <p className="text-xs text-[#666666] mt-0.5">{phone.condition}</p>
                      <p className="text-sm font-semibold text-[#C9A84C] mt-1">{formatPrice(phone.price)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(phone.id)}
                      aria-label="Eliminar del carrito"
                      className="text-[#666666] hover:text-[#D0021B] transition-colors mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-[#E5E5E5] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#666666]">Total estimado</span>
                  <span className="text-lg font-bold text-[#111111]">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1db954] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
