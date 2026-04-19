import { Phone } from "@/types";

interface CartItemWithPhone {
  phone: Phone;
}

export function generateWhatsAppURL(
  items: CartItemWithPhone[],
  baseUrl: string,
  number?: string
): string {
  const whatsappNumber = number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  const lines = items.map((item, i) => {
    const price = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(item.phone.price);

    return `${i + 1}. ${item.phone.title} - ${price}\n   🔗 ${baseUrl}/telefono/${item.phone.id}`;
  });

  const total = items.reduce((sum, item) => sum + item.phone.price, 0);
  const totalFormatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(total);

  const message = [
    "Hola, me interesan estos teléfonos de V&V Phone:",
    "",
    ...lines,
    "",
    `Total estimado: ${totalFormatted}`,
    "",
    "¿Están disponibles?",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
