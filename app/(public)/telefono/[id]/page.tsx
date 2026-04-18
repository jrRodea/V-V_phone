import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Phone } from "@/types";
import { ProductDetail } from "@/components/catalog/ProductDetail";

interface Props {
  params: { id: string };
}

async function getPhone(id: string): Promise<Phone | null> {
  const { data } = await supabase
    .from("phones")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const phone = await getPhone(params.id);
  if (!phone) return { title: "Teléfono no encontrado" };

  return {
    title: phone.title,
    description: phone.description ?? `${phone.brand} ${phone.model} en V&V Phone`,
    openGraph: {
      title: phone.title,
      description: phone.description ?? undefined,
      images: phone.images?.[0] ? [{ url: phone.images[0] }] : undefined,
    },
  };
}

export default async function PhonePage({ params }: Props) {
  const phone = await getPhone(params.id);
  if (!phone) notFound();

  return <ProductDetail phone={phone} />;
}
