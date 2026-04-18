import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PhoneForm } from "@/components/admin/PhoneForm";
import { Phone } from "@/types";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: "Editar teléfono | Admin" };

async function getPhone(id: string): Promise<Phone | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("phones").select("*").eq("id", id).single();
  return data;
}

export default async function EditarPage({ params }: Props) {
  const phone = await getPhone(params.id);
  if (!phone) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111111] mb-8">Editar teléfono</h1>
      <PhoneForm phone={phone} />
    </div>
  );
}
