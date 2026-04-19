"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";
import { Phone } from "@/types";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Motorola", "OnePlus", "Google", "Huawei", "Sony", "Otro"];
const CONDITIONS = ["Nuevo", "Como nuevo", "Bueno", "Aceptable"] as const;
const STORAGES = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];

interface PhoneFormProps {
  phone?: Phone;
}

interface FormData {
  title: string;
  description: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  condition: (typeof CONDITIONS)[number];
  price: string;
  original_price: string;
  is_available: boolean;
  is_featured: boolean;
}

export function PhoneForm({ phone }: PhoneFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!phone;

  const [form, setForm] = useState<FormData>({
    title: phone?.title ?? "",
    description: phone?.description ?? "",
    brand: phone?.brand ?? "",
    model: phone?.model ?? "",
    storage: phone?.storage ?? "",
    color: phone?.color ?? "",
    condition: phone?.condition ?? "Como nuevo",
    price: phone?.price?.toString() ?? "",
    original_price: phone?.original_price?.toString() ?? "",
    is_available: phone?.is_available ?? true,
    is_featured: phone?.is_featured ?? false,
  });

  const [images, setImages] = useState<string[]>(phone?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setError(null);
    const urls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        urls.push(json.url);
      } else {
        setError(`Error al subir imagen: ${json.error ?? res.statusText}`);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      brand: form.brand,
      model: form.model,
      storage: form.storage || null,
      color: form.color || null,
      condition: form.condition,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      images,
      is_available: form.is_available,
      is_featured: form.is_featured,
    };

    const res = isEditing
      ? await fetch(`/api/admin/phones/${phone!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/phones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!res.ok) {
      setError("Ocurrió un error al guardar. Por favor intenta de nuevo.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const fieldClass = "w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-3">Imágenes</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F8F8] group border border-[#E5E5E5]">
              <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button type="button" onClick={() => moveImage(i, i - 1)} className="bg-white/90 p-1 rounded-lg" aria-label="Mover izquierda">
                    <GripVertical className="w-3 h-3" />
                  </button>
                )}
                <button type="button" onClick={() => removeImage(i)} className="bg-white/90 p-1 rounded-lg text-[#D0021B]" aria-label="Eliminar imagen">
                  <X className="w-3 h-3" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-[#C9A84C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Principal</span>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center gap-1 text-[#666666] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-xs">Subir</span>
              </>
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Título *</label>
          <input required value={form.title} onChange={set("title")} placeholder="ej. iPhone 13 128GB Negro" className={fieldClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Marca *</label>
          <select required value={form.brand} onChange={set("brand")} className={fieldClass}>
            <option value="">Seleccionar</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Modelo *</label>
          <input required value={form.model} onChange={set("model")} placeholder="ej. iPhone 13" className={fieldClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Almacenamiento</label>
          <select value={form.storage} onChange={set("storage")} className={fieldClass}>
            <option value="">Sin especificar</option>
            {STORAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Color</label>
          <input value={form.color} onChange={set("color")} placeholder="ej. Negro, Blanco, Azul" className={fieldClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Condición *</label>
          <select required value={form.condition} onChange={set("condition")} className={fieldClass}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Precio (MXN) *</label>
          <input required type="number" min="0" step="0.01" value={form.price} onChange={set("price")} placeholder="8500" className={fieldClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Precio original (opcional)</label>
          <input type="number" min="0" step="0.01" value={form.original_price} onChange={set("original_price")} placeholder="10000" className={fieldClass} />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-semibold text-[#111111] mb-1.5">Descripción</label>
          <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Describe el estado del teléfono e incluye accesorios..." className={`${fieldClass} resize-none`} />
        </div>

        <div className="col-span-2 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_available} onChange={set("is_available")} className="w-4 h-4 accent-[#C9A84C]" />
            <span className="text-sm font-medium text-[#111111]">Disponible</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={set("is_featured")} className="w-4 h-4 accent-[#C9A84C]" />
            <span className="text-sm font-medium text-[#111111]">Destacado en home</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border border-[#E5E5E5] text-sm font-semibold text-[#666666] hover:border-[#111111] hover:text-[#111111] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#A6862A] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear teléfono"}
        </button>
      </div>
    </form>
  );
}
