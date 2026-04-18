import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { Phone } from "@/types";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedPhones } from "@/components/home/FeaturedPhones";
import { PhoneGridSkeleton } from "@/components/ui/Skeleton";

async function getFeaturedPhones(): Promise<Phone[]> {
  const { data } = await supabase
    .from("phones")
    .select("*")
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return data ?? [];
}

export default async function HomePage() {
  const featuredPhones = await getFeaturedPhones();

  return (
    <>
      <HeroSection />
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#111111]">Teléfonos destacados</h2>
            <p className="text-sm text-[#666666] mt-1">Los mejores precios en nuestra selección</p>
          </div>
          <a href="/catalogo" className="text-sm font-medium text-[#C9A84C] hover:text-[#A6862A] transition-colors">
            Ver todos →
          </a>
        </div>
        <Suspense fallback={<PhoneGridSkeleton count={4} />}>
          <FeaturedPhones phones={featuredPhones} />
        </Suspense>
      </section>
    </>
  );
}
