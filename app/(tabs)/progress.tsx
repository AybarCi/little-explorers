import { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TrendingUp, Target, Clock, Trophy, Star } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { restoreSession, ensureValidSession } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import Constants from 'expo-constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface UserProgressStats {
  totalScore: number;
  completedGames: number;
  totalTime: number;
  averageScore: number;
  totalGamesInApp: number;
}

interface CategoryData {
  total: number;
  completed: number;
  score: number;
  time: number;
}

export default function ProgressScreen() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  const [stats, setStats] = useState<UserProgressStats>({
    totalScore: 0,
    completedGames: 0,
    totalTime: 0,
    averageScore: 0,
    totalGamesInApp: 0,
  });
  const [categories, setCategories] = useState<Record<string, CategoryData>>({});
  const [loading, setLoading] = useState(true);

  const fetchUserProgress = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/user-progress?user_id=${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      const data = await response.json() as {
        stats?: UserProgressStats;
        categories?: Record<string, CategoryData>;
      };
      console.log('User Progress API Response:', data);

      if (response.ok && data.stats) {
        setStats(data.stats);
        setCategories(data.categories || {});
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      dispatch(restoreSession());
    }
  }, []);

  useEffect(() => {
    if (initialized && user?.id) {
      dispatch(ensureValidSession());
      fetchUserProgress();
    }
  }, [initialized, user?.id]);

  useFocusEffect(
    useCallback(() => {
      console.log('Progress Focus effect triggered');
      if (user?.id) {
        fetchUserProgress();
      }

      // Start animations when page is focused
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      const float1Animation = Animated.loop(
        Animated.sequence([
          Animated.timing(float1, {
            toValue: 1,
            duration: 2600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(float1, {
            toValue: 0,
            duration: 2600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      float1Animation.start();

      const float2Animation = Animated.loop(
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
      );
      float2Animation.start();

      // Cleanup: stop animations when leaving the screen
      return () => {
        float1Animation.stop();
        float2Animation.stop();
      };
    }, [user?.id, headerAnim, float1, float2, fetchUserProgress])
  );

  const categoryLabels: Record<string, string> = {
    math: 'Matematik',
    language: 'Dil',
    logic: 'Mantık',
    memory: 'Hafıza',
    science: 'Bilim',
    fun: 'Eğlence',
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }
    return `${minutes}dk`;
  };

  const totalGames = stats.totalGamesInApp;
  const completionRate = totalGames > 0 ? Math.round((stats.completedGames / totalGames) * 100) : 0;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Colors.spacePurple, Colors.energyOrange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.titleDark}>İlerleme</Text>
          <Text style={styles.subtitleDark}>Neler başardın, bir gözat!</Text>
        </View>
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

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#48BB78' }]}>
            <Trophy size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{stats.totalScore}</Text>
          <Text style={styles.statLabel}>Toplam Skor</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4299E1' }]}>
            <Target size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{stats.completedGames}</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#F6AD55' }]}>
            <Star size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{stats.averageScore}</Text>
          <Text style={styles.statLabel}>Ort. Skor</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#ED8936' }]}>
            <Clock size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{formatTime(stats.totalTime)}</Text>
          <Text style={styles.statLabel}>Süre</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color="#2D3748" />
          <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Tamamlanan Oyunlar</Text>
            <Text style={styles.progressValue}>{stats.completedGames} / {totalGames}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${completionRate}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategori Performansı</Text>

        {Object.entries(categories).map(([category, catData]) => {
          const categoryCompletion = catData.total > 0
            ? Math.round((catData.completed / catData.total) * 100)
            : 0;

          return (
            <View key={category} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{categoryLabels[category] || category}</Text>
                <Text style={styles.categoryScore}>{catData.score} Skor</Text>
              </View>

              <View style={styles.categoryStats}>
                <Text style={styles.categoryText}>
                  {catData.completed} / {catData.total} tamamlandı
                </Text>
                <Text style={[styles.categoryPercentage, { color: categoryCompletion === 100 ? '#48BB78' : '#4299E1' }]}>
                  %{categoryCompletion}
                </Text>
              </View>

              <View style={styles.categoryProgressBar}>
                <View
                  style={[
                    styles.categoryProgressFill,
                    { width: `${categoryCompletion}%` }
                  ]}
                />
              </View>
            </View>
          );
        })}

        {Object.keys(categories).length === 0 && stats.completedGames > 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Toplam {stats.completedGames} oyun tamamlandı</Text>
            <Text style={styles.emptySubtext}>Kategori bazlı istatistikler için oyun oynamaya devam edin!</Text>
          </View>
        )}

        {Object.keys(categories).length === 0 && stats.completedGames === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Henüz oyun oynamadınız</Text>
            <Text style={styles.emptySubtext}>Oyun oynamaya başlayın ve ilerlemenizi takip edin!</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  greetingDark: {
    fontSize: 16,
    color: Colors.pureWhite,
  },
  userNameDark: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.pureWhite,
    letterSpacing: 0.5,
  },
  avatarContainerDark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarTextDark: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.pureWhite,
  },
  titleDark: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleDark: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  floatShape: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 1,
  },
  floatShapeSmall: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    opacity: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4299E1',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#48BB78',
    borderRadius: 4,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#48BB78',
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#718096',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#4299E1',
    borderRadius: 3,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53E3E',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});
