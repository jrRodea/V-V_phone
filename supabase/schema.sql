-- ============================================================
-- V&V Phone — Schema SQL para Supabase
-- ============================================================

-- Tabla: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id   text UNIQUE NOT NULL,
  role       text DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio perfil" ON profiles
  FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Servicio puede gestionar perfiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Tabla: phones
CREATE TABLE IF NOT EXISTS phones (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  description    text,
  brand          text NOT NULL,
  model          text NOT NULL,
  storage        text,
  color          text,
  condition      text NOT NULL CHECK (condition IN ('Nuevo', 'Como nuevo', 'Bueno', 'Aceptable')),
  price          numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  images         text[] DEFAULT '{}',
  is_available   boolean DEFAULT true,
  is_featured    boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE phones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de teléfonos" ON phones
  FOR SELECT USING (true);

CREATE POLICY "Solo admins escriben teléfonos" ON phones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE clerk_id = auth.uid()::text AND role = 'admin'
    )
  );

-- Tabla: favorites
CREATE TABLE IF NOT EXISTS favorites (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id   text NOT NULL,
  phone_id   uuid REFERENCES phones(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(clerk_id, phone_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios gestionan sus favoritos" ON favorites
  FOR ALL USING (auth.uid()::text = clerk_id)
  WITH CHECK (auth.uid()::text = clerk_id);

-- Tabla: cart_items
CREATE TABLE IF NOT EXISTS cart_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  phone_id   uuid REFERENCES phones(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, phone_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sesiones gestionan su propio carrito" ON cart_items
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Storage bucket: phone-images
-- ============================================================
-- Ejecutar en el dashboard de Supabase Storage:
-- 1. Crear bucket "phone-images" como público
-- 2. Política de lectura: allow SELECT for all (anon, authenticated)
-- 3. Política de escritura: allow INSERT/UPDATE/DELETE solo para admins

-- ============================================================
-- Datos de prueba (opcional)
-- ============================================================
INSERT INTO phones (title, brand, model, storage, color, condition, price, original_price, is_available, is_featured)
VALUES
  ('iPhone 13 128GB Negro', 'Apple', 'iPhone 13', '128GB', 'Negro', 'Como nuevo', 8500, 10000, true, true),
  ('Samsung Galaxy S23 256GB', 'Samsung', 'Galaxy S23', '256GB', 'Blanco', 'Bueno', 7200, NULL, true, true),
  ('Xiaomi 13 128GB Azul', 'Xiaomi', 'Xiaomi 13', '128GB', 'Azul', 'Nuevo', 6800, 8000, true, false),
  ('iPhone 12 64GB Rojo', 'Apple', 'iPhone 12', '64GB', 'Rojo', 'Bueno', 5500, NULL, true, true)
ON CONFLICT DO NOTHING;
