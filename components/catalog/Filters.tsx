"use client";

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { PhoneFilters } from "@/types";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Motorola", "OnePlus", "Google", "Huawei"];
const CONDITIONS = ["Nuevo", "Como nuevo", "Bueno", "Aceptable"];
const STORAGES = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const SORT_OPTIONS = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
] as const;

interface FiltersProps {
  filters: PhoneFilters;
  onChange: (filters: PhoneFilters) => void;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#E5E5E5] pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <p className="text-xs font-semibold text-[#111111] uppercase tracking-wide mb-3">{title}</p>
      {children}
    </div>
  );
}

function CheckChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        selected
          ? "bg-[#C9A84C] border-[#C9A84C] text-white"
          : "border-[#E5E5E5] text-[#666666] hover:border-[#C9A84C] hover:text-[#C9A84C]"
      }`}
    >
      {label}
    </button>
  );
}

export function FiltersPanel({ filters, onChange }: FiltersProps) {
  const toggle = (field: keyof PhoneFilters, value: string) => {
    onChange({ ...filters, [field]: filters[field] === value ? undefined : value });
  };

  const activeCount = [
    filters.brand,
    filters.condition,
    filters.storage,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#111111] flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filtros
          {activeCount > 0 && (
            <span className="bg-[#C9A84C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({})}
            className="text-xs text-[#666666] hover:text-[#D0021B] transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      <FilterSection title="Ordenar">
        <select
          value={filters.sortBy ?? "newest"}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as PhoneFilters["sortBy"] })}
          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#C9A84C]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Marca">
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <CheckChip key={b} label={b} selected={filters.brand === b} onToggle={() => toggle("brand", b)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Condición">
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <CheckChip key={c} label={c} selected={filters.condition === c} onToggle={() => toggle("condition", c)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Almacenamiento">
        <div className="flex flex-wrap gap-2">
          {STORAGES.map((s) => (
            <CheckChip key={s} label={s} selected={filters.storage === s} onToggle={() => toggle("storage", s)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Precio (MXN)">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice ?? ""}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
          />
          <span className="text-[#666666]">—</span>
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice ?? ""}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </FilterSection>
    </aside>
  );
}

export function ActiveFiltersBar({ filters, onChange }: FiltersProps) {
  const chips: { label: string; remove: () => void }[] = [];

  if (filters.brand) chips.push({ label: filters.brand, remove: () => onChange({ ...filters, brand: undefined }) });
  if (filters.condition) chips.push({ label: filters.condition, remove: () => onChange({ ...filters, condition: undefined }) });
  if (filters.storage) chips.push({ label: filters.storage, remove: () => onChange({ ...filters, storage: undefined }) });
  if (filters.minPrice) chips.push({ label: `Desde $${filters.minPrice}`, remove: () => onChange({ ...filters, minPrice: undefined }) });
  if (filters.maxPrice) chips.push({ label: `Hasta $${filters.maxPrice}`, remove: () => onChange({ ...filters, maxPrice: undefined }) });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip) => (
        <span key={chip.label} className="flex items-center gap-1 bg-[#C9A84C]/10 text-[#A6862A] text-xs font-medium px-3 py-1.5 rounded-full">
          {chip.label}
          <button onClick={chip.remove} aria-label={`Quitar filtro ${chip.label}`}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

interface MobileFiltersDrawerProps extends FiltersProps {
  open: boolean;
  onClose: () => void;
}

export function MobileFiltersDrawer({ open, onClose, filters, onChange }: MobileFiltersDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="font-semibold text-[#111111]">Filtros</h2>
          <button onClick={onClose} aria-label="Cerrar filtros">
            <X className="w-5 h-5 text-[#666666]" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4">
          <FiltersPanel filters={filters} onChange={onChange} />
        </div>
        <div className="px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="w-full bg-[#C9A84C] text-white py-3 rounded-xl font-semibold hover:bg-[#A6862A] transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
