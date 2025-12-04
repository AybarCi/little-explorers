import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface WordHuntGameProps {
  wordCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

const wordsByAge: Record<string, Array<{ word: string; hint: string }>> = {
  '5-7': [
    { word: 'elma', hint: 'Kırmızı veya yeşil bir meyve' },
    { word: 'top', hint: 'Onunla oynarız' },
    { word: 'ev', hint: 'İçinde yaşarız' },
    { word: 'ayak', hint: 'Yürümek için kullanırız' },
    { word: 'göz', hint: 'Görmek için kullanırız' },
    { word: 'kedi', hint: 'Miyavlayan hayvan' },
    { word: 'köpek', hint: 'Havlayan hayvan' },
    { word: 'kuş', hint: 'Uçan hayvan' },
    { word: 'güneş', hint: 'Gökyüzünde parlayan' },
    { word: 'ay', hint: 'Gece gökyüzünde görürüz' },
    { word: 'araba', hint: 'Yolda giden taşıt' },
    { word: 'ağaç', hint: 'Yeşil yapraklı bitki' },
    { word: 'çiçek', hint: 'Güzel kokulu renkli bitki' },
    { word: 'su', hint: 'İçeriz, temizleniriz' },
    { word: 'baba', hint: 'Erkek ebeveyn' },
    { word: 'anne', hint: 'Kadın ebeveyn' },
    { word: 'bebek', hint: 'Küçük çocuk' },
    { word: 'oyuncak', hint: 'Onunla oynarız' },
    { word: 'yılan', hint: 'Sürünen hayvan' },
    { word: 'balık', hint: 'Suda yaşayan hayvan' },
    { word: 'kelebek', hint: 'Renkli uçan böcek' },
    { word: 'arı', hint: 'Bal yapan böcek' },
    { word: 'çanta', hint: 'Eşya taşırız' },
    { word: 'ayakkabı', hint: 'Ayağa giyilir' },
    { word: 'şapka', hint: 'Başa takılır' },
    { word: 'eldiven', hint: 'Ele giyilir' },
    { word: 'pasta', hint: 'Doğum gününde yeriz' },
    { word: 'dondurma', hint: 'Soğuk tatlı' },
    { word: 'süt', hint: 'Beyaz içecek' },
    { word: 'ekmek', hint: 'Her gün yeriz' },
  ],
  '8-10': [
    { word: 'kitap', hint: 'Okumak için kullanılır' },
    { word: 'kalem', hint: 'Yazmak için kullanılır' },
    { word: 'masa', hint: 'Üzerinde çalışırız' },
    { word: 'sandalye', hint: 'Üzerinde otururuz' },
    { word: 'bardak', hint: 'İçecek içmek için kullanılır' },
    { word: 'tabak', hint: 'Yemek yemek için kullanılır' },
    { word: 'pencere', hint: 'Dışarı bakmak için açarız' },
    { word: 'kapı', hint: 'Odaya girmek için açarız' },
    { word: 'lamba', hint: 'Işık verir' },
    { word: 'saat', hint: 'Zamanı gösterir' },
    { word: 'okul', hint: 'Ders yapılan yer' },
    { word: 'öğretmen', hint: 'Ders anlatan kişi' },
    { word: 'öğrenci', hint: 'Ders dinleyen kişi' },
    { word: 'sınıf', hint: 'Derslerin yapıldığı oda' },
    { word: 'defter', hint: 'Yazı yazdığımız' },
    { word: 'silgi', hint: 'Yanlışları sileriz' },
    { word: 'cetvel', hint: 'Düz çizgi çekeriz' },
    { word: 'renk', hint: 'Resimlerde kullanırız' },
    { word: 'müzik', hint: 'Kulağımızla dinleriz' },
    { word: 'dans', hint: 'Müzikle hareket ederiz' },
    { word: 'şarkı', hint: 'Söyleriz' },
    { word: 'park', hint: 'Oyun oynarız' },
    { word: 'salıncak', hint: 'Parkta sallanırız' },
    { word: 'kaydırak', hint: 'Parkta kayarız' },
    { word: 'bisiklet', hint: 'İki tekerlekli araç' },
    { word: 'paten', hint: 'Tekerlekli ayakkabı' },
    { word: 'deniz', hint: 'Büyük su kütlesi' },
    { word: 'kumsal', hint: 'Deniz kenarında kum' },
    { word: 'güneş', hint: 'Işık ve ısı verir' },
    { word: 'yıldız', hint: 'Gece parlar' },
  ],
  '11-13': [
    { word: 'bilgisayar', hint: 'Dijital işler için kullanılır' },
    { word: 'telefon', hint: 'Konuşmak için kullanılır' },
    { word: 'televizyon', hint: 'Program izlemek için kullanılır' },
    { word: 'buzdolabı', hint: 'Yiyecekleri soğuk tutar' },
    { word: 'klima', hint: 'Hava sıcaklığını ayarlar' },
    { word: 'koltuk', hint: 'Rahatlıkla oturulan mobilya' },
    { word: 'halı', hint: 'Zemini kaplar' },
    { word: 'perde', hint: 'Pencereleri kaplar' },
    { word: 'ayna', hint: 'Kendimizi görürüz' },
    { word: 'dolap', hint: 'Eşyaları saklarız' },
    { word: 'matematik', hint: 'Sayılar dersi' },
    { word: 'fen', hint: 'Bilim dersi' },
    { word: 'sosyal', hint: 'Toplum dersi' },
    { word: 'tarih', hint: 'Geçmiş dersi' },
    { word: 'coğrafya', hint: 'Yerler dersi' },
    { word: 'İngilizce', hint: 'Yabancı dil' },
    { word: 'resim', hint: 'Çizim dersi' },
    { word: 'beden', hint: 'Spor dersi' },
    { word: 'teknoloji', hint: 'Dijital araçlar dersi' },
    { word: 'proje', hint: 'Araştırma çalışması' },
    { word: 'deney', hint: 'Bilimsel test' },
    { word: 'araştırma', hint: 'Bilgi toplama' },
    { word: 'sunum', hint: 'Bilgileri anlatma' },
    { word: 'rapor', hint: 'Yazılı belge' },
    { word: 'grafik', hint: 'Görsel veri' },
    { word: 'tablo', hint: 'Düzenli liste' },
    { word: 'şema', hint: 'Görsel plan' },
    { word: 'harita', hint: 'Yer gösterimi' },
    { word: 'atlas', hint: 'Haritalar kitabı' },
    { word: 'ansiklopedi', hint: 'Bilgi kitabı' },
  ],
  '14+': [
    { word: 'algoritma', hint: 'Problem çözme adımları' },
    { word: 'ekosistem', hint: 'Canlılar ve çevre ilişkisi' },
    { word: 'metafor', hint: 'Benzetme yoluyla anlatım' },
    { word: 'demokrasi', hint: 'Halkın yönetimi' },
    { word: 'fotosentez', hint: 'Bitkilerin besin üretimi' },
    { word: 'jeoloji', hint: 'Yer bilimi' },
    { word: 'astronomi', hint: 'Gök cisimleri bilimi' },
    { word: 'kültür', hint: 'Toplumun yaşam biçimi' },
    { word: 'teknoloji', hint: 'Bilimsel ilerlemeler' },
    { word: 'edebiyat', hint: 'Yazın sanatı' },
    { word: 'felsefe', hint: 'Düşünce bilimi' },
    { word: 'psikoloji', hint: 'Ruh bilimi' },
    { word: 'sosyoloji', hint: 'Toplum bilimi' },
    { word: 'antropoloji', hint: 'İnsan bilimi' },
    { word: 'arkeoloji', hint: 'Eski eserler bilimi' },
    { word: 'biyoloji', hint: 'Canlılar bilimi' },
    { word: 'kimya', hint: 'Madde bilimi' },
    { word: 'fizik', hint: 'Doğa bilimi' },
    { word: 'genetik', hint: 'Kalıtım bilimi' },
    { word: 'evrim', hint: 'Gelişim süreci' },
    { word: 'hücre', hint: 'Canlı birimi' },
    { word: 'atom', hint: 'Madde parçacığı' },
    { word: 'molekül', hint: 'Atomların birleşimi' },
    { word: 'enerji', hint: 'İş yapma gücü' },
    { word: 'kuvvet', hint: 'Hareket ettirme' },
    { word: 'kütle', hint: 'Madde miktarı' },
    { word: 'hız', hint: 'Hareket hızı' },
    { word: 'ivme', hint: 'Hız değişimi' },
    { word: 'sürtünme', hint: 'Yüzey direnci' },
    { word: 'yerçekimi', hint: 'Dünya çekimi' },
  ],
};

export default function WordHuntGame({ wordCount, onComplete, ageGroup }: WordHuntGameProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedWords, setSelectedWords] = useState<Array<{ word: string; hint: string }>>([]);
  const [scrambledWord, setScrambledWord] = useState('');

  useEffect(() => {
    const wordList = wordsByAge[ageGroup] || wordsByAge['8-10'];
    const shuffled = [...wordList].sort(() => Math.random() - 0.5).slice(0, wordCount);
    setSelectedWords(shuffled);
  }, [ageGroup]);

  useEffect(() => {
    if (selectedWords.length > 0) {
      generateScrambledWord();
    }
  }, [currentWord, selectedWords]);

  const generateScrambledWord = () => {
    if (!selectedWords[currentWord]) return;
    const word = selectedWords[currentWord].word;
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    setScrambledWord(scrambled);
    setAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const correctWord = selectedWords[currentWord].word.toLowerCase();
    const userAnswer = answer.toLowerCase().trim();

    if (userAnswer === correctWord) {
      setScore(score + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentWord + 1 < wordCount) {
        setCurrentWord(currentWord + 1);
      } else {
        const finalScore = userAnswer === correctWord ? score + 10 : score;
        onComplete(finalScore);
      }
    }, 1500);
  };

  if (selectedWords.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentWord + 1) / wordCount) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.questionNumber}>
        Kelime {currentWord + 1} / {wordCount}
      </Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Skor:</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.hintContainer}>
        <Text style={styles.hintLabel}>İpucu:</Text>
        <Text style={styles.hintText}>{selectedWords[currentWord].hint}</Text>
      </View>

      <View style={styles.scrambledContainer}>
        <Text style={styles.scrambledLabel}>Karışık Harfler:</Text>
        <Text style={styles.scrambledWord}>{scrambledWord}</Text>
      </View>

      <TextInput
        style={[
          styles.input,
          feedback === 'correct' && styles.inputCorrect,
          feedback === 'wrong' && styles.inputWrong,
        ]}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Kelimeyi yaz"
        editable={feedback === null}
        autoFocus
        autoCapitalize="none"
      />

      {feedback && (
        <Text style={[styles.feedback, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
          {feedback === 'correct' ? '✓ Doğru!' : `✗ Yanlış! Doğru kelime: ${selectedWords[currentWord].word}`}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, (!answer || feedback !== null) && styles.buttonDisabled]}
        onPress={checkAnswer}
        disabled={!answer || feedback !== null}
      >
        <Text style={styles.buttonText}>Cevapla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7FAFC',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9F7AEA',
    borderRadius: 4,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9F7AEA',
  },
  hintContainer: {
    backgroundColor: '#FAF5FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#9F7AEA',
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B46C1',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  scrambledContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scrambledLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 12,
  },
  scrambledWord: {
    fontSize: 36,
    fontWeight: '700',
    color: '#9F7AEA',
    letterSpacing: 4,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2D3748',
  },
  inputCorrect: {
    borderColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  inputWrong: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  feedback: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  feedbackCorrect: {
    color: '#48BB78',
  },
  feedbackWrong: {
    color: '#E53E3E',
  },
  button: {
    backgroundColor: '#9F7AEA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
