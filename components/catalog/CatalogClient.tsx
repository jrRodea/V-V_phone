"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Phone, PhoneFilters } from "@/types";
import { PhoneGrid } from "./PhoneGrid";
import { FiltersPanel, ActiveFiltersBar, MobileFiltersDrawer } from "./Filters";
import { useAuth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

interface CatalogClientProps {
  phones: Phone[];
}

export function CatalogClient({ phones }: CatalogClientProps) {
  const [filters, setFilters] = useState<PhoneFilters>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { userId } = useAuth();

  const filtered = useMemo(() => {
    let result = [...phones];

    if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
    if (filters.condition) result = result.filter((p) => p.condition === filters.condition);
    if (filters.storage) result = result.filter((p) => p.storage === filters.storage);
    if (filters.minPrice) result = result.filter((p) => p.price >= filters.minPrice!);
    if (filters.maxPrice) result = result.filter((p) => p.price <= filters.maxPrice!);

    if (filters.sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === "price_desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [phones, filters]);

  const handleToggleFavorite = async (phoneId: string) => {
    if (!userId) return;

    const isFav = favorites.includes(phoneId);
    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== phoneId));
      await supabase
        .from("favorites")
        .delete()
        .eq("clerk_id", userId)
        .eq("phone_id", phoneId);
    } else {
      setFavorites((prev) => [...prev, phoneId]);
      await supabase
        .from("favorites")
        .insert({ clerk_id: userId, phone_id: phoneId });
    }
  };

  return (
    <div>
      {/* Mobile filter button */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <ActiveFiltersBar filters={filters} onChange={setFilters} />
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#666666] ml-auto"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <FiltersPanel filters={filters} onChange={setFilters} />
        </div>

        {/* Grid */}
        <div>
          <div className="hidden md:block mb-4">
            <ActiveFiltersBar filters={filters} onChange={setFilters} />
          </div>
          <PhoneGrid
            phones={filtered}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      <MobileFiltersDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
      />
    </div>
  );
}
