import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface MathGameProps {
  gameType: 'addition' | 'subtraction' | 'multiplication';
  maxNumber: number;
  questionCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

export default function MathGame({
  gameType,
  maxNumber,
  questionCount,
  onComplete,
  ageGroup,
}: MathGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    generateQuestion();
  }, [currentQuestion]);

  const generateQuestion = () => {
    let adjustedMax = maxNumber;

    if (ageGroup === '5-7') {
      adjustedMax = Math.min(maxNumber, gameType === 'multiplication' ? 5 : 10);
    } else if (ageGroup === '8-10') {
      adjustedMax = Math.min(maxNumber, gameType === 'multiplication' ? 10 : 20);
    } else if (ageGroup === '11-13') {
      adjustedMax = Math.min(maxNumber, gameType === 'multiplication' ? 12 : 50);
    } else {
      adjustedMax = Math.min(maxNumber, gameType === 'multiplication' ? 20 : 100);
    }

    const n1 = Math.floor(Math.random() * adjustedMax) + 1;
    const n2 = Math.floor(Math.random() * adjustedMax) + 1;
    setNum1(n1);
    setNum2(n2);
    setAnswer('');
    setFeedback(null);
  };

  const getCorrectAnswer = () => {
    switch (gameType) {
      case 'addition':
        return num1 + num2;
      case 'subtraction':
        return num1 - num2;
      case 'multiplication':
        return num1 * num2;
      default:
        return 0;
    }
  };

  const getOperatorSymbol = () => {
    switch (gameType) {
      case 'addition':
        return '+';
      case 'subtraction':
        return '-';
      case 'multiplication':
        return '×';
      default:
        return '';
    }
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    const correctAnswer = getCorrectAnswer();

    if (userAnswer === correctAnswer) {
      setScore(score + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questionCount) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const finalScore = userAnswer === correctAnswer ? score + 10 : score;
        onComplete(finalScore);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentQuestion + 1) / questionCount) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.questionNumber}>
        Soru {currentQuestion + 1} / {questionCount}
      </Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Skor:</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.number}>{num1}</Text>
        <Text style={styles.operator}>{getOperatorSymbol()}</Text>
        <Text style={styles.number}>{num2}</Text>
        <Text style={styles.equals}>=</Text>
        <Text style={styles.questionMark}>?</Text>
      </View>

      <TextInput
        style={[
          styles.input,
          feedback === 'correct' && styles.inputCorrect,
          feedback === 'wrong' && styles.inputWrong,
        ]}
        value={answer}
        onChangeText={setAnswer}
        keyboardType="number-pad"
        placeholder="Cevabını gir"
        editable={feedback === null}
        autoFocus
      />

      {feedback && (
        <Text style={[styles.feedback, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
          {feedback === 'correct' ? '✓ Doğru!' : `✗ Yanlış! Doğru cevap: ${getCorrectAnswer()}`}
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
    backgroundColor: '#48BB78',
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
    marginBottom: 32,
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
    color: '#48BB78',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    gap: 16,
  },
  number: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2D3748',
  },
  operator: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4299E1',
  },
  equals: {
    fontSize: 48,
    fontWeight: '700',
    color: '#718096',
  },
  questionMark: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ED8936',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 32,
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
    backgroundColor: '#4299E1',
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
