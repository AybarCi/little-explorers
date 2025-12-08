import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';

interface PictureMemoryGameProps {
  itemCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

interface ScoreDetails {
  correct: number;
  incorrect: number;
  total: number;
  score: number;
  percentage: number;
}

const emojisByAge: Record<string, string[]> = {
  '5-7': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐨', '🐯', '🦁', '🐮', '🐷'],
  '8-10': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚲', '🛴', '✈️', '🚁'],
  '11-13': ['🎮', '🎸', '🎭', '🎨', '🎬', '🎥', '🎹', '🎺', '🎻', '🥁', '🎷', '🎲'],
  '14+': ['💻', '📱', '⌨️', '💽', '💾', '💿', '📀', '🖥️', '🖱️', '🕹️', '📷', '📹'],
};

export default function PictureMemoryGame({ itemCount, onComplete, ageGroup }: PictureMemoryGameProps) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const memorizeTime = ageGroup === '5-7' ? 15 : ageGroup === '8-10' ? 12 : ageGroup === '11-13' ? 10 : 8;
  const [timeLeft, setTimeLeft] = useState(memorizeTime);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [userSelections, setUserSelections] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null);
  const [distractors, setDistractors] = useState<string[]>([]);

  useEffect(() => {
    const emojis = emojisByAge[ageGroup] || emojisByAge['8-10'];
    const shuffled = [...emojis].sort(() => Math.random() - 0.5).slice(0, itemCount);
    setSelectedItems(shuffled);

    // Generate distractors (emojis NOT shown)
    const notShownEmojis = emojis.filter(e => !shuffled.includes(e));
    const selectedDistractors = notShownEmojis
      .sort(() => Math.random() - 0.5)
      .slice(0, shuffled.length);
    setDistractors(selectedDistractors);
  }, [ageGroup, itemCount]);

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

    const details: ScoreDetails = {
      correct: correctCount,
      incorrect: incorrectCount,
      total: selectedItems.length,
      score: score,
      percentage: selectedItems.length > 0 ? Math.round((correctCount / selectedItems.length) * 100) : 0
    };
    setScoreDetails(details);

    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  // Combine shown and distractor emojis, then shuffle
  const allEmojis = [...selectedItems, ...distractors].sort(() => Math.random() - 0.5);

  if (selectedItems.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {/* How to Play Modal */}
      <Modal
        visible={showInstructions}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.instructionsModal}>
            <Text style={styles.modalTitle}>📖 Nasıl Oynanır?</Text>
            <View style={styles.instructionsList}>
              <Text style={styles.instructionItem}>1️⃣ Ekrana {itemCount} resim gösterilecek</Text>
              <Text style={styles.instructionItem}>2️⃣ Bunları {memorizeTime} saniye içinde ezberle</Text>
              <Text style={styles.instructionItem}>3️⃣ Sonra {allEmojis.length} resim arasından sadece gördüklerini seç</Text>
              <View style={styles.scoringInfo}>
                <Text style={styles.scoringText}>✅ Doğru: +10 puan</Text>
                <Text style={styles.scoringText}>❌ Yanlış: -5 puan</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.startButtonText}>Başla!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {phase === 'memorize' ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Bu {selectedItems.length} Resmi Ezberle! 🧠</Text>
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
            Birazdan karışık {allEmojis.length} resim gösterilecek.
            {''}
            Sadece bu {selectedItems.length} resmi bulman gerekecek!
          </Text>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Az Önce Gördüğün {selectedItems.length} Resmi Seç</Text>
            <Text style={styles.subtitle}>
              ⚠️ Dikkat: Listede görmediğin {distractors.length} resim daha var!
            </Text>
            <Text style={[styles.subtitle, { marginTop: 8, fontSize: 18, fontWeight: '700' }]}>
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

          {/* Score Breakdown */}
          {scoreDetails && (
            <View style={styles.scoreBreakdown}>
              <Text style={styles.scoreTitle}>🎉 Sonuç</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Doğru:</Text>
                <Text style={styles.scoreValue}>{scoreDetails.correct} / {scoreDetails.total}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Yanlış:</Text>
                <Text style={[styles.scoreValue, { color: '#E53E3E' }]}>{scoreDetails.incorrect}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Başarı Oranı:</Text>
                <Text style={styles.scoreValue}>%{scoreDetails.percentage}</Text>
              </View>
              <View style={[styles.scoreRow, { marginTop: 12, paddingTop: 12, borderTopWidth: 2, borderTopColor: '#E2E8F0' }]}>
                <Text style={[styles.scoreLabel, { fontSize: 20, fontWeight: '800' }]}>Toplam Skor:</Text>
                <Text style={[styles.scoreValue, { fontSize: 28, fontWeight: '800', color: '#ED64A6' }]}>{scoreDetails.score}</Text>
              </View>
            </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionsList: {
    marginBottom: 24,
  },
  instructionItem: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 12,
    lineHeight: 24,
  },
  scoringInfo: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  scoringText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#ED64A6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  scoreBreakdown: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#ED64A6',
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#48BB78',
  },
});
