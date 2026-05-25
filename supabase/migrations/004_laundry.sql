-- laundry_sessions
CREATE TABLE laundry_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  price numeric(10,2),
  weight_kg numeric(5,2),
  status text NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing','completed','partial')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE laundry_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_laundry_sessions" ON laundry_sessions
  FOR ALL USING (auth.uid() = user_id);

-- laundry_items
CREATE TABLE laundry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES laundry_sessions(id) ON DELETE CASCADE,
  clothing_item_id uuid NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
  returned boolean NOT NULL DEFAULT false,
  condition_note text,
  UNIQUE (session_id, clothing_item_id)
);

ALTER TABLE laundry_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_laundry_items" ON laundry_items
  FOR ALL USING (
    session_id IN (SELECT id FROM laundry_sessions WHERE user_id = auth.uid())
  );
