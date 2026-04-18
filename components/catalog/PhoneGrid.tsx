import { Phone } from "@/types";
import { PhoneCard } from "./PhoneCard";

interface PhoneGridProps {
  phones: Phone[];
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

export function PhoneGrid({ phones, favorites = [], onToggleFavorite }: PhoneGridProps) {
  if (phones.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#666666]">
        <p className="text-4xl mb-3">📱</p>
        <p className="font-medium">No se encontraron teléfonos</p>
        <p className="text-sm mt-1">Prueba ajustando los filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {phones.map((phone) => (
        <PhoneCard
          key={phone.id}
          phone={phone}
          isFavorite={favorites.includes(phone.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
