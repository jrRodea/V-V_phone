"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";

export function AdminPhoneList({ phones: initial }: { phones: Phone[] }) {
  const [phones, setPhones] = useState<Phone[]>(initial);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este teléfono?")) return;

    const res = await fetch(`/api/admin/phones/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPhones((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Error al eliminar. Intenta de nuevo.");
    }
  };

  const handleToggle = async (id: string, field: "is_featured" | "is_available", value: boolean) => {
    const res = await fetch(`/api/admin/phones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    if (res.ok) {
      setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    } else {
      alert("Error al actualizar. Intenta de nuevo.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F8F8F8]">
              <th className="text-left px-4 py-3 font-semibold text-[#666666]">Producto</th>
              <th className="text-left px-4 py-3 font-semibold text-[#666666]">Condición</th>
              <th className="text-left px-4 py-3 font-semibold text-[#666666]">Precio</th>
              <th className="text-center px-4 py-3 font-semibold text-[#666666]">Disponible</th>
              <th className="text-center px-4 py-3 font-semibold text-[#666666]">Destacado</th>
              <th className="text-right px-4 py-3 font-semibold text-[#666666]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((phone) => (
              <tr key={phone.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F8F8F8]/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F8F8F8] overflow-hidden flex-shrink-0">
                      {phone.images?.[0] && (
                        <Image src={phone.images[0]} alt={phone.title} width={48} height={48} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#111111] truncate max-w-[200px]">{phone.title}</p>
                      <p className="text-xs text-[#666666]">{phone.brand} · {phone.storage}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#666666]">{phone.condition}</td>
                <td className="px-4 py-3 font-semibold text-[#111111]">{formatPrice(phone.price)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(phone.id, "is_available", !phone.is_available)}
                    aria-label={phone.is_available ? "Marcar no disponible" : "Marcar disponible"}
                    className="mx-auto flex items-center justify-center"
                  >
                    {phone.is_available
                      ? <Eye className="w-5 h-5 text-emerald-500" />
                      : <EyeOff className="w-5 h-5 text-[#666666]" />
                    }
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(phone.id, "is_featured", !phone.is_featured)}
                    aria-label={phone.is_featured ? "Quitar destacado" : "Marcar destacado"}
                    className="mx-auto flex items-center justify-center"
                  >
                    <Star className={`w-5 h-5 ${phone.is_featured ? "fill-[#C9A84C] text-[#C9A84C]" : "text-[#E5E5E5]"}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/editar/${phone.id}`}
                      className="p-2 rounded-lg hover:bg-[#E5E5E5] transition-colors text-[#666666]"
                      aria-label="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(phone.id)}
                      className="p-2 rounded-lg hover:bg-[#FEE2E2] transition-colors text-[#666666] hover:text-[#D0021B]"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {phones.length === 0 && (
          <div className="text-center py-12 text-[#666666]">
            <p>No hay teléfonos registrados.</p>
            <Link href="/admin/nuevo" className="text-[#C9A84C] font-medium mt-2 inline-block hover:text-[#A6862A]">
              Agregar el primero →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
