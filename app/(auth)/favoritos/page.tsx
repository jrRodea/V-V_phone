import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FavoritesClient } from "@/components/catalog/FavoritesClient";
import { Phone } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis favoritos",
};

async function getFavorites(clerkId: string): Promise<Phone[]> {
  const { data } = await supabase
    .from("favorites")
    .select("phone_id, phones(*)")
    .eq("clerk_id", clerkId);

  return (data?.map((f: any) => f.phones).filter(Boolean) as Phone[]) ?? [];
}

export default async function FavoritosPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const phones = await getFavorites(userId);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#111111]">Mis favoritos</h1>
        <p className="text-sm text-[#666666] mt-1">{phones.length} teléfono{phones.length !== 1 ? "s" : ""} guardado{phones.length !== 1 ? "s" : ""}</p>
      </div>
      <FavoritesClient initialPhones={phones} clerkId={userId} />
    </div>
  );
}
