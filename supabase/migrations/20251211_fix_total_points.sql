-- SORUNU DÜZELTME: users.total_points'i doğru değere geri yükle
-- total_points = Tamamlanan oyunların points değerleri toplamı + Görev ödülleri

-- 1. Önce mevcut değerleri kontrol et
SELECT 
  u.id,
  u.full_name,
  u.total_points as current_total_points,
  COALESCE(game_points.total, 0) as game_completion_points,
  COALESCE(challenge_points.total, 0) as challenge_reward_points,
  COALESCE(game_points.total, 0) + COALESCE(challenge_points.total, 0) as correct_total_points
FROM users u
LEFT JOIN (
  -- Her tamamlanan oyun için games.points değerini topla
  SELECT 
    gp.user_id,
    SUM(g.points) as total
  FROM game_progress gp
  JOIN games g ON gp.game_id = g.id
  WHERE gp.completed = true
  GROUP BY gp.user_id
) game_points ON u.id = game_points.user_id
LEFT JOIN (
  -- Görevlerden kazanılan ödülleri topla
  SELECT 
    user_id,
    SUM(reward_points) as total
  FROM challenge_claims
  GROUP BY user_id
) challenge_points ON u.id = challenge_points.user_id
WHERE u.total_points > 0;

-- 2. users.total_points'i doğru değere güncelle
UPDATE users u
SET total_points = (
  COALESCE((
    SELECT SUM(g.points)
    FROM game_progress gp
    JOIN games g ON gp.game_id = g.id
    WHERE gp.user_id = u.id AND gp.completed = true
  ), 0)
  +
  COALESCE((
    SELECT SUM(reward_points)
    FROM challenge_claims
    WHERE user_id = u.id
  ), 0)
),
updated_at = NOW()
WHERE id = u.id;

-- 3. Sonucu doğrula
SELECT id, full_name, total_points FROM users WHERE total_points > 0;
