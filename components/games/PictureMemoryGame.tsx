import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface PictureMemoryGameProps {
  itemCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

const emojisByAge: Record<string, string[]> = {
  '5-7': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐨', '🐯', '🦁', '🐮', '🐷'],
  '8-10': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚲', '🛴', '✈️', '🚁'],
  '11-13': ['🎮', '🎸', '🎭', '🎨', '🎬', '🎥', '🎹', '🎺', '🎻', '🥁', '🎷', '🎲'],
  '14+': ['💻', '📱', '⌨️', '💽', '💾', '💿', '📀', '🖥️', '🖱️', '🕹️', '📷', '📹'],
};

export default function PictureMemoryGame({ itemCount, onComplete, ageGroup }: PictureMemoryGameProps) {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const memorizeTime = ageGroup === '5-7' ? 15 : ageGroup === '8-10' ? 12 : ageGroup === '11-13' ? 10 : 8;
  const [timeLeft, setTimeLeft] = useState(memorizeTime);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [userSelections, setUserSelections] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const emojis = emojisByAge[ageGroup] || emojisByAge['8-10'];
    const shuffled = [...emojis].sort(() => Math.random() - 0.5).slice(0, itemCount);
    setSelectedItems(shuffled);
  }, [ageGroup]);

  useEffect(() => {
    if (phase === 'memorize' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'memorize' && timeLeft === 0) {
      setPhase('recall');
    }
  }, [phase, timeLeft]);

  const handleItemSelect = (item: string) => {
    if (phase !== 'recall' || showResults) return;

    const newSelections = new Set(userSelections);
    if (newSelections.has(item)) {
      newSelections.delete(item);
    } else {
      newSelections.add(item);
    }
    setUserSelections(newSelections);
  };

  const handleSubmit = () => {
    setShowResults(true);

    const correctCount = [...userSelections].filter(item =>
      selectedItems.includes(item)
    ).length;

    const incorrectCount = userSelections.size - correctCount;
    const score = Math.max((correctCount * 10) - (incorrectCount * 5), 0);

    setTimeout(() => {
      onComplete(score);
    }, 2000);
  };

  const emojis = emojisByAge[ageGroup] || emojisByAge['8-10'];
  const allEmojis = [...new Set([...selectedItems, ...emojis])].sort(() => Math.random() - 0.5).slice(0, Math.min(itemCount * 2, 24));

  if (selectedItems.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {phase === 'memorize' ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Resimleri Hatırla</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Kalan Süre:</Text>
              <Text style={styles.timerValue}>{timeLeft}s</Text>
            </View>
          </View>

          <View style={styles.grid}>
            {selectedItems.map((item, index) => (
              <View key={index} style={styles.memoryItem}>
                <Text style={styles.emoji}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.instruction}>
            Bu resimleri iyi hatırla! Birazdan bunları seçmen gerekecek.
          </Text>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Gördüğün Resimleri Seç</Text>
            <Text style={styles.subtitle}>
              {userSelections.size} / {selectedItems.length} seçildi
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.grid}>
              {allEmojis.map((item, index) => {
                const isSelected = userSelections.has(item);
                const wasCorrect = showResults && selectedItems.includes(item);
                const wasWrong = showResults && isSelected && !selectedItems.includes(item);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.selectableItem,
                      isSelected && styles.selectedItem,
                      showResults && wasCorrect && styles.correctItem,
                      showResults && wasWrong && styles.wrongItem,
                    ]}
                    onPress={() => handleItemSelect(item)}
                    disabled={showResults}
                  >
                    <Text style={styles.emoji}>{item}</Text>
                    {showResults && wasCorrect && (
                      <Text style={styles.resultIcon}>✓</Text>
                    )}
                    {showResults && wasWrong && (
                      <Text style={styles.resultIcon}>✗</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {!showResults && (
            <TouchableOpacity
              style={[styles.button, userSelections.size === 0 && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={userSelections.size === 0}
            >
              <Text style={styles.buttonText}>Cevapla</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7FAFC',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FED7E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#702459',
    marginRight: 8,
  },
  timerValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#702459',
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
    marginTop: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  memoryItem: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ED64A6',
  },
  selectableItem: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  selectedItem: {
    borderColor: '#ED64A6',
    backgroundColor: '#FFF5F7',
  },
  correctItem: {
    borderColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  wrongItem: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  emoji: {
    fontSize: 40,
  },
  resultIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#ED64A6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
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
