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
      const maxStart = ageGroup === '5-7' ? 3 : ageGroup === '8-10' ? 5 : 8;
      const maxStep = ageGroup === '5-7' ? 1 : ageGroup === '8-10' ? 2 : 3;
      const start = Math.floor(Math.random() * maxStart) + 1;
      const step = Math.floor(Math.random() * maxStep) + 1;
      const sequence = Array.from({ length: 4 }, (_, i) => (start + i * step).toString());
      const next = start + 4 * step;
      const wrong1 = next + step;
      const wrong2 = next - step;
      const wrong3 = next + 1;
      return {
        sequence,
        options: [next.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()]
          .sort(() => Math.random() - 0.5),
        correctAnswer: 0,
      };
    }
    case 1: {
      const selectedShapes = [...shapes].sort(() => Math.random() - 0.5).slice(0, 3);
      const pattern = [];
      for (let i = 0; i < 4; i++) {
        pattern.push(selectedShapes[i % selectedShapes.length]);
      }
      const next = selectedShapes[4 % selectedShapes.length];
      const wrong = shapes.filter(s => !selectedShapes.includes(s)).slice(0, 3);
      return {
        sequence: pattern,
        options: [next, ...wrong].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
      };
    }
    case 2: {
      const start = Math.floor(Math.random() * 3);
      const sequence = Array.from({ length: 4 }, (_, i) => letters[start + i]);
      const next = letters[start + 4];
      const wrong1 = letters[start + 5] || 'Z';
      const wrong2 = letters[start + 2];
      const wrong3 = letters[start + 6] || 'Y';
      return {
        sequence,
        options: [next, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
      };
    }
    default: {
      const start = Math.floor(Math.random() * 2) + 1;
      const sequence = Array.from({ length: 4 }, (_, i) => (start * 2 ** i).toString());
      const next = start * 2 ** 4;
      const wrong1 = next * 2;
      const wrong2 = next / 2;
      const wrong3 = next + start;
      return {
        sequence,
        options: [next.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()]
          .sort(() => Math.random() - 0.5),
        correctAnswer: 0,
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
    generated.forEach(p => {
      const correctOption = p.options[0];
      p.correctAnswer = p.options.indexOf(correctOption);
    });
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
    paddingBottom: 40,
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
    width: '45%',
    aspectRatio: 1,
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
    fontSize: 36,
    fontWeight: '700',
    color: '#2D3748',
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
