import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface LetterSortGameProps {
  wordCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

const wordsByAge: Record<string, string[]> = {
  '5-7': ['ev', 'top', 'köpek', 'kedi', 'elma', 'gül', 'ayı', 'kuş', 'kaşık', 'çatal', 'masa', 'kupa', 'saat', 'ayak', 'göz', 'baş', 'süt', 'ekmek', 'peynir', 'balık', 'yılan', 'fare', 'koyun', 'ördek', 'tavuk', 'böcek', 'arı', 'karınca', 'çiçek', 'yaprak'],
  '8-10': ['araba', 'okul', 'deniz', 'kuşlar', 'ağaç', 'güneş', 'bulut', 'portakal', 'muz', 'çilek', 'kiraz', 'üzüm', 'havuç', 'domates', 'salatalık', 'patates', 'soğan', 'sarımsak', 'biber', 'patlıcan', 'kabak', 'marul', 'lahana', 'karnabahar', 'brokoli', 'ıspanak', 'roka', 'maydanoz', 'nane', 'kekik'],
  '11-13': ['bilgisayar', 'televizyon', 'buzdolabı', 'otobüs', 'bisiklet', 'sandalye', 'pencere', 'masa', 'lamba', 'kitaplık', 'dolap', 'halı', 'perde', 'yastık', 'battaniye', 'çarşaf', 'havlu', 'sabun', 'şampuan', 'diş fırçası', 'tarak', 'ayna', 'saat', 'resim', 'vazo', 'saksı', 'televizyon', 'radyo', 'telefon', 'tablet'],
  '14+': ['teknoloji', 'algoritma', 'matematik', 'edebiyat', 'demokrasi', 'fotosentez', 'kültür', 'astronomi', 'jeoloji', 'biyoloji', 'kimya', 'fizik', 'coğrafya', 'tarih', 'felsefe', 'psikoloji', 'sosyoloji', 'ekonomi', 'siyaset', 'hukuk', 'tıp', 'mühendislik', 'mimarlık', 'sanat', 'müzik', 'edebiyat', 'şiir', 'hikaye', 'roman', 'deneme'],
};

export default function LetterSortGame({ wordCount, onComplete, ageGroup }: LetterSortGameProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const wordList = wordsByAge[ageGroup] || wordsByAge['8-10'];
    const shuffled = [...wordList].sort(() => Math.random() - 0.5).slice(0, wordCount);
    setSelectedWords(shuffled);
  }, [ageGroup]);

  useEffect(() => {
    if (selectedWords.length > 0) {
      generateScrambledLetters();
    }
  }, [currentWord, selectedWords]);

  const generateScrambledLetters = () => {
    if (!selectedWords[currentWord]) return;
    const word = selectedWords[currentWord];
    const scrambled = word.split('').sort(() => Math.random() - 0.5);
    setScrambledLetters(scrambled);
    setUserAnswer([]);
    setFeedback(null);
  };

  const handleLetterPress = (letter: string, index: number) => {
    setUserAnswer([...userAnswer, letter]);
    setScrambledLetters(scrambledLetters.filter((_, i) => i !== index));
  };

  const handleAnswerLetterPress = (index: number) => {
    const letter = userAnswer[index];
    setScrambledLetters([...scrambledLetters, letter]);
    setUserAnswer(userAnswer.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const correctWord = selectedWords[currentWord];
    const userWord = userAnswer.join('');

    if (userWord === correctWord) {
      setScore(score + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentWord + 1 < wordCount) {
        setCurrentWord(currentWord + 1);
      } else {
        const finalScore = userWord === correctWord ? score + 10 : score;
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

      <Text style={styles.instruction}>Harfleri doğru sırayla seç</Text>

      <View style={styles.answerContainer}>
        <View style={styles.answerRow}>
          {userAnswer.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.answerLetter}
              onPress={() => handleAnswerLetterPress(index)}
              disabled={feedback !== null}
            >
              <Text style={styles.answerLetterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
          {Array.from({ length: selectedWords[currentWord].length - userAnswer.length }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyLetter} />
          ))}
        </View>
      </View>

      {feedback && (
        <Text style={[styles.feedback, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
          {feedback === 'correct' ? '✓ Doğru!' : `✗ Yanlış! Doğru kelime: ${selectedWords[currentWord]}`}
        </Text>
      )}

      <View style={styles.lettersContainer}>
        {scrambledLetters.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.letterButton}
            onPress={() => handleLetterPress(letter, index)}
            disabled={feedback !== null}
          >
            <Text style={styles.letterButtonText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (userAnswer.length !== selectedWords[currentWord].length || feedback !== null) && styles.buttonDisabled
        ]}
        onPress={checkAnswer}
        disabled={userAnswer.length !== selectedWords[currentWord].length || feedback !== null}
      >
        <Text style={styles.buttonText}>Kontrol Et</Text>
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
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  answerContainer: {
    marginBottom: 32,
    minHeight: 80,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  answerLetter: {
    width: 50,
    height: 60,
    backgroundColor: '#9F7AEA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerLetterText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  emptyLetter: {
    width: 50,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
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
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  letterButton: {
    width: 50,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9F7AEA',
  },
  letterButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9F7AEA',
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
