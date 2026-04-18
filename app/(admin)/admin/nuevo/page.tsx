import { Metadata } from "next";
import { PhoneForm } from "@/components/admin/PhoneForm";

export const metadata: Metadata = { title: "Nuevo teléfono | Admin" };

export default function NuevoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111111] mb-8">Nuevo teléfono</h1>
      <PhoneForm />
    </div>
  );
}
