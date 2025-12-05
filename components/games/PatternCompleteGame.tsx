import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface PatternCompleteGameProps {
  patternCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

interface Pattern {
  sequence: string[];
  options: string[];
  correctAnswer: number;
}

const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟤', '⚫', '⚪'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function generatePattern(ageGroup: string): Pattern {
  const type = Math.floor(Math.random() * 4);

  switch (type) {
    case 0: {
      // Arithmetic sequence: 1, 3, 5, 7 -> 9
      const maxStart = ageGroup === '5-7' ? 3 : ageGroup === '8-10' ? 5 : 8;
      const maxStep = ageGroup === '5-7' ? 2 : ageGroup === '8-10' ? 3 : 4;
      const start = Math.floor(Math.random() * maxStart) + 1;
      const step = Math.floor(Math.random() * maxStep) + 1;
      const sequence = Array.from({ length: 4 }, (_, i) => (start + i * step).toString());
      const correctAnswer = (start + 4 * step).toString();

      // Generate distinct wrong answers
      const wrongAnswers = new Set<string>();
      wrongAnswers.add((start + 5 * step).toString());
      wrongAnswers.add((start + 3 * step).toString());
      wrongAnswers.add((start + 4 * step + 1).toString());
      wrongAnswers.add((start + 4 * step - 1).toString());
      wrongAnswers.delete(correctAnswer);

      const options = [correctAnswer, ...Array.from(wrongAnswers).slice(0, 3)];
      const shuffled = options.sort(() => Math.random() - 0.5);

      return {
        sequence,
        options: shuffled,
        correctAnswer: shuffled.indexOf(correctAnswer),
      };
    }
    case 1: {
      // Shape pattern: 🔴🔵🟢🔴 -> 🔵
      const selectedShapes = [...shapes].sort(() => Math.random() - 0.5).slice(0, 3);
      const pattern = [];
      for (let i = 0; i < 4; i++) {
        pattern.push(selectedShapes[i % selectedShapes.length]);
      }
      const correctAnswer = selectedShapes[4 % selectedShapes.length];
      const wrongAnswers = shapes.filter(s => !selectedShapes.includes(s)).slice(0, 3);

      const options = [correctAnswer, ...wrongAnswers];
      const shuffled = options.sort(() => Math.random() - 0.5);

      return {
        sequence: pattern,
        options: shuffled,
        correctAnswer: shuffled.indexOf(correctAnswer),
      };
    }
    case 2: {
      // Letter sequence: A, B, C, D -> E
      const start = Math.floor(Math.random() * 4); // 0-3 to allow more variety
      const sequence = Array.from({ length: 4 }, (_, i) => letters[start + i]);
      const correctAnswer = letters[start + 4];

      // Generate wrong letters that are not in sequence
      const wrongAnswers = letters.filter((l, idx) =>
        idx !== start + 4 && !sequence.includes(l)
      ).slice(0, 3);

      const options = [correctAnswer, ...wrongAnswers];
      const shuffled = options.sort(() => Math.random() - 0.5);

      return {
        sequence,
        options: shuffled,
        correctAnswer: shuffled.indexOf(correctAnswer),
      };
    }
    default: {
      // Geometric sequence: 2, 4, 8, 16 -> 32
      const start = Math.floor(Math.random() * 2) + 1;
      const sequence = Array.from({ length: 4 }, (_, i) => (start * 2 ** i).toString());
      const correctAnswer = (start * 2 ** 4).toString();

      const wrongAnswers = new Set<string>();
      wrongAnswers.add((start * 2 ** 5).toString());
      wrongAnswers.add((start * 2 ** 3).toString());
      wrongAnswers.add((start * 2 ** 4 + start).toString());
      wrongAnswers.delete(correctAnswer);

      const options = [correctAnswer, ...Array.from(wrongAnswers).slice(0, 3)];
      const shuffled = options.sort(() => Math.random() - 0.5);

      return {
        sequence,
        options: shuffled,
        correctAnswer: shuffled.indexOf(correctAnswer),
      };
    }
  }
}

export default function PatternCompleteGame({ patternCount, onComplete, ageGroup }: PatternCompleteGameProps) {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const generated = Array.from({ length: patternCount }, () => generatePattern(ageGroup));
    setPatterns(generated);
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (feedback !== null) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const pattern = patterns[currentPattern];
    const isCorrect = selectedAnswer === pattern.correctAnswer;

    if (isCorrect) {
      setScore(score + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentPattern + 1 < patternCount) {
        setCurrentPattern(currentPattern + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = isCorrect ? score + 10 : score;
        onComplete(finalScore);
      }
    }, 1500);
  };

  if (patterns.length === 0) {
    return <View style={styles.container} />;
  }

  const pattern = patterns[currentPattern];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentPattern + 1) / patternCount) * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.questionNumber}>
          Desen {currentPattern + 1} / {patternCount}
        </Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Skor:</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <Text style={styles.instruction}>Deseni tamamla</Text>

        <View style={styles.sequenceContainer}>
          {pattern.sequence.map((item, index) => (
            <View key={index} style={styles.sequenceItem}>
              <Text style={styles.sequenceText}>{item}</Text>
            </View>
          ))}
          <View style={styles.sequenceItem}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {pattern.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = feedback !== null && index === pattern.correctAnswer;
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
                <Text style={styles.optionText}>{option}</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
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
  instruction: {
    fontSize: 18,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  sequenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 48,
  },
  sequenceItem: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ED8936',
  },
  sequenceText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
  },
  questionMark: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ED8936',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 24,
    color: '#48BB78',
    fontWeight: '700',
  },
  crossMark: {
    position: 'absolute',
    top: 8,
    right: 8,
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
