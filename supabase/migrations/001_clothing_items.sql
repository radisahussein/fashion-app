-- clothing_items table
CREATE TABLE clothing_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  category      text NOT NULL CHECK (category IN ('top','bottom','shoes','accessory','outerwear','dress')),
  colors        text[] NOT NULL DEFAULT '{}',
  brand         text,
  size          text,
  date_purchased date,
  photo_url     text,
  notes         text,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX clothing_items_user_id_idx ON clothing_items(user_id);
CREATE INDEX clothing_items_category_idx ON clothing_items(category);

-- RLS
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_clothing_items"
  ON clothing_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage bucket for clothing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothing-photos', 'clothing-photos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "users_own_clothing_photos"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'clothing-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'clothing-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
