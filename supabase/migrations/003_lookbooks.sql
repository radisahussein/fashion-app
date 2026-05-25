-- lookbooks table
CREATE TABLE lookbooks (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  text NOT NULL,
  description           text,
  requirements          jsonb NOT NULL DEFAULT '{}',
  composite_image_url   text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lookbooks_user_id_idx ON lookbooks(user_id);

-- lookbook_items junction
CREATE TABLE lookbook_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lookbook_id       uuid NOT NULL REFERENCES lookbooks(id) ON DELETE CASCADE,
  clothing_item_id  uuid NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
  layer_order       int NOT NULL DEFAULT 0,
  UNIQUE (lookbook_id, clothing_item_id)
);

CREATE INDEX lookbook_items_lookbook_id_idx ON lookbook_items(lookbook_id);

-- RLS
ALTER TABLE lookbooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_lookbooks"
  ON lookbooks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE lookbook_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_lookbook_items"
  ON lookbook_items FOR ALL
  USING (
    lookbook_id IN (SELECT id FROM lookbooks WHERE user_id = auth.uid())
  )
  WITH CHECK (
    lookbook_id IN (SELECT id FROM lookbooks WHERE user_id = auth.uid())
  );

-- Storage bucket for composite images
INSERT INTO storage.buckets (id, name, public)
VALUES ('lookbook-composites', 'lookbook-composites', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "users_own_lookbook_composites"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'lookbook-composites'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'lookbook-composites'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lookbooks_updated_at
  BEFORE UPDATE ON lookbooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
