import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  cardCount: number;
  onComplete: (score: number) => void;
  ageGroup: string;
}

const emojisByAge: Record<string, string[]> = {
  '5-7': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  '8-10': ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎹', '🎺', '🎻', '🎲', '🎳', '🎰'],
  '11-13': ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎹', '🎺', '🎻', '🎲', '🧩', '🎳', '🎰', '🎪', '🎬', '🎤'],
  '14+': ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎹', '🎺', '🎻', '🎲', '🧩', '🎳', '🎰', '🎬', '🎤', '🎧', '🎼', '🎵'],
};

export default function MemoryGame({ cardCount, onComplete, ageGroup }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matches === cardCount / 2) {
      const score = Math.max(100 - moves * 3, 10);
      setTimeout(() => onComplete(score), 500);
    }
  }, [matches]);

  const initializeGame = () => {
    const pairCount = cardCount / 2;
    const emojis = emojisByAge[ageGroup] || emojisByAge['8-10'];
    const selectedEmojis = emojis.slice(0, pairCount);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];

    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
  };

  const handleCardPress = (id: number) => {
    if (flippedCards.length === 2) return;

    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flipped: number[]) => {
    const [first, second] = flipped;
    const card1 = cards.find(c => c.id === first);
    const card2 = cards.find(c => c.id === second);

    if (card1?.value === card2?.value) {
      setCards(cards.map(c =>
        c.id === first || c.id === second
          ? { ...c, isMatched: true }
          : c
      ));
      setMatches(matches + 1);
      setFlippedCards([]);
    } else {
      setTimeout(() => {
        setCards(cards.map(c =>
          c.id === first || c.id === second
            ? { ...c, isFlipped: false }
            : c
        ));
        setFlippedCards([]);
      }, 650);
    }
  };

  const columns = cardCount === 12 ? 3 : 4;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Hamle</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Eşleşme</Text>
          <Text style={styles.statValue}>{matches} / {cardCount / 2}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { width: `${100 / columns - 4}%` },
              (card.isFlipped || card.isMatched) && styles.cardFlipped,
              card.isMatched && styles.cardMatched,
            ]}
            onPress={() => handleCardPress(card.id)}
            disabled={card.isFlipped || card.isMatched}
          >
            <Text style={styles.cardText}>
              {card.isFlipped || card.isMatched ? card.value : '?'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  card: {
    aspectRatio: 1,
    backgroundColor: '#4299E1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#3182CE',
  },
  cardFlipped: {
    backgroundColor: 'white',
    borderColor: '#4299E1',
  },
  cardMatched: {
    backgroundColor: '#48BB78',
    borderColor: '#38A169',
  },
  cardText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#2D3748',
  },
});
