import { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { supabase } from "@/lib/supabase";
import { Phone } from "@/types";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora nuestra selección completa de teléfonos de segunda mano con los mejores precios.",
};

async function getAllPhones(): Promise<Phone[]> {
  const { data } = await supabase
    .from("phones")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function CatalogPage() {
  const phones = await getAllPhones();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#111111]">Catálogo</h1>
        <p className="text-sm text-[#666666] mt-1">{phones.length} teléfonos disponibles</p>
      </div>
      <CatalogClient phones={phones} />
    </div>
  );
}
