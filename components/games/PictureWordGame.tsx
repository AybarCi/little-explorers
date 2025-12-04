import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface PictureWordGameProps {
  onComplete: (score: number) => void;
  ageGroup: string;
}

interface WordPuzzle {
  word: string;
  emojis: string[];
  hint: string;
}

const wordsByAge: Record<string, WordPuzzle[]> = {
  '5-7': [
    { word: 'GÜNEŞ', emojis: ['☀️', '🌞', '🔆'], hint: 'Gökyüzünde parlayan' },
    { word: 'KELEBEK', emojis: ['🦋', '🌸', '✈️'], hint: 'Uçan renkli böcek' },
    { word: 'AĞAÇ', emojis: ['🌳', '🌲', '🍃'], hint: 'Yeşil ve büyük bitki' },
    { word: 'BALIK', emojis: ['🐟', '🐠', '🌊'], hint: 'Suda yaşar' },
    { word: 'YILDIZ', emojis: ['⭐', '✨', '🌟'], hint: 'Geceleyin parlar' },
    { word: 'KEDI', emojis: ['🐱', '🐈', '😺'], hint: 'Miyavlayan hayvan' },
    { word: 'KÖPEK', emojis: ['🐶', '🐕', '🦴'], hint: 'Havlayan hayvan' },
    { word: 'ELMA', emojis: ['🍎', '🍏', '🌳'], hint: 'Kırmızı meyve' },
    { word: 'ARABA', emojis: ['🚗', '🛞', '🚦'], hint: 'Yolda giden araç' },
    { word: 'EV', emojis: ['🏠', '🚪', '🪟'], hint: 'İçinde yaşarız' },
    { word: 'AYAKKABI', emojis: ['👟', '👣', '🚶'], hint: 'Ayağa giyilir' },
    { word: 'ÇİÇEK', emojis: ['🌸', '🌺', '🌼'], hint: 'Güzel kokulu bitki' },
    { word: 'KALP', emojis: ['❤️', '💓', '💗'], hint: 'Sevgiyi gösterir' },
    { word: 'KUŞU', emojis: ['🐦', '🪶', '🎶'], hint: 'Uçan hayvan' },
    { word: 'PASTA', emojis: ['🎂', '🕯️', '🎉'], hint: 'Doğum gününde yeriz' },
    { word: 'KİTAP', emojis: ['📖', '📚', '✏️'], hint: 'Okumak için kullanırız' },
    { word: 'TOP', emojis: ['⚽', '🏀', '⚾'], hint: 'Oyunda kullanırız' },
    { word: 'BULUT', emojis: ['☁️', '🌥️', '⛅'], hint: 'Gökyüzünde beyaz' },
    { word: 'SAAT', emojis: ['⏰', '🕐', '⌚'], hint: 'Zamanı gösterir' },
    { word: 'BUZ', emojis: ['🧊', '❄️', '⛄'], hint: 'Soğuk ve sert su' },
    { word: 'OYUNCAK', emojis: ['🧸', '🪀', '🎮'], hint: 'Oynarken kullanırız' },
    { word: 'AYAKKABI', emojis: ['👞', '👠', '🥾'], hint: 'Ayağa giyilen' },
    { word: 'ŞAPKA', emojis: ['🎩', '👒', '🧢'], hint: 'Başa takılır' },
    { word: 'PORTAKAL', emojis: ['🍊', '🟠', '🌳'], hint: 'Turuncu meyve' },
    { word: 'SÜT', emojis: ['🥛', '🐄', '🍼'], hint: 'Beyaz içecek' },
    { word: 'YAĞMUR', emojis: ['🌧️', '☔', '💧'], hint: 'Gökten su yağar' },
    { word: 'KAR', emojis: ['❄️', '⛄', '🎿'], hint: 'Kışın beyaz yağar' },
    { word: 'GÜL', emojis: ['🌹', '🥀', '💐'], hint: 'Dikenli güzel çiçek' },
    { word: 'KAPLUMBAĞA', emojis: ['🐢', '🏠', '🐌'], hint: 'Yavaş hareket eder' },
    { word: 'PİYANO', emojis: ['🎹', '🎵', '🎶'], hint: 'Tuşlu müzik aleti' },
  ],
  '8-10': [
    { word: 'BİLGİSAYAR', emojis: ['💻', '⌨️', '🖱️'], hint: 'Elektronik cihaz' },
    { word: 'GÖKKUŞAĞI', emojis: ['🌈', '☔', '☀️'], hint: 'Yağmurdan sonra görünür' },
    { word: 'OKUL', emojis: ['🏫', '📚', '✏️'], hint: 'Ders yapılan yer' },
    { word: 'FUTBOL', emojis: ['⚽', '🥅', '👟'], hint: 'Popüler spor' },
    { word: 'MÜZİK', emojis: ['🎵', '🎸', '🎤'], hint: 'Ses sanatı' },
    { word: 'DENİZ', emojis: ['🌊', '🏖️', '🐚'], hint: 'Büyük su kütlesi' },
    { word: 'ROKET', emojis: ['🚀', '🌙', '⭐'], hint: 'Uzaya gider' },
    { word: 'KARPUZ', emojis: ['🍉', '🌞', '🔴'], hint: 'Yazın yenen büyük meyve' },
    { word: 'HASTANE', emojis: ['🏥', '👨‍⚕️', '💊'], hint: 'Hastaların gittiği yer' },
    { word: 'KÜTÜPHANE', emojis: ['📚', '📖', '🤫'], hint: 'Kitap okunan sessiz yer' },
    { word: 'PARK', emojis: ['🌳', '🎠', '⛲'], hint: 'Çocuklar oynayabilir' },
    { word: 'PIZZA', emojis: ['🍕', '🧀', '🍅'], hint: 'Yuvarlak İtalyan yemeği' },
    { word: 'KARDAN ADAM', emojis: ['⛄', '❄️', '🥕'], hint: 'Kışın kardan yapılır' },
    { word: 'TELEFON', emojis: ['📱', '📞', '💬'], hint: 'Konuşmak için kullanırız' },
    { word: 'UÇAK', emojis: ['✈️', '🛫', '☁️'], hint: 'Gökyüzünde uçar' },
    { word: 'TRENİ', emojis: ['🚂', '🛤️', '🚉'], hint: 'Rayda gider' },
    { word: 'KÖPRÜ', emojis: ['🌉', '🌊', '🚗'], hint: 'İki yakayı birleştirir' },
    { word: 'HAVUZ', emojis: ['🏊', '💧', '☀️'], hint: 'Yüzmek için kullanırız' },
    { word: 'OYUNCAK', emojis: ['🧸', '🎮', '🎪'], hint: 'Oynamak için' },
    { word: 'DONDURMA', emojis: ['🍦', '🍨', '🥶'], hint: 'Soğuk tatlı' },
    { word: 'ŞEKER', emojis: ['🍬', '🍭', '🍫'], hint: 'Tatlı gıda' },
    { word: 'HAMBURGER', emojis: ['🍔', '🍟', '🥤'], hint: 'Fast food yemek' },
    { word: 'BİSİKLET', emojis: ['🚴', '🚲', '🛞'], hint: 'İki tekerlekli araç' },
    { word: 'KALEM', emojis: ['✏️', '✍️', '📝'], hint: 'Yazmaya yarıyor' },
    { word: 'GÜNEŞ GÖZLÜĞÜ', emojis: ['🕶️', '☀️', '😎'], hint: 'Güneşten korur' },
    { word: 'ŞEMSİYE', emojis: ['☂️', '☔', '🌧️'], hint: 'Yağmurdan korur' },
    { word: 'ÇANTA', emojis: ['🎒', '👜', '💼'], hint: 'Eşya taşımaya yarar' },
    { word: 'SANDVIÇ', emojis: ['🥪', '🍞', '🧀'], hint: 'Ekmek arası yemek' },
    { word: 'KURABIYE', emojis: ['🍪', '🥛', '🍫'], hint: 'Küçük tatlı' },
    { word: 'ROBOT', emojis: ['🤖', '⚙️', '🔌'], hint: 'Mekanik akıllı cihaz' },
  ],
  '11-13': [
    { word: 'TEKNOLOJI', emojis: ['📱', '💻', '🤖'], hint: 'Gelişmiş sistem' },
    { word: 'SANAT', emojis: ['🎨', '🖼️', '🖌️'], hint: 'Yaratıcılık' },
    { word: 'MACERA', emojis: ['🗺️', '🧭', '⛰️'], hint: 'Heyecanlı yolculuk' },
    { word: 'ÖZGÜRLÜK', emojis: ['🕊️', '🦅', '🌍'], hint: 'Bağımsızlık' },
    { word: 'DOSTLUK', emojis: ['🤝', '❤️', '👥'], hint: 'Arkadaşlık bağı' },
    { word: 'HAYAL', emojis: ['💭', '🌟', '🎯'], hint: 'Düşlerde' },
    { word: 'BİLİM', emojis: ['🔬', '🧪', '⚗️'], hint: 'Araştırma ve deney' },
    { word: 'EVREN', emojis: ['🌌', '🪐', '🌠'], hint: 'Sonsuz uzay' },
    { word: 'MÜHENDİSLİK', emojis: ['⚙️', '🔧', '🏗️'], hint: 'Teknik tasarım' },
    { word: 'PROGRAMLAMA', emojis: ['💻', '⌨️', '🖥️'], hint: 'Kod yazma' },
    { word: 'MATEMATİK', emojis: ['➕', '➖', '✖️'], hint: 'Sayılar bilimi' },
    { word: 'COĞRAFYA', emojis: ['🗺️', '🌍', '🧭'], hint: 'Yer bilimi' },
    { word: 'EDEBİYAT', emojis: ['📚', '✍️', '📖'], hint: 'Yazı sanatı' },
    { word: 'MÜZİK ALETİ', emojis: ['🎸', '🎹', '🥁'], hint: 'Ses çıkaran alet' },
    { word: 'SPOR', emojis: ['⚽', '🏀', '🏃'], hint: 'Fiziksel aktivite' },
    { word: 'SINAV', emojis: ['📝', '✏️', '📊'], hint: 'Bilgi ölçme' },
    { word: 'PROJE', emojis: ['📋', '💡', '🎯'], hint: 'Planlı çalışma' },
    { word: 'DENEY', emojis: ['🧪', '🔬', '⚗️'], hint: 'Bilimsel test' },
    { word: 'KEŞİF', emojis: ['🔍', '🧭', '🗺️'], hint: 'Yeni bulma' },
    { word: 'YARATICILIK', emojis: ['💡', '🎨', '✨'], hint: 'Yenilikçi düşünce' },
    { word: 'GELECEK', emojis: ['🔮', '⏭️', '🚀'], hint: 'Önümüzdeki zaman' },
    { word: 'YETENEK', emojis: ['⭐', '🎭', '🎪'], hint: 'Özel kabiliyet' },
    { word: 'CESARET', emojis: ['🦁', '🛡️', '⚔️'], hint: 'Korkmama' },
    { word: 'BAŞARI', emojis: ['🏆', '🥇', '🎖️'], hint: 'Hedefe ulaşma' },
    { word: 'MERAK', emojis: ['🤔', '❓', '🔍'], hint: 'Bilme isteği' },
    { word: 'ARAŞTIRMA', emojis: ['🔬', '📊', '📈'], hint: 'Bilgi toplama' },
    { word: 'İNOVASYON', emojis: ['💡', '🚀', '⚡'], hint: 'Yenilik' },
    { word: 'STRATEJI', emojis: ['♟️', '🎯', '🧠'], hint: 'Planlı hareket' },
    { word: 'REKABET', emojis: ['🏃', '🥊', '⚡'], hint: 'Yarışma' },
    { word: 'MOTIVASYON', emojis: ['💪', '🔥', '⚡'], hint: 'İçsel güç' },
  ],
  '14+': [
    { word: 'FELSEFİ', emojis: ['🤔', '💭', '📖'], hint: 'Düşünsel' },
    { word: 'YARATICILIK', emojis: ['💡', '🎨', '✨'], hint: 'Yenilik üretme' },
    { word: 'HEYECAN', emojis: ['🎢', '⚡', '💥'], hint: 'Güçlü duygu' },
    { word: 'BAŞARI', emojis: ['🏆', '🎯', '⭐'], hint: 'Hedefe ulaşma' },
    { word: 'COŞKU', emojis: ['🎉', '🎊', '😃'], hint: 'Yoğun sevinç' },
    { word: 'DEVRİM', emojis: ['⚙️', '🔄', '💥'], hint: 'Büyük değişim' },
    { word: 'TUTKU', emojis: ['❤️', '🔥', '💪'], hint: 'Güçlü istek' },
    { word: 'UMUT', emojis: ['🌅', '🕊️', '💫'], hint: 'Gelecek beklentisi' },
    { word: 'ENTELEKTÜELLİK', emojis: ['🧠', '📚', '🎓'], hint: 'Bilgi birikimi' },
    { word: 'FARKINDAL IK', emojis: ['👁️', '🧘', '💭'], hint: 'Bilinçli olma' },
    { word: 'POTANSİYEL', emojis: ['💎', '🌱', '⚡'], hint: 'Gizli güç' },
    { word: 'VİZYON', emojis: ['🔭', '🌟', '🎯'], hint: 'Uzak görüş' },
    { word: 'DÖNÜŞÜM', emojis: ['🦋', '🔄', '✨'], hint: 'Değişim süreci' },
    { word: 'KALİTE', emojis: ['⭐', '💎', '🏆'], hint: 'Mükemmellik' },
    { word: 'ETİK', emojis: ['⚖️', '💭', '✅'], hint: 'Ahlaki değerler' },
    { word: 'SEZGI', emojis: ['🔮', '💡', '🧠'], hint: 'İçgüdüsel anlayış' },
    { word: 'DENGE', emojis: ['⚖️', '☯️', '🧘'], hint: 'Uyum hali' },
    { word: 'SENTEZİ', emojis: ['🔗', '🧩', '⚗️'], hint: 'Birleştirme' },
    { word: 'ANALİZ', emojis: ['🔬', '📊', '🔍'], hint: 'Ayrıntılı inceleme' },
    { word: 'HİPOTEZ', emojis: ['🤔', '📝', '🔬'], hint: 'Bilimsel tahmin' },
    { word: 'PARADOKS', emojis: ['🤯', '♾️', '🔄'], hint: 'Çelişkili durum' },
    { word: 'OPTİMİZASYON', emojis: ['⚡', '📈', '🎯'], hint: 'En iyileştirme' },
    { word: 'DİNAMİZM', emojis: ['⚡', '🔄', '💨'], hint: 'Hareketlilik' },
    { word: 'KARİZMA', emojis: ['✨', '👑', '🌟'], hint: 'Çekici kişilik' },
    { word: 'ESTETİK', emojis: ['🎨', '💎', '✨'], hint: 'Güzellik anlayışı' },
    { word: 'İDEOLOJİ', emojis: ['💭', '📚', '⚖️'], hint: 'Düşünce sistemi' },
    { word: 'SENTEZ', emojis: ['🔗', '🧪', '⚡'], hint: 'Birleştirme işlemi' },
    { word: 'METAFİZİK', emojis: ['🌌', '💭', '♾️'], hint: 'Varlık felsefesi' },
    { word: 'DİYALEKTİK', emojis: ['⚖️', '🔄', '💬'], hint: 'Tartışma yöntemi' },
    { word: 'AMPİRİZM', emojis: ['🔬', '👁️', '📊'], hint: 'Deneyselcilik' },
  ],
};

