import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HangmanGameProps {
  wordCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

const wordsByAge: Record<string, Array<{ word: string; hint: string }>> = {
  '5-7': [
    { word: 'KEDI', hint: 'Miyavlayan hayvan' },
    { word: 'KÖPEK', hint: 'Havlayan hayvan' },
    { word: 'ELMA', hint: 'Kırmızı bir meyve' },
    { word: 'TOP', hint: 'Onunla oynarız' },
    { word: 'GÜNEŞ', hint: 'Gökyüzünde parlayan' },
    { word: 'AY', hint: 'Gece görürüz' },
    { word: 'DENIZ', hint: 'Çok su var' },
    { word: 'AĞAÇ', hint: 'Yeşil yaprakları var' },
    { word: 'KUŞ', hint: 'Uçan hayvan' },
    { word: 'BALIK', hint: 'Suda yaşar' },
    { word: 'ARABA', hint: 'Yolda giden taşıt' },
    { word: 'EV', hint: 'İçinde yaşarız' },
    { word: 'ANNE', hint: 'Kadın ebeveyn' },
    { word: 'BABA', hint: 'Erkek ebeveyn' },
    { word: 'SU', hint: 'İçeriz' },
    { word: 'EKMEK', hint: 'Her gün yeriz' },
    { word: 'ÇİÇEK', hint: 'Güzel kokulu' },
    { word: 'YILDIZ', hint: 'Gece parlar' },
    { word: 'BULUT', hint: 'Gökte beyaz' },
    { word: 'YAĞMUR', hint: 'Gökten yağar' },
    { word: 'KAR', hint: 'Kışın beyaz' },
    { word: 'KELEBEK', hint: 'Renkli uçar' },
    { word: 'ARI', hint: 'Bal yapar' },
    { word: 'TAVŞAN', hint: 'Uzun kulaklı' },
    { word: 'FİL', hint: 'Çok büyük' },
    { word: 'ASLAN', hint: 'Ormanın kralı' },
    { word: 'AYAKKABI', hint: 'Ayağa giyilir' },
    { word: 'ŞAPKA', hint: 'Başa takılır' },
    { word: 'PASTA', hint: 'Doğum günü' },
    { word: 'BALON', hint: 'Uçar, renkli' },
  ],
  '8-10': [
    { word: 'BİLGİSAYAR', hint: 'İnternete girdiğimiz cihaz' },
    { word: 'OKUL', hint: 'Ders yaptığımız yer' },
    { word: 'KALEM', hint: 'Yazmak için kullanırız' },
    { word: 'DEFTER', hint: 'Yazı yazdığımız' },
    { word: 'FUTBOL', hint: 'Topla oynanan spor' },
    { word: 'MÜZİK', hint: 'Ses ve ritim sanatı' },
    { word: 'OYUN', hint: 'Eğlence için yapılan' },
    { word: 'ARKADAŞ', hint: 'Beraber oynadığımız' },
    { word: 'AİLE', hint: 'Anne baba ve çocuklar' },
    { word: 'HAYVAN', hint: 'Canlı varlıklar' },
    { word: 'ÖĞRETMEN', hint: 'Ders anlatan' },
    { word: 'ÖĞRENCİ', hint: 'Ders dinleyen' },
    { word: 'SINIF', hint: 'Ders yapılan oda' },
    { word: 'KİTAP', hint: 'Okumak için' },
    { word: 'SİLGİ', hint: 'Yanlış siler' },
    { word: 'CETVEL', hint: 'Çizgi çeker' },
    { word: 'RENK', hint: 'Boyama için' },
    { word: 'RESİM', hint: 'Çizim yaparız' },
    { word: 'SPOR', hint: 'Fiziksel aktivite' },
    { word: 'SAĞLIK', hint: 'İyi olma hali' },
    { word: 'HASTANE', hint: 'Tedavi yeri' },
    { word: 'DOKTOR', hint: 'Tedavi eder' },
    { word: 'HEMŞIRE', hint: 'Bakım yapar' },
    { word: 'ECZANE', hint: 'İlaç satılan' },
    { word: 'MARKET', hint: 'Alışveriş yeri' },
    { word: 'PARK', hint: 'Oyun alanı' },
    { word: 'BAHÇE', hint: 'Çiçek yeri' },
    { word: 'KÜTÜPHANE', hint: 'Kitap evi' },
    { word: 'MÜZİK', hint: 'Melodi sanatı' },
    { word: 'DANS', hint: 'Hareket sanatı' },
  ],
  '11-13': [
    { word: 'TEKNOLOJİ', hint: 'Bilim ve cihazlar' },
    { word: 'MATEMATİK', hint: 'Sayılar dersi' },
    { word: 'COĞRAFYA', hint: 'Ülkeler ve haritalar' },
    { word: 'EDEBİYAT', hint: 'Kitaplar ve yazarlar' },
    { word: 'TARİH', hint: 'Geçmiş olaylar' },
    { word: 'KİMYA', hint: 'Elementler ve reaksiyonlar' },
    { word: 'FİZİK', hint: 'Enerji ve madde' },
    { word: 'BİYOLOJİ', hint: 'Canlılar bilimi' },
    { word: 'MÜHENDİS', hint: 'Teknik işler yapan' },
    { word: 'DOKTOR', hint: 'Hastaları iyileştiren' },
    { word: 'AVUKAT', hint: 'Hukuk uzmanı' },
    { word: 'ÖĞRETMEN', hint: 'Eğitim veren' },
    { word: 'MIMAR', hint: 'Bina tasarlayan' },
    { word: 'SANATÇI', hint: 'Sanat yapan' },
    { word: 'YAZAR', hint: 'Kitap yazan' },
    { word: 'GAZETECİ', hint: 'Haber yapan' },
    { word: 'SPORCU', hint: 'Spor yapan' },
    { word: 'BİLİM', hint: 'Araştırma alanı' },
    { word: 'SANAT', hint: 'Yaratıcılık' },
    { word: 'KÜLTÜR', hint: 'Toplum değerleri' },
    { word: 'MEDYA', hint: 'İletişim araçları' },
    { word: 'İNTERNET', hint: 'Ağ sistemi' },
    { word: 'UYGULAMA', hint: 'Yazılım programı' },
    { word: 'VERİTABANI', hint: 'Bilgi deposu' },
    { word: 'KODLAMA', hint: 'Program yazma' },
    { word: 'TASARIM', hint: 'Görsel planlama' },
    { word: 'PROJE', hint: 'Planlı çalışma' },
    { word: 'ARAŞTIRMA', hint: 'Bilgi toplama' },
    { word: 'DENEY', hint: 'Bilimsel test' },
    { word: 'GÖZLEM', hint: 'Dikkatle bakma' },
  ],
  '14+': [
    { word: 'ALGORİTMA', hint: 'Problem çözme adımları' },
    { word: 'EKOSİSTEM', hint: 'Canlılar ve çevre dengesi' },
    { word: 'FOTOSENTEZ', hint: 'Bitkilerin besin üretimi' },
    { word: 'DEMOKRASİ', hint: 'Halkın yönetim şekli' },
    { word: 'KÜRESELLEŞME', hint: 'Dünya çapında bütünleşme' },
    { word: 'EVRENSEL', hint: 'Tüm dünyayı kapsayan' },
    { word: 'FELSEFECİ', hint: 'Bilgelik seven düşünür' },
    { word: 'ASTRONOMİ', hint: 'Gök cisimleri bilimi' },
    { word: 'JEOLOJİ', hint: 'Yer bilimi' },
    { word: 'PSİKOLOJİ', hint: 'Ruh bilimi' },
    { word: 'SOSYOLOJİ', hint: 'Toplum bilimi' },
    { word: 'ANTROPOLOJİ', hint: 'İnsan bilimi' },
    { word: 'ARKEOLOJİ', hint: 'Eski eserler bilimi' },
    { word: 'GENETİK', hint: 'Kalıtım bilimi' },
    { word: 'EVRİM', hint: 'Gelişim teorisi' },
    { word: 'MOLEKÜL', hint: 'Atom birleşimi' },
    { word: 'ATOM', hint: 'Madde parçası' },
    { word: 'ENERJİ', hint: 'İş yapma gücü' },
    { word: 'KUVVET', hint: 'Hareket ettirme' },
    { word: 'KÜTLE', hint: 'Madde miktarı' },
    { word: 'İVME', hint: 'Hız değişimi' },
    { word: 'SÜRTÜNME', hint: 'Yüzey direnci' },
    { word: 'YERÇEKİMİ', hint: 'Dünya çekimi' },
    { word: 'KUANTUM', hint: 'En küçük birim' },
    { word: 'RELATIF', hint: 'Göreceli' },
    { word: 'PARADOKS', hint: 'Çelişkili durum' },
    { word: 'HİPOTEZ', hint: 'Bilimsel tahmin' },
    { word: 'ANALİZ', hint: 'Ayrıntılı inceleme' },
    { word: 'SENTEZİ', hint: 'Birleştirme' },
    { word: 'DENGE', hint: 'Uyum hali' },
  ],
};

const TURKISH_ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

export default function HangmanGame({ wordCount, onComplete, ageGroup }: HangmanGameProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<typeof wordsByAge['8-10']>([]);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const maxWrongGuesses = 6;

  useEffect(() => {
    const wordList = wordsByAge[ageGroup] || wordsByAge['8-10'];
    const shuffled = [...wordList].sort(() => Math.random() - 0.5).slice(0, wordCount);
    setSelectedWords(shuffled);
  }, [ageGroup]);

  const currentWordData = selectedWords[currentWord];
  const word = currentWordData?.word || '';
  const hint = currentWordData?.hint || '';

  const displayWord = word
    .split('')
    .map((letter) => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ');

  const isWordComplete = word.split('').every((letter) => guessedLetters.has(letter));

  useEffect(() => {
    if (word && isWordComplete && gameState === 'playing') {
      setGameState('won');
      const earnedPoints = Math.max(20 - wrongGuesses * 2, 5);
      setScore(score + earnedPoints);

      setTimeout(() => {
        if (currentWord + 1 < wordCount) {
          setCurrentWord(currentWord + 1);
          setGuessedLetters(new Set());
          setWrongGuesses(0);
          setGameState('playing');
        } else {
          onComplete(score + earnedPoints);
        }
      }, 2000);
    }
  }, [isWordComplete, gameState]);

  useEffect(() => {
    if (wrongGuesses >= maxWrongGuesses && gameState === 'playing') {
      setGameState('lost');

      setTimeout(() => {
        if (currentWord + 1 < wordCount) {
          setCurrentWord(currentWord + 1);
          setGuessedLetters(new Set());
          setWrongGuesses(0);
          setGameState('playing');
        } else {
          onComplete(score);
        }
      }, 2000);
    }
  }, [wrongGuesses, gameState]);

  const handleLetterPress = (letter: string) => {
    if (gameState !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const renderHangman = () => {
    return (
      <View style={styles.hangmanContainer}>
        <View style={styles.gallows}>
          <Text style={styles.gallowsText}>┏━━━━┓</Text>
          <Text style={styles.gallowsText}>┃    │</Text>
          <Text style={styles.gallowsText}>┃{wrongGuesses > 0 ? '    ○' : '     '}</Text>
          <Text style={styles.gallowsText}>┃{wrongGuesses > 1 ? (wrongGuesses > 2 ? (wrongGuesses > 3 ? '   /|\\' : '   /|') : '    |') : '     '}</Text>
          <Text style={styles.gallowsText}>┃{wrongGuesses > 4 ? (wrongGuesses > 5 ? '   / \\' : '   /') : '     '}</Text>
          <Text style={styles.gallowsText}>┃</Text>
          <Text style={styles.gallowsText}>━━━━━━</Text>
        </View>
        <View style={styles.wrongGuessesInfo}>
          <Text style={styles.wrongGuessesText}>
            Yanlış: {wrongGuesses} / {maxWrongGuesses}
          </Text>
        </View>
      </View>
    );
  };

  if (!currentWordData) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {renderHangman()}

        <View style={styles.hintContainer}>
          <Text style={styles.hintLabel}>İpucu:</Text>
          <Text style={styles.hintText}>{hint}</Text>
        </View>

        <View style={styles.wordContainer}>
          <Text
            style={styles.wordText}
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {displayWord}
          </Text>
        </View>

        {gameState === 'won' && (
          <Text style={styles.feedbackWon}>✓ Doğru! Kelime: {word}</Text>
        )}

        {gameState === 'lost' && (
          <Text style={styles.feedbackLost}>✗ Kaybettiniz! Kelime: {word}</Text>
        )}

        <View style={styles.keyboardContainer}>
          {TURKISH_ALPHABET.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isCorrect = isGuessed && word.includes(letter);
            const isWrong = isGuessed && !word.includes(letter);

            return (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.letterKey,
                  isCorrect && styles.letterKeyCorrect,
                  isWrong && styles.letterKeyWrong,
                  isGuessed && styles.letterKeyDisabled,
                ]}
                onPress={() => handleLetterPress(letter)}
                disabled={isGuessed || gameState !== 'playing'}
              >
                <Text
                  style={[
                    styles.letterKeyText,
                    isGuessed && styles.letterKeyTextDisabled,
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const LETTER_SIZE = Math.min((SCREEN_WIDTH - 48) / 8, 50);
const PADDING = SCREEN_WIDTH < 375 ? 12 : 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    padding: PADDING,
    paddingBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F56565',
    borderRadius: 3,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginRight: 6,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F56565',
  },
  hangmanContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  gallows: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  gallowsText: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#2D3748',
    lineHeight: 22,
  },
  wrongGuessesInfo: {
    marginTop: 8,
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  wrongGuessesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
  },
  hintContainer: {
    backgroundColor: '#FFFAF0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F56565',
  },
  hintLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C53030',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minHeight: 60,
    justifyContent: 'center',
  },
  wordText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    letterSpacing: 4,
    textAlign: 'center',
    width: '100%',
  },
  feedbackWon: {
    fontSize: 15,
    fontWeight: '600',
    color: '#48BB78',
    textAlign: 'center',
    marginBottom: 12,
  },
  feedbackLost: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 12,
  },
  keyboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  letterKey: {
    width: LETTER_SIZE,
    height: LETTER_SIZE,
    backgroundColor: 'white',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  letterKeyCorrect: {
    backgroundColor: '#F0FFF4',
    borderColor: '#48BB78',
  },
  letterKeyWrong: {
    backgroundColor: '#FFF5F5',
    borderColor: '#E53E3E',
  },
  letterKeyDisabled: {
    opacity: 0.5,
  },
  letterKeyText: {
    fontSize: LETTER_SIZE * 0.4,
    fontWeight: '700',
    color: '#2D3748',
  },
  letterKeyTextDisabled: {
    color: '#A0AEC0',
  },
});
