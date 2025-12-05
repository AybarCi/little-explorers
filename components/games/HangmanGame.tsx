import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { wordHuntWords } from '../../constants/gameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HangmanGameProps {
  wordCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

const TURKISH_ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

// Turkish uppercase function
const toTurkishUpper = (str: string): string => {
  return str
    .replace(/i/g, 'İ')
    .replace(/ı/g, 'I')
    .toUpperCase();
};

export default function HangmanGame({ wordCount, onComplete, ageGroup }: HangmanGameProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<Array<{ word: string; hint: string }>>([]);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const maxWrongGuesses = 6;

  useEffect(() => {
    const wordList = wordHuntWords[ageGroup] || wordHuntWords['8-10'];
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    // Convert to uppercase and take unique words
    const selected = shuffled.slice(0, Math.min(wordCount, shuffled.length)).map(w => ({
      word: toTurkishUpper(w.word),
      hint: w.hint
    }));
    setSelectedWords(selected);
  }, [ageGroup, wordCount]);

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
