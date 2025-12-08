-- Add Mahjong Solitaire game to the games table
INSERT INTO games (
  id,
  title,
  description,
  category,
  difficulty,
  min_age,
  max_age,
  points,
  game_data,
  is_active
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'Mahjong Solitaire',
  'Taşları eşleştir ve tahtayı temizle! Strateji ve konsantrasyon gerektirir.',
  'fun',
  'medium',
  8,
  99,
  50,
  '{"type": "mahjong-solitaire"}'::jsonb,
  true
);
