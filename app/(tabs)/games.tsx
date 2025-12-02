import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchGames, setSelectedCategory } from '@/store/slices/gamesSlice';
import { Game, GameCategory } from '@/types/game';

const categories: { value: GameCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'math', label: 'Matematik' },
  { value: 'language', label: 'Dil' },
  { value: 'logic', label: 'Mantık' },
  { value: 'memory', label: 'Hafıza' },
  { value: 'science', label: 'Bilim' },
];

export default function GamesScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { games, loading, error, selectedCategory } = useAppSelector(
    (state) => state.games
  );

  useEffect(() => {
    loadGames();
  }, [selectedCategory, user?.id]);

  const loadGames = () => {
    dispatch(
      fetchGames({
        category: selectedCategory,
        userId: user?.id,
      })
    );
  };

  const renderGame = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => router.push(`/game/${item.id}` as any)}
    >
      <View style={styles.gameIconContainer}>
        <Text style={styles.gameIcon}>{item.title.charAt(0)}</Text>
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.gameMetaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
          <View style={[styles.badge, styles.difficultyBadge]}>
            <Text style={styles.badgeText}>{item.difficulty}</Text>
          </View>
          <Text style={styles.pointsText}>{item.points} puan</Text>
        </View>

        {item.user_progress && (
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              Skor: {item.user_progress.score}
            </Text>
            {item.user_progress.completed && (
              <Text style={styles.completedText}>✓ Tamamlandı</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Oyunlar</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item.value && styles.categoryButtonActive,
            ]}
            onPress={() => dispatch(setSelectedCategory(item.value))}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item.value &&
                  styles.categoryButtonTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
        style={styles.categoryContainer}
      />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4299E1" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadGames}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : games.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>🎮</Text>
          <Text style={styles.emptyText}>Bu kategoride oyun bulunamadı</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={renderGame}
          contentContainerStyle={styles.gamesList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
  },
  categoryContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryButtonActive: {
    backgroundColor: '#4299E1',
    borderColor: '#4299E1',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4299E1',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gamesList: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    padding: 16,
  },
  gameIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gameIcon: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
  },
  gameMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#EDF2F7',
    marginRight: 8,
  },
  difficultyBadge: {
    backgroundColor: '#FED7E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#48BB78',
    marginLeft: 'auto',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#48BB78',
  },
});
