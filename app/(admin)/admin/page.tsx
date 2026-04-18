import { getSupabaseAdmin } from "@/lib/supabase";
import { Phone } from "@/types";
import { AdminPhoneList } from "@/components/admin/AdminPhoneList";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Panel Admin | V&V Phone" };

async function getAllPhonesAdmin(): Promise<Phone[]> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("phones")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminPage() {
  const phones = await getAllPhonesAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Teléfonos</h1>
        <p className="text-sm text-[#666666] mt-1">{phones.length} registros</p>
      </div>
      <AdminPhoneList phones={phones} />
    </div>
  );
}
