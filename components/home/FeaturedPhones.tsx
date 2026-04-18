import { Phone } from "@/types";
import { PhoneCard } from "@/components/catalog/PhoneCard";

export function FeaturedPhones({ phones }: { phones: Phone[] }) {
  if (phones.length === 0) {
    return (
      <p className="text-center text-[#666666] py-8">
        Próximamente tendremos teléfonos disponibles. ¡Vuelve pronto!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {phones.map((phone) => (
        <PhoneCard key={phone.id} phone={phone} />
      ))}
    </div>
  );
}
