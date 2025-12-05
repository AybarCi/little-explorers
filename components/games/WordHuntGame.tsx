import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { wordHuntWords } from '../../constants/gameData';

interface WordHuntGameProps {
  wordCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

export default function WordHuntGame({ wordCount, onComplete, ageGroup }: WordHuntGameProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedWords, setSelectedWords] = useState<Array<{ word: string; hint: string }>>([]);
  const [scrambledWord, setScrambledWord] = useState('');

  useEffect(() => {
    // Get word list and shuffle to prevent repetition
    const wordList = wordHuntWords[ageGroup] || wordHuntWords['8-10'];
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    // Take exactly wordCount unique words
    const selected = shuffled.slice(0, Math.min(wordCount, shuffled.length));
    setSelectedWords(selected);
  }, [ageGroup, wordCount]);

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
