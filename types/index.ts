export interface Phone {
  id: string;
  title: string;
  description: string | null;
  brand: string;
  model: string;
  storage: string | null;
  color: string | null;
  condition: "Nuevo" | "Como nuevo" | "Bueno" | "Aceptable";
  price: number;
  original_price: number | null;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  clerk_id: string;
  role: "admin" | "customer";
  created_at: string;
}

export interface Favorite {
  id: string;
  clerk_id: string;
  phone_id: string;
  created_at: string;
  phone?: Phone;
}

export interface CartItem {
  id: string;
  session_id: string;
  phone_id: string;
  created_at: string;
  phone?: Phone;
}

export interface PhoneFilters {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  storage?: string;
  color?: string;
  sortBy?: "price_asc" | "price_desc" | "newest";
}
