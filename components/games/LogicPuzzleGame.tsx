import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface LogicPuzzleGameProps {
  puzzleCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

interface Puzzle {
  question: string;
  options: string[];
  correctAnswer: number;
}

const puzzlesByAge: Record<string, Puzzle[]> = {
  '5-7': [
    {
      question: 'Bir sepette 4 elma var. 2 elma daha koyarsak kaç elma olur?',
      options: ['5', '6', '7', '4'],
      correctAnswer: 1,
    },
    {
      question: 'Kedi bir hayvandır. Köpek de bir hayvandır. Araba bir hayvan mıdır?',
      options: ['Evet', 'Hayır', 'Bazen', 'Bilmiyorum'],
      correctAnswer: 1,
    },
    {
      question: '2, 4, 6, ? - Sıradaki sayı nedir?',
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
    },
    {
      question: 'Bir kedi 4 ayaklıdır. 2 kedi kaç ayak yapar?',
      options: ['6', '8', '10', '4'],
      correctAnswer: 1,
    },
    {
      question: 'Hangisi daha büyüktür?',
      options: ['3', '5', '2', '1'],
      correctAnswer: 1,
    },
    {
      question: 'Kırmızı ve sarı renklerini karıştırırsak ne olur?',
      options: ['Mavi', 'Yeşil', 'Turuncu', 'Mor'],
      correctAnswer: 2,
    },
    {
      question: 'Bir günde kaç saat vardır?',
      options: ['12', '24', '48', '10'],
      correctAnswer: 1,
    },
    {
      question: 'Daire hangi şekildir?',
      options: ['Üçgen', 'Kare', 'Yuvarlak', 'Dikdörtgen'],
      correctAnswer: 2,
    },
    {
      question: 'Bir haftada kaç gün vardır?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 2,
    },
    {
      question: '3 balonu var. 1 tanesi patladı. Kaç balonu kaldı?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
    },
    {
      question: '1, 2, 3, ? - Sıradaki sayı nedir?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 0,
    },
    {
      question: 'Bir üçgenin kaç köşesi vardır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 1,
    },
    {
      question: '5 kuş ağaçta. 2 tanesi uçtu. Kaç kuş kaldı?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 1,
    },
    {
      question: 'Hangisi daha küçüktür?',
      options: ['8', '5', '9', '7'],
      correctAnswer: 1,
    },
    {
      question: 'Kare kaç kenarlıdır?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
    {
      question: 'Bir ayda kaç hafta vardır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
    },
    {
      question: 'Mavi ve sarı karışımı ne verir?',
      options: ['Kırmızı', 'Yeşil', 'Turuncu', 'Mor'],
      correctAnswer: 1,
    },
    {
      question: '10, 9, 8, ? - Sıradaki sayı nedir?',
      options: ['7', '6', '5', '4'],
      correctAnswer: 0,
    },
    {
      question: 'Bir yılda kaç ay vardır?',
      options: ['10', '11', '12', '13'],
      correctAnswer: 2,
    },
    {
      question: '2 + 2 = ?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
    {
      question: 'Dikdörtgen kaç kenarlıdır?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
    {
      question: '6 - 2 = ?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
    {
      question: 'Hangisi çift sayıdır?',
      options: ['1', '2', '3', '5'],
      correctAnswer: 1,
    },
    {
      question: 'Hangisi tek sayıdır?',
      options: ['2', '3', '4', '6'],
      correctAnswer: 1,
    },
    {
      question: '3 + 1 = ?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
    },
  ],
  '8-10': [
    {
      question: 'Bir çiftlikte 5 tavuk var. Her tavuğun 2 ayağı var. Toplamda kaç ayak vardır?',
      options: ['5', '7', '10', '15'],
      correctAnswer: 2,
    },
    {
      question: 'Ali, Ayşe\'den daha uzun. Mehmet, Ali\'den daha kısa. En uzun kim?',
      options: ['Ali', 'Ayşe', 'Mehmet', 'Eşitler'],
      correctAnswer: 0,
    },
    {
      question: '2, 4, 8, 16, ? - Sıradaki sayı nedir?',
      options: ['24', '32', '20', '18'],
      correctAnswer: 1,
    },
    {
      question: 'Bir sayının 2 katı 12 ise, bu sayı kaçtır?',
      options: ['4', '6', '8', '10'],
      correctAnswer: 1,
    },
    {
      question: 'Bir ailede 2 ebeveyn ve 2 çocuk var. Toplamda kaç kişi vardır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
    },
    {
      question: '1, 3, 5, 7, ? - Sıradaki sayı nedir?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 1,
    },
    {
      question: 'Bir kutuda 10 elma var. 3 elmayı çıkarırsam kaç elma kalır?',
      options: ['3', '7', '10', '13'],
      correctAnswer: 1,
    },
    {
      question: '3 kardeş bir odada. Her biri 1 kitap okuyor. Odada kaç kitap var?',
      options: ['1', '2', '3', '6'],
      correctAnswer: 2,
    },
    {
      question: 'Hangisi çift sayıdır?',
      options: ['5', '7', '9', '12'],
      correctAnswer: 3,
    },
    {
      question: 'Bir üçgenin kaç köşesi vardır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 1,
    },
    {
      question: '10, 20, 30, ? - Sıradaki sayı nedir?',
      options: ['35', '40', '45', '50'],
      correctAnswer: 1,
    },
    {
      question: 'Bir dikdörtgenin kaç köşesi vardır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
    },
    {
      question: '15 - 7 = ?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
    },
    {
      question: '5 x 3 = ?',
      options: ['10', '12', '15', '18'],
      correctAnswer: 2,
    },
    {
      question: '100, 90, 80, ? - Sıradaki sayı nedir?',
      options: ['60', '70', '75', '65'],
      correctAnswer: 1,
    },
    {
      question: 'Bir kare kaç kenara sahiptir?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
    },
    {
      question: '20 ÷ 4 = ?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
    {
      question: 'Dört mevsim vardır. Sonbahardan sonra hangi mevsim gelir?',
      options: ['İlkbahar', 'Yaz', 'Kış', 'Sonbahar'],
      correctAnswer: 2,
    },
    {
      question: 'Bir beşgenin kaç köşesi vardır?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
    },
    {
      question: '7 + 8 = ?',
      options: ['13', '14', '15', '16'],
      correctAnswer: 2,
    },
    {
      question: '50 - 25 = ?',
      options: ['20', '25', '30', '35'],
      correctAnswer: 1,
    },
    {
      question: '3, 6, 9, 12, ? - Sıradaki sayı nedir?',
      options: ['13', '14', '15', '16'],
      correctAnswer: 2,
    },
    {
      question: 'Bir altıgenin kaç kenarı vardır?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 2,
    },
    {
      question: '8 x 2 = ?',
      options: ['14', '15', '16', '17'],
      correctAnswer: 2,
    },
    {
      question: '30 ÷ 5 = ?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 2,
    },
  ],
  '11-13': [
    {
      question: 'Bir çiftlikte 10 tavuk ve 5 inek var. Her tavuğun 2 ayağı, her ineğin 4 ayağı var. Toplamda kaç ayak vardır?',
      options: ['30', '40', '50', '60'],
      correctAnswer: 1,
    },
    {
      question: 'Ali, Ayşe\'den daha uzun. Mehmet, Ali\'den daha kısa ama Ayşe\'den uzun. En uzun kim?',
      options: ['Ali', 'Ayşe', 'Mehmet', 'Eşitler'],
      correctAnswer: 0,
    },
    {
      question: '2, 4, 8, 16, ? - Sıradaki sayı nedir?',
      options: ['24', '32', '20', '18'],
      correctAnswer: 1,
    },
    {
      question: 'Bir sayının 3 katı 27 ise, bu sayının yarısı nedir?',
      options: ['3', '4', '4.5', '5'],
      correctAnswer: 2,
    },
    {
      question: 'Bir ailede 2 baba, 2 anne ve 4 çocuk var. En az kaç kişi vardır?',
      options: ['6', '7', '8', '4'],
      correctAnswer: 0,
    },
    {
      question: 'Bir saat 3:15\'i gösteriyorsa, akrep ile yelkovanın arasındaki açı kaç derecedir?',
      options: ['0°', '7.5°', '15°', '22.5°'],
      correctAnswer: 1,
    },
    {
      question: '1, 1, 2, 3, 5, 8, ? - Sıradaki sayı nedir?',
      options: ['11', '13', '15', '10'],
      correctAnswer: 1,
    },
    {
      question: 'Bir kutuda 12 elma var. 3 elmayı çıkarırsam kaç elma kalır?',
      options: ['9', '3', '12', '15'],
      correctAnswer: 1,
    },
    {
      question: '5 kardeş bir odada. Her biri 1 kitap okuyor. Odada kaç kitap var?',
      options: ['1', '5', '10', '25'],
      correctAnswer: 1,
    },
    {
      question: 'Bir yılda 12 ay var. 7 ay 31 gündür. Kaç ay 28 gündür?',
      options: ['1', '2', '11', '12'],
      correctAnswer: 3,
    },
    {
      question: '5, 10, 15, 20, ? - Sıradaki sayı nedir?',
      options: ['22', '24', '25', '30'],
      correctAnswer: 2,
    },
    {
      question: 'Bir sayının %50\'si 40 ise, sayı kaçtır?',
      options: ['60', '70', '80', '90'],
      correctAnswer: 2,
    },
    {
      question: '3² + 4² = ?',
      options: ['7', '12', '25', '49'],
      correctAnswer: 2,
    },
    {
      question: '100 ÷ 4 = ?',
      options: ['20', '25', '30', '35'],
      correctAnswer: 1,
    },
    {
      question: 'Bir dikdörtgenin uzun kenarı 10 cm, kısa kenarı 5 cm. Çevresi kaç cm\'dir?',
      options: ['20', '25', '30', '35'],
      correctAnswer: 2,
    },
    {
      question: '2³ = ?',
      options: ['4', '6', '8', '9'],
      correctAnswer: 2,
    },
    {
      question: '64 ÷ 8 = ?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
    },
    {
      question: 'Bir sayının %25\'i 15 ise, sayı kaçtır?',
      options: ['50', '60', '70', '80'],
      correctAnswer: 1,
    },
    {
      question: '7² = ?',
      options: ['14', '42', '49', '56'],
      correctAnswer: 2,
    },
    {
      question: '144 ÷ 12 = ?',
      options: ['10', '11', '12', '13'],
      correctAnswer: 2,
    },
    {
      question: 'Bir karenin bir kenarı 6 cm. Alanı kaç cm²\'dir?',
      options: ['24', '30', '36', '42'],
      correctAnswer: 2,
    },
    {
      question: '15 x 6 = ?',
      options: ['80', '85', '90', '95'],
      correctAnswer: 2,
    },
    {
      question: '200 - 75 = ?',
      options: ['115', '120', '125', '130'],
      correctAnswer: 2,
    },
    {
      question: 'Bir sayının %20\'si 30 ise, sayı kaçtır?',
      options: ['120', '130', '140', '150'],
      correctAnswer: 3,
    },
    {
      question: '10² = ?',
      options: ['20', '50', '100', '200'],
      correctAnswer: 2,
    },
  ],
  '14+': [
    {
      question: 'Bir fabrikada 8 saatte 120 ürün üretiliyor. Aynı hızda 12 saatte kaç ürün üretilir?',
      options: ['160', '180', '200', '240'],
      correctAnswer: 1,
    },
    {
      question: 'x² - 5x + 6 = 0 denkleminin kökleri toplamı kaçtır?',
      options: ['3', '5', '6', '11'],
      correctAnswer: 1,
    },
    {
      question: 'Bir sayının %25\'i 40 ise, bu sayının %75\'i kaçtır?',
      options: ['80', '100', '120', '160'],
      correctAnswer: 2,
    },
    {
      question: 'Bir geometrik dizinin ilk terimi 3, ortak çarpanı 2 ise 5. terim kaçtır?',
      options: ['24', '32', '48', '64'],
      correctAnswer: 2,
    },
    {
      question: 'Bir kenarı 5 cm olan küpün hacmi kaç cm³\'tür?',
      options: ['25', '75', '100', '125'],
      correctAnswer: 3,
    },
    {
      question: '3, 7, 15, 31, ? - Sıradaki sayı nedir?',
      options: ['47', '55', '63', '71'],
      correctAnswer: 2,
    },
    {
      question: 'Bir otobüste 45 yolcu var. Her durakta yarısı iniyor, yarısı kadar biniyor. 2 durak sonra kaç yolcu kalır?',
      options: ['23', '34', '45', '56'],
      correctAnswer: 1,
    },
    {
      question: 'log₂(8) + log₂(4) değeri kaçtır?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
    },
    {
      question: 'Bir iş 12 işçi tarafından 8 günde bitiriliyorsa, 16 işçi kaç günde bitirir?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 2,
    },
    {
      question: 'f(x) = 2x + 3 ise, f⁻¹(7) değeri kaçtır?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
    },
    {
      question: 'x² + 6x + 9 = 0 denkleminin kökü kaçtır?',
      options: ['-3', '-2', '2', '3'],
      correctAnswer: 0,
    },
    {
      question: 'Bir aritmetik dizinin ilk terimi 5, fark 3 ise 10. terim kaçtır?',
      options: ['30', '32', '35', '38'],
      correctAnswer: 1,
    },
    {
      question: 'sin²(x) + cos²(x) = ?',
      options: ['0', '1', '2', 'x'],
      correctAnswer: 1,
    },
    {
      question: 'Bir dairenin yarıçapı 7 cm ise alanı kaç cm²\'dir? (π = 22/7)',
      options: ['44', '88', '154', '196'],
      correctAnswer: 2,
    },
    {
      question: '5! (faktöriyel) değeri kaçtır?',
      options: ['60', '100', '120', '150'],
      correctAnswer: 2,
    },
    {
      question: 'log₁₀(100) değeri kaçtır?',
      options: ['1', '2', '3', '10'],
      correctAnswer: 1,
    },
    {
      question: 'Bir piramdin taban alanı 36 cm², yüksekliği 10 cm ise hacmi kaç cm³\'tür?',
      options: ['100', '120', '150', '180'],
      correctAnswer: 1,
    },
    {
      question: '√(169) değeri kaçtır?',
      options: ['11', '12', '13', '14'],
      correctAnswer: 2,
    },
    {
      question: '2x + 3y = 12 ve x - y = 1 ise x kaçtır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 1,
    },
    {
      question: 'Bir kürenin yarıçapı 3 cm ise hacmi kaç cm³\'tür? (π = 3)',
      options: ['36', '54', '72', '108'],
      correctAnswer: 3,
    },
    {
      question: '3⁴ = ?',
      options: ['27', '64', '81', '125'],
      correctAnswer: 2,
    },
    {
      question: 'Bir sayının %15\'i 30 ise, sayı kaçtır?',
      options: ['150', '180', '200', '220'],
      correctAnswer: 2,
    },
    {
      question: 'log₃(27) değeri kaçtır?',
      options: ['2', '3', '4', '9'],
      correctAnswer: 1,
    },
    {
      question: 'Bir geometrik dizide a₁ = 2 ve r = 3 ise a₅ kaçtır?',
      options: ['54', '81', '162', '243'],
      correctAnswer: 2,
    },
    {
      question: '∛(1000) değeri kaçtır?',
      options: ['5', '8', '10', '100'],
      correctAnswer: 2,
    },
  ],
};

export default function LogicPuzzleGame({ puzzleCount, onComplete, ageGroup }: LogicPuzzleGameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPuzzles, setSelectedPuzzles] = useState<Puzzle[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const agePuzzles = puzzlesByAge[ageGroup] || puzzlesByAge['8-10'];
    const shuffled = [...agePuzzles].sort(() => Math.random() - 0.5).slice(0, puzzleCount);
    setSelectedPuzzles(shuffled);
  }, [ageGroup]);

  const handleAnswerSelect = (index: number) => {
    if (feedback !== null) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const puzzle = selectedPuzzles[currentPuzzle];
    const isCorrect = selectedAnswer === puzzle.correctAnswer;

    if (isCorrect) {
      setScore(score + 20);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentPuzzle + 1 < puzzleCount) {
        setCurrentPuzzle(currentPuzzle + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = isCorrect ? score + 20 : score;
        onComplete(finalScore);
      }
    }, 2000);
  };

  if (selectedPuzzles.length === 0) {
    return <View style={styles.container} />;
  }

  const puzzle = selectedPuzzles[currentPuzzle];

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentPuzzle + 1) / puzzleCount) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.questionNumber}>
        Soru {currentPuzzle + 1} / {puzzleCount}
      </Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Skor:</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{puzzle.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {puzzle.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = feedback !== null && index === puzzle.correctAnswer;
          const isWrong = feedback === 'wrong' && isSelected;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
                isCorrect && styles.optionButtonCorrect,
                isWrong && styles.optionButtonWrong,
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={feedback !== null}
            >
              <Text style={[
                styles.optionText,
                (isSelected || isCorrect) && styles.optionTextSelected,
              ]}>
                {option}
              </Text>
              {isCorrect && <Text style={styles.checkMark}>✓</Text>}
              {isWrong && <Text style={styles.crossMark}>✗</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {feedback && (
        <Text style={[styles.feedback, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
          {feedback === 'correct' ? '✓ Doğru!' : '✗ Yanlış cevap!'}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, (selectedAnswer === null || feedback !== null) && styles.buttonDisabled]}
        onPress={checkAnswer}
        disabled={selectedAnswer === null || feedback !== null}
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
    backgroundColor: '#ED8936',
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
    color: '#ED8936',
  },
  questionContainer: {
    backgroundColor: '#FFFAF0',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ED8936',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#2D3748',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#ED8936',
    backgroundColor: '#FFFAF0',
  },
  optionButtonCorrect: {
    borderColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  optionButtonWrong: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  optionTextSelected: {
    color: '#2D3748',
  },
  checkMark: {
    fontSize: 24,
    color: '#48BB78',
    fontWeight: '700',
  },
  crossMark: {
    fontSize: 24,
    color: '#E53E3E',
    fontWeight: '700',
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
    backgroundColor: '#ED8936',
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
