-- outfit_logs table
CREATE TABLE outfit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worn_date   date NOT NULL,
  photo_url   text,
  occasion    text,
  rating      smallint CHECK (rating BETWEEN 1 AND 5),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, worn_date)
);

CREATE INDEX outfit_logs_user_id_idx ON outfit_logs(user_id);
CREATE INDEX outfit_logs_worn_date_idx ON outfit_logs(worn_date DESC);

-- outfit_log_items junction table
CREATE TABLE outfit_log_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_log_id uuid NOT NULL REFERENCES outfit_logs(id) ON DELETE CASCADE,
  clothing_item_id uuid NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
  UNIQUE (outfit_log_id, clothing_item_id)
);

CREATE INDEX outfit_log_items_log_id_idx ON outfit_log_items(outfit_log_id);
CREATE INDEX outfit_log_items_item_id_idx ON outfit_log_items(clothing_item_id);

-- RLS
ALTER TABLE outfit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_outfit_logs"
  ON outfit_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE outfit_log_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_outfit_log_items"
  ON outfit_log_items FOR ALL
  USING (
    outfit_log_id IN (
      SELECT id FROM outfit_logs WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    outfit_log_id IN (
      SELECT id FROM outfit_logs WHERE user_id = auth.uid()
    )
  );

-- Storage bucket for outfit photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('outfit-photos', 'outfit-photos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "users_own_outfit_photos"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'outfit-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'outfit-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
