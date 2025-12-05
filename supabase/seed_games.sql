-- ===========================================
-- OYUNLARI EKLE (14 oyun)
-- ===========================================

-- Önce mevcut oyunları sil (temiz başlangıç)
DELETE FROM games;

-- Matematik Oyunları
INSERT INTO games (title, description, category, difficulty, min_age, max_age, points, game_data, is_active) VALUES
('Toplama Ustası', 'Basit toplama işlemleriyle matematik öğren', 'math', 'easy', 5, 8, 10, '{"type": "addition", "maxNumber": 10, "questionCount": 10}'::jsonb, true),
('Çıkarma Şampiyonu', 'Çıkarma işlemlerini çöz ve şampiyon ol! Sayılarla arkadaş ol.', 'math', 'easy', 6, 9, 10, '{"type": "subtraction", "maxNumber": 20, "questionCount": 10}'::jsonb, true),
('Çarpım Tablosu', 'Çarpım tablolarını ezberle ve pratik yap', 'math', 'medium', 8, 11, 20, '{"type": "multiplication", "maxNumber": 10, "questionCount": 10}'::jsonb, true);

-- Dil Oyunları
INSERT INTO games (title, description, category, difficulty, min_age, max_age, points, game_data, is_active) VALUES
('Kelime Avı', 'Harflerden anlamlı kelimeler oluştur', 'language', 'easy', 6, 10, 15, '{"type": "word_hunt", "wordCount": 10}'::jsonb, true),
('Harf Sırala', 'Karışık harfleri sırala ve kelimeyi bul! Eğlenceli kelime oyunu.', 'language', 'medium', 7, 11, 15, '{"type": "letter_sort", "wordCount": 8}'::jsonb, true),
('Adam Asmaca', 'Harfleri tahmin ederek gizli kelimeyi bul! Her yanlış tahminde adam asmaca figürü bir adım daha yaklaşır. 6 yanlış hakkın var!', 'language', 'easy', 5, 15, 30, '{"type": "hangman", "maxWrong": 6}'::jsonb, true),
('Resimli Kelime Tahmin', 'Emojilere bakarak kelimeleri tahmin et! Karışık harflerden doğru kelimeyi oluştur.', 'language', 'medium', 8, 99, 15, '{"type": "emoji_word", "questionCount": 10}'::jsonb, true);

-- Mantık Oyunları
INSERT INTO games (title, description, category, difficulty, min_age, max_age, points, game_data, is_active) VALUES
('Desen Tamamla', 'Eksik desenleri tamamla! Görsel mantık oyunu.', 'logic', 'easy', 6, 10, 10, '{"type": "pattern", "questionCount": 8}'::jsonb, true),
('Mantık Bulmacası', 'Mantık yürüterek problemleri çöz', 'logic', 'hard', 10, 14, 30, '{"type": "logic_puzzle", "questionCount": 5}'::jsonb, true);

-- Hafıza Oyunları
INSERT INTO games (title, description, category, difficulty, min_age, max_age, points, game_data, is_active) VALUES
('Hafıza Kartları', 'Eşleşen kartları bul ve hafızanı güçlendir', 'memory', 'medium', 7, 12, 25, '{"type": "memory_cards", "pairCount": 8}'::jsonb, true),
('Resim Hafızası', 'Resimleri hatırla ve eşleştir! Görsel hafıza oyunu.', 'memory', 'medium', 7, 12, 15, '{"type": "image_memory", "imageCount": 6}'::jsonb, true);

-- Bilim Oyunları
INSERT INTO games (title, description, category, difficulty, min_age, max_age, points, game_data, is_active) VALUES
('Bilim Deneyleri', 'Eğlenceli bilim deneyleri ile öğren', 'science', 'easy', 8, 13, 20, '{"type": "experiments", "questionCount": 8}'::jsonb, true),
('Bilim Sınavı', 'Bilim sorularını yanıtla! Fen bilgisi öğren.', 'science', 'medium', 9, 14, 20, '{"type": "science_quiz", "questionCount": 10}'::jsonb, true),
('Renk Laboratuvarı', 'Deney tüplerindeki sıvıları karıştır! Her rengi bir tüpte topla.', 'science', 'medium', 7, 14, 30, '{"type": "color_lab", "tubeCount": 4}'::jsonb, true);

-- Sonucu kontrol et
SELECT category, COUNT(*) as count FROM games GROUP BY category ORDER BY category;
SELECT COUNT(*) as total_games FROM games;
