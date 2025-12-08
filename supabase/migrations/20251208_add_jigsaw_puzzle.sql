-- Add Jigsaw Puzzle game to games table
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
  gen_random_uuid(),
  'Yapboz Oyunu',
  'Parçaları doğru yere yerleştirerek görseli tamamla! Sürükle-bırak ile eğlenceli bir yapboz deneyimi.',
  'fun',
  'medium',
  5,
  18,
  100,
  '{"type": "jigsaw-puzzle", "gridSize": 4}'::jsonb,
  true
);