export default function PictureWordGame({ onComplete, ageGroup }: PictureWordGameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzle | null>(null);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const maxRounds = 5;

  useEffect(() => {
    loadNewPuzzle();
  }, []);

  const loadNewPuzzle = () => {
    const puzzles = wordsByAge[ageGroup] || wordsByAge['8-10'];
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setCurrentPuzzle(puzzle);

    const letters = puzzle.word.split('');
    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇĞİÖŞÜ'
      .split('')
      .filter(l => !letters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const allLetters = [...letters, ...extraLetters]
      .sort(() => Math.random() - 0.5);

    setAvailableLetters(allLetters);
    setSelectedLetters([]);
    setShowHint(false);
  };

  const handleLetterPress = (letter: string, index: number) => {
    setSelectedLetters([...selectedLetters, letter]);
    setAvailableLetters(availableLetters.filter((_, i) => i !== index));
  };

  const handleSelectedLetterPress = (index: number) => {
    const letter = selectedLetters[index];
    setAvailableLetters([...availableLetters, letter]);
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    if (!currentPuzzle) return;

    const answer = selectedLetters.join('');
    if (answer === currentPuzzle.word) {
      const roundScore = Math.max(20 - mistakes * 2, 5);
      setScore(score + roundScore);

      if (currentRound >= maxRounds) {
        setTimeout(() => onComplete(score + roundScore), 500);
      } else {
        setCurrentRound(currentRound + 1);
        setMistakes(0);
        setTimeout(() => loadNewPuzzle(), 1000);
      }
    } else {
      setMistakes(mistakes + 1);
      setAvailableLetters([...availableLetters, ...selectedLetters]);
      setSelectedLetters([]);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setMistakes(mistakes + 1);
  };

  if (!currentPuzzle) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tur</Text>
          <Text style={styles.statValue}>{currentRound} / {maxRounds}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Puan</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Hata</Text>
          <Text style={styles.statValue}>{mistakes}</Text>
        </View>
      </View>

      <View style={styles.emojiContainer}>
        {currentPuzzle.emojis.map((emoji, index) => (
          <Text key={index} style={styles.emoji}>{emoji}</Text>
        ))}
      </View>

      {showHint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>💡 {currentPuzzle.hint}</Text>
        </View>
      )}

      <View style={styles.answerContainer}>
        <Text style={styles.answerLabel}>Cevabın:</Text>
        <View style={styles.answerBox}>
          {selectedLetters.length === 0 ? (
            <Text style={styles.placeholderText}>Harfleri seç...</Text>
          ) : (
            selectedLetters.map((letter, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectedLetter}
                onPress={() => handleSelectedLetterPress(index)}
              >
                <Text style={styles.selectedLetterText}>{letter}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      <View style={styles.lettersContainer}>
        <Text style={styles.lettersLabel}>Harfler:</Text>
        <View style={styles.lettersGrid}>
          {availableLetters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.letterButton}
              onPress={() => handleLetterPress(letter, index)}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.hintButton]}
          onPress={handleHint}
          disabled={showHint}
        >
          <Text style={styles.buttonText}>💡 İpucu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.checkButton,
            selectedLetters.length === 0 && styles.buttonDisabled,
          ]}
          onPress={handleCheck}
          disabled={selectedLetters.length === 0}
        >
          <Text style={styles.buttonText}>✓ Kontrol Et</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 8,
  },
  statBox: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  emoji: {
    fontSize: 56,
  },
  hintBox: {
    backgroundColor: '#FFF8DC',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  hintText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
    textAlign: 'center',
  },
  answerContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  answerBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    minHeight: 70,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4299E1',
    gap: 8,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
  selectedLetter: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3182CE',
  },
  selectedLetterText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  lettersContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  lettersLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  letterButton: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E0',
  },
  letterText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  hintButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
  },
  checkButton: {
    backgroundColor: '#48BB78',
    borderColor: '#38A169',
  },
  buttonDisabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
