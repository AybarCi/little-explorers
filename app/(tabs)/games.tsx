import { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchGames, setSelectedCategory } from '@/store/slices/gamesSlice';
import { Game, GameCategory } from '@/types/game';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

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
  const headerAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGames();
  }, [selectedCategory, user?.id]);

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadGames();
    }, [selectedCategory, user?.id, dispatch])
  );

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
      <LinearGradient
        colors={[Colors.spacePurple, Colors.energyOrange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Animated.View
          style={{
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            opacity: headerAnim,
          }}
        >
          <Text style={styles.titleDark}>Oyunlar</Text>
          <Text style={styles.subtitleDark}>Hadi başla, eğlence seni bekliyor!</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.floatShape,
            {
              backgroundColor: Colors.secondary,
              transform: [{ translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }],
              left: 24,
              top: 38,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatShapeSmall,
            {
              backgroundColor: Colors.highlight,
              transform: [{ translateY: float2.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
              right: 28,
              bottom: 18,
            },
          ]}
        />
      </LinearGradient>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item.value;
            return (
              <TouchableOpacity
                style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
                onPress={() => dispatch(setSelectedCategory(item.value))}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    isActive && styles.categoryButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <View style={styles.contentArea}>
        {loading || error || games.length === 0 ? (
          <View style={styles.centerContainer}>
            {loading && <ActivityIndicator size="large" color={Colors.primary} />}
            {error && (
              <>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadGames}>
                  <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                </TouchableOpacity>
              </>
            )}
            {!loading && !error && games.length === 0 && (
              <>
                <Text style={styles.emptyEmoji}>🎮</Text>
                <Text style={styles.emptyText}>Bu kategoride oyun bulunamadı</Text>
              </>
            )}
          </View>
        ) : (
          <FlatList
            data={games}
            keyExtractor={(item) => item.id}
            renderItem={renderGame}
            contentContainerStyle={styles.gamesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  titleDark: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.pureWhite,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitleDark: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  floatShape: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.85,
  },
  floatShapeSmall: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.9,
  },
  categoryContainer: {
    backgroundColor: 'white',
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginHorizontal: 4,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 18,
  },
  categoryButtonTextActive: {
    color: 'white',
    lineHeight: 18,
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
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
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
    backgroundColor: Colors.accent,
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
    color: Colors.primary,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#48BB78',
  },
});
