"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Phone } from "@/types";
import { PhoneCard } from "./PhoneCard";
import { supabase } from "@/lib/supabase";

interface FavoritesClientProps {
  initialPhones: Phone[];
  clerkId: string;
}

export function FavoritesClient({ initialPhones, clerkId }: FavoritesClientProps) {
  const [phones, setPhones] = useState<Phone[]>(initialPhones);

  const handleToggleFavorite = async (phoneId: string) => {
    setPhones((prev) => prev.filter((p) => p.id !== phoneId));
    await supabase
      .from("favorites")
      .delete()
      .eq("clerk_id", clerkId)
      .eq("phone_id", phoneId);
  };

  if (phones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#666666]">
        <Heart className="w-16 h-16 text-[#E5E5E5] mb-4" />
        <p className="font-medium text-lg">No tienes favoritos aún</p>
        <p className="text-sm mt-1">Explora el catálogo y guarda los que te gusten</p>
        <a
          href="/catalogo"
          className="mt-6 bg-[#C9A84C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#A6862A] transition-colors"
        >
          Ver catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {phones.map((phone) => (
        <PhoneCard
          key={phone.id}
          phone={phone}
          isFavorite
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
