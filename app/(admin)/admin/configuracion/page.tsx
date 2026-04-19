import { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Configuración | Admin" };

async function getSettings(): Promise<Record<string, string>> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("settings").select("key, value");
  const map: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    map[row.key] = row.value;
  });
  return map;
}

export default async function ConfiguracionPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-[#111111] mb-2">Configuración</h1>
      <p className="text-sm text-[#666666] mb-8">Ajustes generales de la tienda</p>
      <SettingsForm settings={settings} />
    </div>
  );
}
